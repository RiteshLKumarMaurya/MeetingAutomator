"use client";

import { useEffect, useMemo, useState } from "react";
import {
  adminLogin,
  approveAdminBooking,
  cancelAdminBooking,
  completeAdminBooking,
  getAdminBooking,
  getAdminBookings,
  getAvailableSlots,
  rescheduleAdminBooking,
  type AdminBookingDetails,
  type AdminBookingSummary,
  type AdminDashboard,
  refreshAdminAccessToken,
  type AvailableSlot,
} from "@/lib/api";

const TOKEN_KEY = "meetingautomator_admin_access_token";
const REFRESH_TOKEN_KEY = "meetingautomator_admin_refresh_token";

function fmt(iso?: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
  }).format(new Date(iso));
}

function statusClass(status: string) {
  return `admin-status admin-status-${status.toLowerCase().replace("_", "-")}`;
}

export function AdminConsole() {
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const saved = window.sessionStorage.getItem(TOKEN_KEY);
      if (saved) {
        if (active) setToken(saved);
        if (active) setReady(true);
        return;
      }

      const refreshed = await refreshAdminAccessToken();
      if (active && refreshed) setToken(refreshed);
      if (active) setReady(true);
    };

    void restoreSession();
    return () => { active = false; };
  }, []);

  if (!ready) return null;
  if (!token) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-logo-mark">M</div>
          <div className="admin-kicker">MEETING AUTOMATOR · OPERATIONS</div>
          <h1>Consultation Desk</h1>
          <p>Approve, reschedule and cancel consultation bookings from one place.</p>
          <form onSubmit={async (e) => {
            e.preventDefault(); setLoginError(""); setLoginBusy(true);
            try {
              const result = await adminLogin(phone, password);
              if (result.userProfileResponse?.roleName !== "ROLE_ADMIN") throw new Error("This account does not have admin access.");
              window.sessionStorage.setItem(TOKEN_KEY, result.tokenResponse.accessToken);
              window.sessionStorage.setItem(REFRESH_TOKEN_KEY, result.tokenResponse.refreshToken);
              setToken(result.tokenResponse.accessToken);
            } catch (err) {
              setLoginError(err instanceof Error ? err.message : "Unable to sign in.");
            } finally { setLoginBusy(false); }
          }}>
            <label className="admin-field"><span>Phone number</span><input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91..." /></label>
            <label className="admin-field"><span>Password</span><input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your admin password" /></label>
            {loginError && <div className="form-error">{loginError}</div>}
            <button className="btn btn-primary btn-block" disabled={loginBusy}>{loginBusy ? "Signing in…" : "Open consultation desk"}</button>
          </form>
          <div className="admin-login-note">Admin access is protected by the backend role system. No credentials are stored in the frontend.</div>
        </div>
      </div>
    );
  }

  return <AdminWorkspace token={token} onLogout={() => { window.sessionStorage.removeItem(TOKEN_KEY); window.sessionStorage.removeItem(REFRESH_TOKEN_KEY); setToken(""); }} />;
}

