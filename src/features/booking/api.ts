import { clearAuthSession, getAuthSession } from "@/src/lib/storage";

const rawBase = process.env.EXPO_PUBLIC_API_URL ?? "https://fix-global-backend.onrender.com";
const API_BASE_URL = rawBase.replace(/\/+$/g, "").replace(/\/api$/g, "");

export interface BookingRecord {
  id?: string;
  bookingId?: string;
  status?: string;
  serviceName?: string;
  serviceId?: string;
  notes?: string;
  address?: string;
  scheduledFor?: string;
  priceEstimate?: number | string;
  price?: number | string;
  isEmergency?: boolean;
  isRecurring?: boolean;
  createdAt?: string;
  updatedAt?: string;
  fixer?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
  } | null;
  customer?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
}

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function handleExpiredSession(json: any, status?: number): Promise<never> {
  const message =
    json?.message ||
    (status === 401 ? "Your session has expired. Please log in again." : "Unauthorized");

  try {
    await clearAuthSession();
    console.log("[booking] session cleared after expired response", { status, message });
  } catch (error) {
    console.warn("[booking] failed to clear expired session", error);
  }

  throw new Error(message);
}

async function getAuthHeaders(extra: Record<string, string> = {}): Promise<Record<string, string>> {
  const session = await getAuthSession();
  return {
    Accept: "application/json",
    ...extra,
    ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
  };
}

function extractBookingsPayload(json: any): BookingRecord[] {
  if (Array.isArray(json)) return json as BookingRecord[];
  if (Array.isArray(json?.data?.bookings)) return json.data.bookings as BookingRecord[];
  if (Array.isArray(json?.data)) return json.data as BookingRecord[];
  if (Array.isArray(json?.bookings)) return json.bookings as BookingRecord[];
  if (json && typeof json === "object" && "booking" in json && Array.isArray((json as any).booking)) {
    return (json as any).booking as BookingRecord[];
  }
  if (json && typeof json === "object" && "data" in json && json.data && typeof json.data === "object" && "booking" in json.data && Array.isArray((json.data as any).booking)) {
    return (json.data as any).booking as BookingRecord[];
  }
  return [];
}

export async function getBookings(params?: {
  page?: number;
  limit?: number;
  status?: string;
  upcomingOnly?: boolean;
}): Promise<{ bookings: BookingRecord[]; total?: number; page?: number; limit?: number }> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);
  if (params?.upcomingOnly) query.set("upcomingOnly", "true");

  const url = `${API_BASE_URL}/bookings${query.toString() ? `?${query.toString()}` : ""}`;
  const res = await fetch(url, { headers: await getAuthHeaders() });
  const json = await parseJsonSafe(res);

  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not load bookings (${res.status})`);
  }

  const bookings = extractBookingsPayload(json);
  return {
    bookings,
    total: typeof json?.total === "number" ? json.total : undefined,
    page: typeof json?.page === "number" ? json.page : undefined,
    limit: typeof json?.limit === "number" ? json.limit : undefined,
  };
}

export async function getBookingById(id: string): Promise<{ booking: BookingRecord }> {
  const res = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(id)}`, {
    headers: await getAuthHeaders(),
  });
  const json = await parseJsonSafe(res);

  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not load booking (${res.status})`);
  }

  return { booking: (json?.booking ?? json?.data?.booking ?? json) as BookingRecord };
}

export async function getBookingHistory(id: string) {
  const res = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(id)}/history`, {
    headers: await getAuthHeaders(),
  });
  const json = await parseJsonSafe(res);

  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not load booking history (${res.status})`);
  }

  return json;
}

export async function createBooking(payload: {
  fixerId?: string;
  serviceName: string;
  serviceId?: string;
  notes?: string;
  address: string;
  scheduledFor?: string;
  priceEstimate?: number;
  isEmergency?: boolean;
  isRecurring?: boolean;
}) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: await getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not create booking (${res.status})`);
  }

  return json;
}

export async function acceptBooking(id: string) {
  const res = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(id)}/accept`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not accept booking (${res.status})`);
  }
  return json;
}

export async function rejectBooking(id: string, payload?: { reason?: string }) {
  const res = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(id)}/reject`, {
    method: "PATCH",
    headers: await getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload ?? {}),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not reject booking (${res.status})`);
  }
  return json;
}

export async function cancelBooking(id: string, payload?: { reason?: string }) {
  const res = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(id)}/cancel`, {
    method: "PATCH",
    headers: await getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload ?? {}),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not cancel booking (${res.status})`);
  }
  return json;
}

export async function rescheduleBooking(id: string, payload: { scheduledFor: string; reason?: string }) {
  const res = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(id)}/reschedule`, {
    method: "PATCH",
    headers: await getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not reschedule booking (${res.status})`);
  }
  return json;
}

export async function attachBookingImages(id: string, imageUrls: string[]) {
  const res = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(id)}/images`, {
    method: "POST",
    headers: await getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ imageUrls }),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not attach booking images (${res.status})`);
  }
  return json;
}

export async function getIncomingBookingsForCustomer() {
  const res = await fetch(`${API_BASE_URL}/bookings/customer/incoming`, {
    headers: await getAuthHeaders(),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not load incoming bookings (${res.status})`);
  }
  return { bookings: extractBookingsPayload(json) };
}

export async function getActiveBookingsForCustomer() {
  const res = await fetch(`${API_BASE_URL}/bookings/customer/active`, {
    headers: await getAuthHeaders(),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not load active bookings (${res.status})`);
  }
  return { bookings: extractBookingsPayload(json) };
}

export async function getCompletedBookingsForCustomer() {
  const res = await fetch(`${API_BASE_URL}/bookings/customer/completed`, {
    headers: await getAuthHeaders(),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not load completed bookings (${res.status})`);
  }
  return { bookings: extractBookingsPayload(json) };
}

export async function getIncomingBookingsForFixer() {
  const res = await fetch(`${API_BASE_URL}/bookings/fixer/incoming`, {
    headers: await getAuthHeaders(),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not load fixer incoming bookings (${res.status})`);
  }
  return { bookings: extractBookingsPayload(json) };
}

export async function getActiveBookingsForFixer() {
  const res = await fetch(`${API_BASE_URL}/bookings/fixer/active`, {
    headers: await getAuthHeaders(),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not load fixer active bookings (${res.status})`);
  }
  return { bookings: extractBookingsPayload(json) };
}

export async function getCompletedBookingsForFixer() {
  const res = await fetch(`${API_BASE_URL}/bookings/fixer/completed`, {
    headers: await getAuthHeaders(),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not load fixer completed bookings (${res.status})`);
  }
  return { bookings: extractBookingsPayload(json) };
}

export async function getBookingTracking(id: string) {
  const res = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(id)}/tracking`, {
    headers: await getAuthHeaders({ Accept: "application/json" }),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not load booking tracking (${res.status})`);
  }
  return json;
}
