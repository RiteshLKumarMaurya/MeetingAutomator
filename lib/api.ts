const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.grocerflow.com").replace(/\/$/, "");

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ConsultationSettings = {
  enabled: boolean;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  slotCapacity: number;
  bufferMinutes: number;
  minimumAdvanceMinutes: number;
  maximumAdvanceDays: number;
  maxReschedulesPer24Hours: number;
  timezone: string;
  workingDays: string[];
};

export type AvailableSlot = {
  start: string;
  end: string;
  label: string;
  available: boolean;
  remainingCapacity: number;
};

export type Booking = {
  bookingId: string;
  userId?: number | null;
  customerName: string;
  email: string;
  whatsappNumber: string;
  companyName?: string | null;
  requestedAt: string;
  scheduledAt: string;
  status: string;
  meetingLink?: string | null;
  calendarLink?: string | null;
  googleEventId?: string | null;
  cancelReason?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  businessType?: string | null;
  leadSource?: string | null;
  platform?: string | null;
};

export type GuestBooking = {
  bookingId: string;
  customerName: string;
  companyName?: string | null;
  scheduledAt: string;
  status: string;
  meetingLink?: string | null;
  canReschedule: boolean;
  canCancel: boolean;
  reschedulesUsed: number;
  reschedulesRemaining: number;
  maxReschedulesPer24Hours: number;
};

export type PackageService = {
  id: number;
  serviceResponse?: { name?: string | null; shortDescription?: string | null } | null;
  displayOrder?: number | null;
};

export type Package = {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  price?: number | null;
  currencyCode?: string | null;
  featured?: boolean | null;
  active?: boolean | null;
  services?: PackageService[] | null;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  let body: ApiEnvelope<T> | null = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok || !body?.success) {
    throw new Error(body?.message || "Something went wrong. Please try again.");
  }

  return body.data;
}

export function getSettings() {
  return request<ConsultationSettings>("/api/v1/bookings/consultation-settings");
}

export function getAvailableSlots(date: string) {
  return request<AvailableSlot[]>(`/api/v1/bookings/available-slots?date=${encodeURIComponent(date)}`);
}

export function createBooking(payload: {
  name: string;
  email: string;
  whatsappNumber: string;
  companyName?: string;
  requestedAt: string;
  notes?: string;
  leadSource?: string;
  businessType?: string;
  platform: "MEETINGAUTOMATOR";
}) {
  return request<Booking>("/api/v1/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getGuestBooking(token: string) {
  return request<GuestBooking>(`/api/v1/bookings/manage?token=${encodeURIComponent(token)}`);
}

export function rescheduleGuestBooking(payload: { token: string; scheduledAt: string; notes?: string }) {
  return request<GuestBooking>("/api/v1/bookings/manage/reschedule", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function cancelGuestBooking(payload: { token: string; reason: string }) {
  return request<GuestBooking>("/api/v1/bookings/manage/cancel", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getPackageBySlug(slug: string) {
  return request<Package>(`/api/v1/public/packages/slug/${encodeURIComponent(slug)}`);
}

export function formatDateTime(instant: string, timeZone = "Asia/Kolkata") {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(instant));
}

export function formatShortDate(instant: string, timeZone = "Asia/Kolkata") {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(instant));
}

export function localDateKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}


export type AdminDashboard = {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
  todayBookings: number;
};

export type AdminBookingSummary = {
  bookingId: string;
  name: string;
  email: string;
  whatsappNumber: string;
  companyName?: string | null;
  scheduledAt: string;
  status: string;
  platform?: string | null;
};

export type AdminBookingDetails = {
  bookingId: string;
  userId?: number | null;
  customerName: string;
  email: string;
  whatsappNumber: string;
  companyName?: string | null;
  leadSource?: string | null;
  platform?: string | null;
  status: string;
  requestedAt: string;
  scheduledAt: string;
  meetingLink?: string | null;
  googleEventId?: string | null;
  calendarLink?: string | null;
  cancelReason?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminPage<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type LoginResult = {
  userProfileResponse: {
    id: number;
    email?: string;
    phone?: string;
    fullName?: string;
    roleName?: string;
    platform?: string;
  };
  tokenResponse: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: number;
    refreshTokenExpiry: number;
  };
};

async function adminRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  return requestWithHeaders<T>(path, token, init);
}

let adminRefreshPromise: Promise<string | null> | null = null;

export async function refreshAdminAccessToken(): Promise<string | null> {
  if (adminRefreshPromise) return adminRefreshPromise;

  adminRefreshPromise = (async () => {
    try {
      if (typeof window === "undefined") return null;

      const refreshToken = window.sessionStorage.getItem("meetingautomator_admin_refresh_token");
      if (!refreshToken) return null;

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/tokens/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      });

      const body = (await response.json().catch(() => null)) as ApiEnvelope<{
        accessToken: string;
        refreshToken: string;
      }> | null;

      if (!response.ok || !body?.success || !body.data?.accessToken) {
        window.sessionStorage.removeItem("meetingautomator_admin_access_token");
        window.sessionStorage.removeItem("meetingautomator_admin_refresh_token");
        return null;
      }

      window.sessionStorage.setItem("meetingautomator_admin_access_token", body.data.accessToken);
      window.sessionStorage.setItem("meetingautomator_admin_refresh_token", body.data.refreshToken);
      return body.data.accessToken;
    } catch {
      return null;
    } finally {
      adminRefreshPromise = null;
    }
  })();

  return adminRefreshPromise;
}

