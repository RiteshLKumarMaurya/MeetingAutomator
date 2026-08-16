"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  cancelGuestBooking,
  formatDateTime,
  getAvailableSlots,
  getGuestBooking,
  getSettings,
  rescheduleGuestBooking,
  type AvailableSlot,
  type ConsultationSettings,
  type GuestBooking,
} from "@/lib/api";

function zonedDateKey(timeZone: string, instant = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(instant);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addDaysFromKey(key: string, days: number) {
  const date = new Date(`${key}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function ManageBooking({ token }: { token: string }) {
  const [booking, setBooking] = useState<GuestBooking | null>(null);
  const [settings, setSettings] = useState<ConsultationSettings | null>(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"view" | "reschedule" | "cancel">("view");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    Promise.all([getGuestBooking(token), getSettings()])
      .then(([bookingData, settingsData]) => {
        setBooking(bookingData);
        setSettings(settingsData);
        setDate(zonedDateKey(settingsData.timezone, new Date(bookingData.scheduledAt)));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "This management link is invalid or expired."))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!date || !settings || mode !== "reschedule") return;
    getAvailableSlots(date)
      .then(setSlots)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load slots."));
  }, [date, settings, mode]);

  const doReschedule = async (scheduledAt: string) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const next = await rescheduleGuestBooking({ token, scheduledAt, notes: notes.trim() || undefined });
      setBooking(next);
      setMessage("Your meeting was rescheduled. A confirmation email has been sent, and this same secure management link remains valid.");
      setMode("view");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reschedule this booking.");
    } finally {
      setBusy(false);
    }
  };

  const doCancel = async () => {
    if (reason.trim().length < 2) {
      setError("Please provide a short cancellation reason.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const next = await cancelGuestBooking({ token, reason: reason.trim() });
      setBooking(next);
      setMessage("Your consultation has been cancelled successfully.");
      setMode("view");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to cancel this booking.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="manage-card"><div className="empty-state">Loading your booking…</div></div>;
  if (error && !booking) return <div className="manage-card"><div className="form-error">{error}</div><Link className="btn btn-secondary" href="/consultation">Book a new consultation</Link></div>;
  if (!booking || !settings) return null;

  const cancelled = booking.status === "CANCELLED";
  const confirmed = booking.status === "CONFIRMED";

  return (
    <div className="manage-grid">
      <div className="manage-card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 15, alignItems: "start" }}>
          <div>
            <div className="muted" style={{ fontSize: 12 }}>Booking {booking.bookingId}</div>
            <h1 className="h2" style={{ marginTop: 8 }}>{booking.customerName}</h1>
          </div>
          <span className="manage-status" style={cancelled ? { background: "#fef2f2", color: "#b91c1c" } : confirmed ? undefined : { background: "#fff7ed", color: "#c2410c" }}>{booking.status}</span>
        </div>

        <div className="success-meta" style={{ marginTop: 26 }}>
          <div className="meta-box"><small>Scheduled time</small><strong>{formatDateTime(booking.scheduledAt, settings.timezone)}</strong></div>
          <div className="meta-box"><small>Company</small><strong>{booking.companyName || "Not provided"}</strong></div>
        </div>

        {message && <div className="form-success">{message}</div>}
        {error && <div className="form-error">{error}</div>}

        {confirmed && booking.meetingLink && (
          <div className="meet-box">
            <strong>Google Meet</strong>
            <p>Your meeting link stays available here while this secure management link is valid.</p>
            <a className="btn btn-primary" href={booking.meetingLink} target="_blank" rel="noreferrer">Join meeting</a>
          </div>
        )}

        {mode === "view" && !cancelled && (
          <div className="manage-actions">
            {booking.canReschedule && <button className="btn btn-secondary" type="button" onClick={() => { setMode("reschedule"); setError(""); }}>Reschedule meeting</button>}
            {booking.canCancel && <button className="btn btn-secondary" type="button" onClick={() => { setMode("cancel"); setError(""); }}>Cancel consultation</button>}
          </div>
        )}

        {mode === "reschedule" && !cancelled && (
          <div style={{ marginTop: 24 }}>
            <div className="h3">Choose a new time</div>
            <p className="muted" style={{ fontSize: 13 }}>You have {booking.reschedulesRemaining} reschedule(s) remaining.</p>
            <div className="form-grid" style={{ marginTop: 15 }}>
              <div className="field full"><label>Date</label><input type="date" value={date} min={zonedDateKey(settings.timezone)} max={addDaysFromKey(zonedDateKey(settings.timezone), settings.maximumAdvanceDays)} onChange={(e) => setDate(e.target.value)} /></div>
              <div className="field full"><label>Available time</label><div className="slot-grid">{slots.filter((slot) => slot.available).map((slot) => <button className="slot-button" key={slot.start} type="button" disabled={busy} onClick={() => doReschedule(slot.start)}>{slot.label}</button>)}</div></div>
              <div className="field full"><label>Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} placeholder="Optional note" /></div>
            </div>
            <div className="form-actions"><button className="btn btn-secondary" type="button" onClick={() => setMode("view")}>Back</button></div>
          </div>
        )}

        {mode === "cancel" && !cancelled && (
          <div style={{ marginTop: 24 }}>
            <div className="h3">Cancel this consultation?</div>
            <p className="muted" style={{ fontSize: 13 }}>This action will cancel the scheduled meeting.</p>
            <div className="field" style={{ marginTop: 15 }}><label>Reason</label><textarea value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} placeholder="Reason for cancellation" /></div>
            <div className="form-actions"><button className="btn btn-secondary" type="button" onClick={() => setMode("view")}>Back</button><button className="btn btn-primary" type="button" disabled={busy} onClick={doCancel}>{busy ? "Cancelling…" : "Confirm cancellation"}</button></div>
          </div>
        )}
      </div>

      <aside className="manage-card">
        <div className="h3">What happens next?</div>
        <div className="booking-points" style={{ marginTop: 18 }}>
          <div className="booking-point" style={{ color: "#475569" }}><span className="point-dot" />Keep this private link. It is your secure way to manage the booking.</div>
          <div className="booking-point" style={{ color: "#475569" }}><span className="point-dot" />If the meeting is confirmed, join using the Google Meet link above or the email confirmation.</div>
          <div className="booking-point" style={{ color: "#475569" }}><span className="point-dot" />If you reschedule, this same secure management link remains valid so you can manage the updated booking.</div>
        </div>
      </aside>
    </div>
  );
}
