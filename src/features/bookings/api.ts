// src/features/bookings/api.ts
// Minimal bookings API shim for the home components.
const rawBase = process.env.EXPO_PUBLIC_API_URL ?? "https://fix-global-backend.onrender.com";
const API_BASE_URL = rawBase.replace(/\/+$|\/api$/g, "");

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export interface Booking {
  id: string;
  serviceName: string;
  fixer?: { firstName: string; lastName: string } | null;
  scheduledFor?: string | null;
  status: string;
}

export async function getActiveBookings(): Promise<{ bookings: Booking[] }> {
  const res = await fetch(`${API_BASE_URL}/bookings/active`, { headers: { Accept: "application/json" } });
  const json = await parseJsonSafe(res);
  if (!res.ok) return { bookings: [] };
  return (json as { bookings: Booking[] }) ?? { bookings: [] };
}

export async function getCompletedBookings(): Promise<{ bookings: Booking[] }> {
  const res = await fetch(`${API_BASE_URL}/bookings?status=completed`, { headers: { Accept: "application/json" } });
  const json = await parseJsonSafe(res);
  if (!res.ok) return { bookings: [] };
  return (json as { bookings: Booking[] }) ?? { bookings: [] };
}

export async function createBooking(payload: {
  serviceName: string;
  serviceId?: string;
  address: string;
  notes?: string;
  scheduledFor?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) throw new Error(json?.message || `Could not create booking (${res.status})`);
  return json;
}

export default null as unknown as void;
