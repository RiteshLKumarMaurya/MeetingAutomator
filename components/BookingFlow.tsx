"use client";

import Link from "next/link";
import Image from "next/image";
import { PhoneField, buildE164 } from "@/components/PhoneField";
import { isValidLocalPhone, CountryCode } from "@/lib/countries";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  createBooking,
  formatDateTime,
  getAvailableSlots,
  getSettings,
  type AvailableSlot,
  type Booking,
  type ConsultationSettings,
  localDateKey,
} from "@/lib/api";

enum BusinessType {
  ECOMMERCE_STORE_OWNER = "ECOMMERCE_STORE_OWNER",
  D2C_BRAND = "D2C_BRAND",
  STARTUP = "STARTUP",
  SAAS = "SAAS",
  AGENCY = "AGENCY",
  CONSULTING = "CONSULTING",
  SERVICE_BUSINESS = "SERVICE_BUSINESS",
  OTHER = "OTHER",
}

enum LeadSource {
  WEBSITE = "WEBSITE",
  GOOGLE = "GOOGLE",
  LINKEDIN = "LINKEDIN",
  INSTAGRAM = "INSTAGRAM",
  REFERRAL = "REFERRAL",
  WHATSAPP = "WHATSAPP",
  OTHER = "OTHER",
}

const businessTypes: Array<[BusinessType, string]> = [
  [BusinessType.ECOMMERCE_STORE_OWNER, "E-commerce store"],
  [BusinessType.D2C_BRAND, "D2C brand"],
  [BusinessType.STARTUP, "Startup"],
  [BusinessType.SAAS, "SaaS"],
  [BusinessType.AGENCY, "Agency"],
  [BusinessType.CONSULTING, "Consulting"],
  [BusinessType.SERVICE_BUSINESS, "Service business"],
  [BusinessType.OTHER, "Other"],
];

const leadSources: Array<[LeadSource, string]> = [
  [LeadSource.WEBSITE, "Website"],
  [LeadSource.GOOGLE, "Google"],
  [LeadSource.LINKEDIN, "LinkedIn"],
  [LeadSource.INSTAGRAM, "Instagram"],
  [LeadSource.REFERRAL, "Referral"],
  [LeadSource.WHATSAPP, "WhatsApp"],
  [LeadSource.OTHER, "Other"],
];

function zonedToday(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(`${values.year}-${values.month}-${values.day}T12:00:00`);
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12);
}