function AdminWorkspace({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [bookings, setBookings] = useState<AdminBookingSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<AdminBookingDetails | null>(null);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [mode, setMode] = useState<"view" | "reschedule" | "cancel">("view");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [cancelReason, setCancelReason] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());

      // The backend dashboard endpoint is global across platforms. Build the
      // dashboard counters from the platform-filtered booking endpoint instead
      // so Meeting Automator never shows GrocerFlow numbers.
      const [filtered, all, pending, confirmed, todayBookings] = await Promise.all([
        getAdminBookings(token, { page: 0, size: 30, keyword, status }),
        getAdminBookings(token, { page: 0, size: 1 }),
        getAdminBookings(token, { page: 0, size: 1, status: "PENDING" }),
        getAdminBookings(token, { page: 0, size: 1, status: "CONFIRMED" }),
        getAdminBookings(token, { page: 0, size: 1, fromDate: today, toDate: today }),
      ]);

      setBookings(filtered.content);
      setTotal(filtered.totalElements);
      setDashboard({
        totalBookings: all.totalElements,
        pendingBookings: pending.totalElements,
        confirmedBookings: confirmed.totalElements,
        completedBookings: 0,
        cancelledBookings: 0,
        noShowBookings: 0,
        todayBookings: todayBookings.totalElements,
      });

      if (selected) {
        try { setSelected(await getAdminBooking(token, selected.bookingId)); } catch {}
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load the consultation desk.";
      setError(message);
      if (/unauthorized|forbidden|access|token|expired/i.test(message)) onLogout();
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [token, status]); // eslint-disable-line react-hooks/exhaustive-deps

  const openBooking = async (id: string) => {
    setError(""); setNotice("");
    try { setSelected(await getAdminBooking(token, id)); setMode("view"); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to open booking."); }
  };

  const runAction = async (action: () => Promise<AdminBookingDetails>, success: string) => {
    if (!selected) return;
    setActionBusy(true); setError(""); setNotice("");
    try { const next = await action(); setSelected(next); setMode("view"); setNotice(success); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Action failed."); }
    finally { setActionBusy(false); }
  };

  const approve = () => runAction(
    () => approveAdminBooking(token, selected!.bookingId, { scheduledAt: selected!.scheduledAt }),
    "Booking approved. Calendar + meeting confirmation are being handled by the backend."
  );

  const cancel = () => {
    if (cancelReason.trim().length < 2) { setError("Add a short cancellation reason."); return; }
    return runAction(
      () => cancelAdminBooking(token, selected!.bookingId, { cancelReason: cancelReason.trim(), releaseSlot: true }),
      "Booking cancelled and the slot was released."
    );
  };

  const chooseRescheduleDate = async (date: string) => {
    setRescheduleDate(date); setError("");
    if (!date) return;
    try { setSlots(await getAvailableSlots(date)); }
    catch (err) { setSlots([]); setError(err instanceof Error ? err.message : "Unable to load available slots."); }
  };

  const reschedule = (slot: AvailableSlot) => runAction(
    () => rescheduleAdminBooking(token, selected!.bookingId, { scheduledAt: slot.start }),
    "Booking rescheduled and the guest will receive the updated meeting details."
  );

  const counts = useMemo(() => dashboard ? [
    ["Total", dashboard.totalBookings, "all"],
    ["Pending", dashboard.pendingBookings, "pending"],
    ["Confirmed", dashboard.confirmedBookings, "confirmed"],
    ["Today", dashboard.todayBookings, "today"],
  ] as [string, number, string][] : [], [dashboard]);

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span>MA</span><div><strong>Meeting Automator</strong><small>Operations</small></div></div>
        <div className="admin-nav-title">WORKSPACE</div>
        <button className="admin-nav active">Overview</button>
        <button className="admin-nav" onClick={() => document.getElementById("admin-bookings")?.scrollIntoView({ behavior: "smooth" })}>Consultations</button>
        <button className="admin-nav" onClick={() => document.getElementById("admin-actions")?.scrollIntoView({ behavior: "smooth" })}>Booking actions</button>
        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-tip"><strong>Client flow</strong><span>Guest books → admin reviews → meeting is confirmed → guest can self-manage.</span></div>
          <button className="admin-nav logout" onClick={onLogout}>Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><span className="admin-kicker">MEETING AUTOMATOR</span><h1>Consultation Desk</h1></div>
          <button className="btn btn-secondary" onClick={load}>Refresh</button>
        </header>

        {error && <div className="admin-alert error">{error}</div>}
        {notice && <div className="admin-alert success">{notice}</div>}

        <section className="admin-stats">
          {counts.map(([label, value, key]) => <div className="admin-stat" key={key}><span>{label}</span><strong>{value}</strong><small>{key === "today" ? "scheduled today" : key === "pending" ? "waiting for review" : key === "confirmed" ? "ready to meet" : "across this workflow"}</small></div>)}
        </section>

        <section className="admin-work-grid" id="admin-bookings">
          <div className="admin-panel">
            <div className="admin-panel-head">
              <div><span className="admin-kicker">BOOKING PIPELINE</span><h2>Consultations</h2><p>{total} Meeting Automator booking{total === 1 ? "" : "s"} matched.</p></div>
              <div className="admin-filters">
                <input value={keyword} onChange={e => setKeyword(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} placeholder="Search name, email, company…" />
                <select value={status} onChange={e => setStatus(e.target.value)}><option value="">All statuses</option><option value="PENDING">Pending</option><option value="CONFIRMED">Confirmed</option><option value="CANCELLED">Cancelled</option><option value="COMPLETED">Completed</option><option value="NO_SHOW">No show</option></select>
                <button className="btn btn-secondary" onClick={load}>Search</button>
              </div>
            </div>
            {loading ? <div className="admin-empty">Loading bookings…</div> : bookings.length === 0 ? <div className="admin-empty">No consultations match these filters.</div> : (
              <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Client</th><th>Company</th><th>Scheduled</th><th>Status</th><th></th></tr></thead><tbody>
                {bookings.map(b => <tr key={b.bookingId} className={selected?.bookingId === b.bookingId ? "selected" : ""} onClick={() => openBooking(b.bookingId)}>
                  <td><strong>{b.name}</strong><span>{b.email}</span></td><td>{b.companyName || "—"}</td><td>{fmt(b.scheduledAt)}</td><td><span className={statusClass(b.status)}>{b.status}</span></td><td><button className="table-open" onClick={(e) => { e.stopPropagation(); openBooking(b.bookingId); }}>Open →</button></td>
                </tr>)}
              </tbody></table></div>
            )}
          </div>

          <aside className="admin-panel admin-detail" id="admin-actions">
            {!selected ? <div className="admin-empty detail-empty"><div className="detail-icon">↗</div><h3>Select a consultation</h3><p>Review the client context and take the next operational action without leaving the desk.</p></div> : (
              <>
                <div className="detail-head"><div><span className="admin-kicker">{selected.bookingId}</span><h2>{selected.customerName}</h2><p>{selected.companyName || "Independent / company not provided"} · {selected.email}</p></div><span className={statusClass(selected.status)}>{selected.status}</span></div>
                <div className="detail-grid">
                  <div><small>Requested</small><strong>{fmt(selected.requestedAt)}</strong></div>
                  <div><small>Scheduled</small><strong>{fmt(selected.scheduledAt)}</strong></div>
                  <div><small>WhatsApp</small><strong>{selected.whatsappNumber || "—"}</strong></div>
                  <div><small>Lead source</small><strong>{selected.leadSource || "—"}</strong></div>
                </div>
                {selected.notes && <div className="detail-note"><small>Client context</small><p>{selected.notes}</p></div>}
                {selected.meetingLink && <a className="meet-link" href={selected.meetingLink} target="_blank" rel="noreferrer">Open Google Meet ↗</a>}

                {mode === "view" && selected.status !== "CANCELLED" && selected.status !== "COMPLETED" && (
                  <div className="admin-actions">
                    {selected.status === "PENDING" && <button className="btn btn-primary" disabled={actionBusy} onClick={approve}>{actionBusy ? "Approving…" : "Approve booking"}</button>}
                    {selected.status === "CONFIRMED" && <button className="btn btn-secondary" onClick={() => { setMode("reschedule"); setRescheduleDate(selected.scheduledAt.slice(0,10)); chooseRescheduleDate(selected.scheduledAt.slice(0,10)); }}>Reschedule</button>}
                    {(selected.status === "PENDING" || selected.status === "CONFIRMED") && <button className="btn btn-danger" onClick={() => { setMode("cancel"); setCancelReason(""); }}>Cancel</button>}
                    {selected.status === "CONFIRMED" && <button className="btn btn-secondary" onClick={() => runAction(() => completeAdminBooking(token, selected.bookingId), "Marked as completed.")}>Mark complete</button>}
                  </div>
                )}

                {mode === "reschedule" && <div className="admin-action-form">
                  <div className="admin-form-head"><h3>Move this meeting</h3><button onClick={() => setMode("view")}>Close</button></div>
                  <input type="date" value={rescheduleDate} onChange={e => chooseRescheduleDate(e.target.value)} />
                  <div className="admin-slot-grid">{slots.filter(s => s.available).map(slot => <button key={slot.start} disabled={actionBusy} onClick={() => reschedule(slot)}>{slot.label}</button>)}</div>
                  {slots.length === 0 && <p className="admin-muted">Choose a date to see available times.</p>}
                </div>}

                {mode === "cancel" && <div className="admin-action-form">
                  <div className="admin-form-head"><h3>Cancel booking</h3><button onClick={() => setMode("view")}>Close</button></div>
                  <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="Why is this consultation being cancelled?" maxLength={500} />
                  <button className="btn btn-danger" disabled={actionBusy} onClick={cancel}>{actionBusy ? "Cancelling…" : "Confirm cancellation"}</button>
                </div>}
              </>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}