async function requestWithHeaders<T>(path: string, token?: string, init?: RequestInit, allowRefresh = true): Promise<T> {
  const effectiveToken =
    token && typeof window !== "undefined"
      ? window.sessionStorage.getItem("meetingautomator_admin_access_token") || token
      : token || undefined;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {}),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (response.status === 401 && effectiveToken && allowRefresh) {
    const refreshedToken = await refreshAdminAccessToken();
    if (refreshedToken && refreshedToken !== effectiveToken) {
      return requestWithHeaders<T>(path, refreshedToken, init, false);
    }
  }

  let body: ApiEnvelope<T> | null = null;
  try { body = await response.json(); } catch { body = null; }
  if (!response.ok || !body?.success) {
    throw new Error(body?.message || "Something went wrong. Please try again.");
  }
  return body.data;
}

export async function adminLogin(fullPhoneNumber: string, password: string) {
  return requestWithHeaders<LoginResult>("/api/v1/auth/login/phone-pass", "", {
    method: "POST",
    body: JSON.stringify({
      fullPhoneNumber,
      password,
      device: "meeting-automator-admin",
      platform: "MEETINGAUTOMATOR",
    }),
  });
}

export function getAdminDashboard(token: string) {
  return adminRequest<AdminDashboard>("/api/v1/admin/bookings/dashboard", token);
}

export function getAdminBookings(token: string, params: {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}) {
  const q = new URLSearchParams();
  q.set("page", String(params.page ?? 0));
  q.set("size", String(params.size ?? 20));
  q.set("platforms", "MEETINGAUTOMATOR");
  if (params.keyword) q.set("keyword", params.keyword);
  if (params.status) q.set("statuses", params.status);
  if (params.fromDate) q.set("fromDate", params.fromDate);
  if (params.toDate) q.set("toDate", params.toDate);
  return adminRequest<AdminPage<AdminBookingSummary>>(`/api/v1/admin/bookings?${q.toString()}`, token);
}

export function getAdminBooking(token: string, bookingId: string) {
  return adminRequest<AdminBookingDetails>(`/api/v1/admin/bookings/${encodeURIComponent(bookingId)}`, token);
}

export function approveAdminBooking(token: string, bookingId: string, payload: { scheduledAt?: string; meetingLink?: string; notes?: string }) {
  return adminRequest<AdminBookingDetails>(`/api/v1/admin/bookings/${encodeURIComponent(bookingId)}/approve`, token, {
    method: "PATCH", body: JSON.stringify(payload),
  });
}

export function rescheduleAdminBooking(token: string, bookingId: string, payload: { scheduledAt: string; notes?: string }) {
  return adminRequest<AdminBookingDetails>(`/api/v1/admin/bookings/${encodeURIComponent(bookingId)}/reschedule`, token, {
    method: "PATCH", body: JSON.stringify(payload),
  });
}

export function cancelAdminBooking(token: string, bookingId: string, payload: { cancelReason: string; releaseSlot?: boolean; notes?: string }) {
  return adminRequest<AdminBookingDetails>(`/api/v1/admin/bookings/${encodeURIComponent(bookingId)}/cancel`, token, {
    method: "PATCH", body: JSON.stringify(payload),
  });
}

export function completeAdminBooking(token: string, bookingId: string) {
  return adminRequest<AdminBookingDetails>(`/api/v1/admin/bookings/${encodeURIComponent(bookingId)}/complete`, token, { method: "PATCH" });
}

export function noShowAdminBooking(token: string, bookingId: string) {
  return adminRequest<AdminBookingDetails>(`/api/v1/admin/bookings/${encodeURIComponent(bookingId)}/no-show`, token, { method: "PATCH" });
}