function monthTitle(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

function dayNumber(date: Date) {
  return date.getDate();
}

export function BookingFlow() {
  const [settings, setSettings] = useState<ConsultationSettings | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1, 12));
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settingsRetry, setSettingsRetry] = useState(0);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsappNumber: "",
    companyName: "",
    businessType: "",
    leadSource: "WEBSITE",
    notes: "",
    countryCode: CountryCode.IN,
  });

  useEffect(() => {
    getSettings()
      .then((value) => {
        setSettings(value);
        const today = zonedToday(value.timezone);
        setCalendarMonth(monthStart(today));
        setSelectedDate(localDateKey(today));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load consultation settings."))
      .finally(() => setLoadingSettings(false));
  }, [settingsRetry]);

  useEffect(() => {
    if (!selectedDate || !settings) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    setError("");
    getAvailableSlots(selectedDate)
      .then(setSlots)
      .catch((err) => {
        setSlots([]);
        setError(err instanceof Error ? err.message : "Unable to load available slots.");
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, settings]);

  const calendarDays = useMemo(() => {
    const first = monthStart(calendarMonth);
    const firstWeekday = first.getDay();
    const start = addDays(first, -firstWeekday);
    return Array.from({ length: 42 }, (_, index) => addDays(start, index));
  }, [calendarMonth]);

  const todayKey = settings ? localDateKey(zonedToday(settings.timezone)) : localDateKey(new Date());
  const maxDateKey = settings ? localDateKey(addDays(zonedToday(settings.timezone), settings.maximumAdvanceDays)) : todayKey;

  const chooseDate = (date: Date) => {
    if (!settings) return;
    const key = localDateKey(date);
    if (key < todayKey || key > maxDateKey) return;
    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date).toUpperCase();
    if (!settings.workingDays.includes(weekday)) return;
    setSelectedDate(key);
    setStep(1);
  };

  const submit = async () => {
    if (!selectedSlot) return;
    setError("");
    setSubmitting(true);
    try {
      const name = form.name.trim();
      const email = form.email.trim();
      const whatsapp = buildE164(form.countryCode, form.whatsappNumber);

      if (name.length < 2) {
        throw new Error("Please enter your full name.");
      }
      const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      if (!emailIsValid) {
        throw new Error("Please enter a valid email address.");
      }
      const localDigits = form.whatsappNumber.replace(/\D/g, "");
      const phoneDigits = whatsapp.replace(/\D/g, "");
      // The UI accepts at most 10 local digits. The backend expects the country
      // code + local number as digits only (for example India: 919876543210).
      if (!isValidLocalPhone(localDigits) || phoneDigits.length < 10 || phoneDigits.length > 15) {
        throw new Error("Please enter a valid 10-digit WhatsApp number.");
      }
      const result = await createBooking({
        name,
        email,
        whatsappNumber: whatsapp,
        companyName: form.companyName.trim() || undefined,
        requestedAt: selectedSlot.start,
        notes: form.notes.trim() || undefined,
        leadSource: form.leadSource || undefined,
        businessType: form.businessType || undefined,
        platform: "MEETINGAUTOMATOR",
      });
      setBooking(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create the booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSettings) {
    return <div className="booking-card"><div className="empty-state">Loading your consultation availability…</div></div>;
  }

  if (!settings) {
    return (
      <div className="booking-card">
        <div className="empty-state">
          <div className="h3">Availability is temporarily unavailable.</div>
          <p className="muted" style={{ marginTop: 8 }}>We could not load the consultation calendar. Please try again in a moment.</p>
          {error && <div className="form-error" style={{ marginTop: 16 }}>{error}</div>}
          <button className="btn btn-primary" type="button" style={{ marginTop: 18 }} onClick={() => {
            setError("");
            setLoadingSettings(true);
            setSettingsRetry((value) => value + 1);
          }}>Try again</button>
        </div>
      </div>
    );
  }

  if (!settings.enabled) {
    return (
      <div className="booking-card">
        <div className="empty-state">
          <div className="h3">Consultation booking is currently paused.</div>
          <p className="muted" style={{ marginTop: 8 }}>Please check back soon or contact us if you need to discuss your setup.</p>
          <Link className="btn btn-secondary" href="/" style={{ marginTop: 18 }}>Back to website</Link>
        </div>
      </div>
    );
  }

  if (booking) {
    const confirmed = booking.status === "CONFIRMED" && booking.meetingLink;
    return (
      <div className="booking-card">
        <div className="success-panel">
          <div className="success-mark">✓</div>
          <SectionHeading title={confirmed ? "Your meeting is confirmed" : "Your consultation request is in"} />
          <p className="muted" style={{ maxWidth: 590, margin: "10px auto 0", lineHeight: 1.7 }}>
            {confirmed
              ? "You are all set. Your Google Meet link is ready below, and your confirmation email contains the same details."
              : "We have received your request. We will review the slot and send the confirmation email with your Google Meet link once it is approved."}
          </p>

          <div className="success-meta">
            <div className="meta-box"><small>Booking ID</small><strong>{booking.bookingId}</strong></div>
            <div className="meta-box"><small>Requested time</small><strong>{formatDateTime(booking.scheduledAt, settings?.timezone)}</strong></div>
          </div>

          <div className="meet-box">
            <strong>{confirmed ? "Join your Google Meet" : "How you will join"}</strong>
            <p>
              {confirmed
                ? "Use the button below at your scheduled time. The meeting is also added to your calendar."
                : "After approval, Google Calendar will create the meeting and you will receive a confirmation email containing the Google Meet link and a secure manage link."}
            </p>
            {confirmed && (
              <a className="btn btn-primary" href={booking.meetingLink || "#"} target="_blank" rel="noreferrer">Join Google Meet</a>
            )}
          </div>

          <div className="form-actions" style={{ justifyContent: "center", marginTop: 24 }}>
            <Link className="btn btn-secondary" href="/">Back to website</Link>
            <Link className="btn btn-primary" href="/workflow">See the workflow</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-card">
      <div className="booking-stepper">
        <div className={`step-chip ${step === 1 ? "active" : ""}`}><span className="step-num">1</span> Time</div>
        <div className={`step-chip ${step === 2 ? "active" : ""}`}><span className="step-num">2</span> Details</div>
      </div>

      {error && <div className="form-error">{error}</div>}

      {step === 1 ? (
        <>
          <div style={{ marginBottom: 16 }}><div className="h3">1. Pick your date & time</div><p className="muted" style={{ fontSize: 13, margin: "7px 0 0" }}>Choose a live slot. You can change it later through your private booking link.</p></div>
          <div className="calendar-layout">
            <div className="calendar-box">
              <div className="calendar-header">
                <strong>{monthTitle(calendarMonth)}</strong>
                <div className="calendar-nav">
                  <button className="icon-button" type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1, 12))} aria-label="Previous month">‹</button>
                  <button className="icon-button" type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1, 12))} aria-label="Next month">›</button>
                </div>
              </div>
              <div className="week-grid">
                {Array.from({ length: 7 }, (_, index) => <div className="weekday" key={index}>{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][index]}</div>)}
                {calendarDays.map((date) => {
                  const key = localDateKey(date);
                  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date).toUpperCase();
                  const disabled = key < todayKey || key > maxDateKey || !settings?.workingDays.includes(weekday);
                  return (
                    <button key={key} type="button" className={`day-button ${disabled ? "disabled" : ""} ${key === selectedDate ? "selected" : ""}`} disabled={disabled} onClick={() => chooseDate(date)}>
                      {dayNumber(date)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="calendar-box slots">
              <div className="slots-title">
                <strong>Available times</strong>
                <span>{selectedDate || "Select a date"}</span>
              </div>
              {loadingSlots ? (
                <div className="empty-state">Checking live availability…</div>
              ) : slots.filter((slot) => slot.available).length ? (
                <div className="slot-grid">
                  {slots.filter((slot) => slot.available).map((slot) => (
                    <button key={slot.start} type="button" className={`slot-button ${selectedSlot?.start === slot.start ? "selected" : ""}`} onClick={() => setSelectedSlot(slot)}>
                      {slot.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="empty-state">No open slots for this date. Choose another working day.</div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="button" disabled={!selectedSlot} onClick={() => { setError(""); setStep(2); }}>Continue</button>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <div className="h3">2. Tell us about the workflow</div>
            <p className="muted" style={{ fontSize: 13, margin: "7px 0 0" }}>
              {selectedSlot && formatDateTime(selectedSlot.start, settings?.timezone)} · Guest booking · No account required
            </p>
          </div>

          <div className="form-grid">
            <Field label="Full name" required><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" autoComplete="name" /></Field>
            <Field label="Email" required><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" autoComplete="email" /></Field>
            <Field label="WhatsApp number" required><PhoneField value={form.whatsappNumber} countryCode={form.countryCode} onCountryChange={(countryCode) => setForm({ ...form, countryCode })} onChange={(value) => setForm({ ...form, whatsappNumber: value })} /></Field>
            <Field label="Company / website"><input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="Company name" /></Field>
            <Field label="Business type"><select value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })}><option value="">Select one</option>{businessTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
            <Field label="How did you find us?"><select value={form.leadSource} onChange={(e) => setForm({ ...form, leadSource: e.target.value })}>{leadSources.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
            <Field label="What would you like to automate?" full><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Tell us what happens today: how people request meetings, who approves them, and where the manual work appears." maxLength={1000} /></Field>
          </div>

          <div className="form-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setStep(1)}>Back</button>
            <button className="btn btn-primary" type="button" disabled={submitting} onClick={submit}>{submitting ? "Booking…" : "Request consultation"}</button>
          </div>
        </>
      )}
    </div>
  );
}

function Field({ label, required, full, children }: { label: string; required?: boolean; full?: boolean; children: ReactNode }) {
  return <div className={`field ${full ? "full" : ""}`}><label>{label}{required ? " *" : ""}</label>{children}</div>;
}

function SectionHeading({ title }: { title: string }) {
  return <h1 className="h2" style={{ margin: 0 }}>{title}</h1>;
}

export function BookingSide() {
  return (
    <aside className="booking-side">
      <div className="booking-brand">
        <Image src="/logos/logo-mark.png" alt="" width={80} height={80} />
        <div><strong>Meeting Automator</strong><div className="booking-subtitle">One-to-one consultation</div></div>
      </div>
      <p>Bring us the process you have today. We’ll look at where prospects get stuck, where your team spends time, and what should happen automatically after a meeting is requested.</p>
      <div className="booking-points">
        <div className="booking-point"><span className="point-dot" />Map your current booking journey</div>
        <div className="booking-point"><span className="point-dot" />Approval, calendar + Google Meet automation</div>
        <div className="booking-point"><span className="point-dot" />Integrate into your website or build a new consultation site</div>
        <div className="booking-point"><span className="point-dot" />Clear implementation path and engagement scope</div>
      </div>
      <div className="booking-note">
        Your booking is a guest request. No account or login is required.
      </div>
    </aside>
  );
}
