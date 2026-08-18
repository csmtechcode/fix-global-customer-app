
// // src/features/auth/api.ts

// // Normalize the base URL so consumers don't accidentally double-up `/api` segments
// const rawBase = process.env.EXPO_PUBLIC_API_URL ?? "https://fix-global-backend.onrender.com";
// const API_BASE_URL = rawBase.replace(/\/+$/g, "").replace(/\/api$/g, "");

// export interface RegisterCustomerPayload {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   password: string;
//   image?: string;
// }

// export interface CustomerUser {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   image: string | null;
//   role: string;
//   isVerified: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface RegisterCustomerResponse {
//   success: boolean;
//   message: string;
//   data: { user: CustomerUser };
// }

// async function parseJsonSafe(res: Response) {
//   try {
//     return await res.json();
//   } catch {
//     return null;
//   }
// }

// export async function registerCustomer(
//   payload: RegisterCustomerPayload,
// ): Promise<RegisterCustomerResponse> {
//   const res = await fetch(`${API_BASE_URL}/auth/register/customer`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   const json = await parseJsonSafe(res);

//   if (!res.ok) {
//     throw new Error(json?.message || `Registration failed (${res.status})`);
//   }

//   return json as RegisterCustomerResponse;
// }

// export interface VerifyOtpPayload {
//   code: string;
// }

// export interface VerifyOtpResponse {
//   success: boolean;
//   message: string;
//   data?: { user?: CustomerUser };
// }

// export async function verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
//   const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   const json = await parseJsonSafe(res);

//   if (!res.ok) {
//     throw new Error(json?.message || `Verification failed (${res.status})`);
//   }

//   return json as VerifyOtpResponse;
// }

// export async function resendVerificationCode(payload: {
//   email?: string;
//   phoneNumber?: string;
// }) {
//   const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   const json = await parseJsonSafe(res);

//   if (!res.ok) {
//     throw new Error(json?.message || `Could not resend code (${res.status})`);
//   }

//   return json;
// }

// export interface LoginPayload {
//   email: string;
//   password: string;
// }

// export interface LoginResponse {
//   success: boolean;
//   message?: string;
//   data?: {
//     accessToken?: string;
//     refreshToken?: string;
//     token?: string;
//     user?: CustomerUser;
//     // backend may use different keys; consumers should check common fields
//   };
// }

// export async function login(payload: LoginPayload): Promise<LoginResponse> {
//   const res = await fetch(`${API_BASE_URL}/auth/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//     body: JSON.stringify(payload),
//   });
//   const json = await parseJsonSafe(res);
//   if (!res.ok) {
//     const message =
//       json?.message || json?.error || json?.statusCode
//         ? `${json?.statusCode ?? res.status} ${json?.message ?? json?.error ?? "Login failed"}`
//         : `Login failed (${res.status})`;
//     throw new Error(message);
//   }
//   return json as LoginResponse;
// }

// export async function getProfile(token?: string) {
//   const headers: Record<string, string> = { Accept: "application/json" };
//   if (token) headers["Authorization"] = `Bearer ${token}`;

//   const res = await fetch(`${API_BASE_URL}/auth/profile`, {
//     method: "GET",
//     headers,
//   });

//   const json = await parseJsonSafe(res);
//   if (!res.ok) {
//     throw new Error(json?.message || `Could not fetch profile (${res.status})`);
//   }
//   return json;
// }

// // Password reset flows
// export interface ForgotPasswordPayload {
//   email: string;
// }

// export async function forgotPassword(payload: ForgotPasswordPayload) {
//   const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   const json = await parseJsonSafe(res);
//   if (!res.ok) {
//     throw new Error(json?.message || `Could not request password reset (${res.status})`);
//   }
//   return json;
// }

// export interface ResetPasswordPayload {
//   email: string;
//   token: string;
//   password: string;
// }

// export async function resetPassword(payload: ResetPasswordPayload) {
//   const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   const json = await parseJsonSafe(res);
//   if (!res.ok) {
//     throw new Error(json?.message || `Could not reset password (${res.status})`);
//   }
//   return json;
// }


// src/features/auth/api.ts

// Normalize the base URL so consumers don't accidentally double-up `/api` segments
const rawBase = process.env.EXPO_PUBLIC_API_URL ?? "https://fix-global-backend.onrender.com";
const API_BASE_URL = rawBase.replace(/\/+$/g, "").replace(/\/api$/g, "");

export interface RegisterCustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  image?: string;
}

export interface CustomerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  image: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterCustomerResponse {
  success: boolean;
  message: string;
  data: { user: CustomerUser };
}

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function handleExpiredSession(json: any, status?: number): Promise<never> {
  const message = json?.message || (status === 401 ? "Your session has expired. Please log in again." : "Unauthorized");

  try {
    const { clearAuthSession } = await import("@/src/lib/storage");
    await clearAuthSession();
    console.log("[auth] session cleared after expired response", { status, message });
  } catch (error) {
    console.warn("[auth] failed to clear expired session", error);
  }

  throw new Error(message);
}

async function getStoredToken(token?: string): Promise<string | undefined> {
  if (token) return token;

  try {
    const { getAuthSession } = await import("@/src/lib/storage");
    const session = await getAuthSession();
    return session?.token || undefined;
  } catch (error) {
    console.warn("[auth] failed to read session token", error);
    return undefined;
  }
}

export async function registerCustomer(
  payload: RegisterCustomerPayload,
): Promise<RegisterCustomerResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(json?.message || `Registration failed (${res.status})`);
  }

  return json as RegisterCustomerResponse;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: { user?: CustomerUser };
}

// ── Email OTP flow ──────────────────────────────────────────────────────────

export async function verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(json?.message || `Verification failed (${res.status})`);
  }

  return json as VerifyOtpResponse;
}

export async function resendVerificationCode(payload: {
  email?: string;
  phoneNumber?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(json?.message || `Could not resend code (${res.status})`);
  }

  return json;
}

// ── Phone OTP flow ───────────────────────────────────────────────────────────

export interface PhoneOtpPayload {
  phone: string;

}

export async function sendPhoneOtp(payload: PhoneOtpPayload) {
  const res = await fetch(`${API_BASE_URL}/auth/phone/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(json?.message || `Could not send code to phone (${res.status})`);
  }

  return json;
}

export async function verifyPhoneOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/phone/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(json?.message || `Verification failed (${res.status})`);
  }

  return json as VerifyOtpResponse;
}

export async function resendPhoneOtp(payload: PhoneOtpPayload) {
  const res = await fetch(`${API_BASE_URL}/auth/phone/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(json?.message || `Could not resend code (${res.status})`);
  }

  return json;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
    user?: CustomerUser;
    // backend may use different keys; consumers should check common fields
  };
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    const message =
      json?.message || json?.error || json?.statusCode
        ? `${json?.statusCode ?? res.status} ${json?.message ?? json?.error ?? "Login failed"}`
        : `Login failed (${res.status})`;
    throw new Error(message);
  }
  return json as LoginResponse;
}

export async function getProfile(token?: string) {
  const resolvedToken = await getStoredToken(token);
  const headers: Record<string, string> = { Accept: "application/json" };
  if (resolvedToken) headers["Authorization"] = `Bearer ${resolvedToken}`;

  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "GET",
    headers,
  });

  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not fetch profile (${res.status})`);
  }
  return json;
}

// Convenience wrapper used by UI components to get the current user
export async function getMe(token?: string): Promise<{ user: CustomerUser }> {
  const resolvedToken = await getStoredToken(token);
  const headers: Record<string, string> = { Accept: "application/json" };
  if (resolvedToken) headers["Authorization"] = `Bearer ${resolvedToken}`;

  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "GET",
    headers,
  });

  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not fetch current user (${res.status})`);
  }

  if (json?.data && json.data.user) return { user: json.data.user as CustomerUser };
  if (json?.user) return { user: json.user as CustomerUser };
  return { user: json as CustomerUser };
}

// Password reset flows
export interface ForgotPasswordPayload {
  email: string;
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error(json?.message || `Could not request password reset (${res.status})`);
  }
  return json;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error(json?.message || `Could not reset password (${res.status})`);
  }
  return json;
}



// ── Services & Categories ────────────────────────────────────────────────────
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  serviceCount: number;
}

export interface CategoriesResponse {
  count: number;
  categories: ServiceCategory[];
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  durationMinutes?: number;
  description?: string;
}

export interface ServicesResponse {
  count: number;
  services: Service[];
}

export interface ServiceResponse {
  service: Service;
}

// GET /categories
export async function getCategories(): Promise<CategoriesResponse> {
  const res = await fetch(`${API_BASE_URL}/categories`, { headers: { Accept: "application/json" } });
  const json = await parseJsonSafe(res);
  if (!res.ok) throw new Error(json?.message || `Could not load categories (${res.status})`);
  return json as CategoriesResponse;
}

// GET /services
export async function getServices(): Promise<ServicesResponse> {
  const res = await fetch(`${API_BASE_URL}/services`, { headers: { Accept: "application/json" } });
  const json = await parseJsonSafe(res);
  if (!res.ok) throw new Error(json?.message || `Could not load services (${res.status})`);
  return json as ServicesResponse;
}

// GET /services/search?q=
export async function searchServices(query: string): Promise<ServicesResponse> {
  const res = await fetch(`${API_BASE_URL}/services/search?q=${encodeURIComponent(query)}`, {
    headers: { Accept: "application/json" },
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) throw new Error(json?.message || `Search failed (${res.status})`);
  return json as ServicesResponse;
}

export interface SearchFixerResult {
  id: string;
  displayName?: string;
  name?: string;
  trade?: string;
  category?: string;
  rating?: number;
  distanceKm?: number;
  distance?: number;
  availabilityStatus?: string;
  availability?: string;
  reviews?: number;
  price?: number;
  avatar?: string | null;
}

export interface SearchFixersResponse {
  count?: number;
  fixers?: SearchFixerResult[];
}

export async function searchFixers(params?: {
  service?: string;
  rating?: string | number;
  availability?: "online" | "offline" | string;
  lat?: string | number;
  lng?: string | number;
  radius?: string | number;
}): Promise<SearchFixersResponse> {
  const query = new URLSearchParams();
  if (params?.service) query.set("service", String(params.service));
  if (params?.rating !== undefined && params?.rating !== null && params.rating !== "") {
    query.set("rating", String(params.rating));
  }
  if (params?.availability) query.set("availability", String(params.availability));
  if (params?.lat !== undefined && params?.lat !== null && params.lat !== "") {
    query.set("lat", String(params.lat));
  }
  if (params?.lng !== undefined && params?.lng !== null && params.lng !== "") {
    query.set("lng", String(params.lng));
  }
  if (params?.radius !== undefined && params?.radius !== null && params.radius !== "") {
    query.set("radius", String(params.radius));
  }

  const url = `${API_BASE_URL}/search${query.toString() ? `?${query.toString()}` : ""}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const json = await parseJsonSafe(res);

  if (!res.ok) {
    const message = json?.message || `Could not search fixers (${res.status})`;
    throw new Error(message);
  }

  const responseData = json?.data ?? json;
  const fixers = Array.isArray(responseData?.fixers) ? responseData.fixers : [];
  const count = typeof responseData?.count === "number" ? responseData.count : fixers.length;

  return {
    count,
    fixers,
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: string;
  isRead?: boolean;
  metadata?: Record<string, any>;
  createdAt?: string;
}

export interface NotificationListResponse {
  data?: {
    notifications?: NotificationItem[];
    total?: number;
    page?: number;
    limit?: number;
    unreadCount?: number;
  };
  notifications?: NotificationItem[];
  total?: number;
  unreadCount?: number;
}

async function getAuthHeaders(token?: string, extra: Record<string, string> = {}): Promise<Record<string, string>> {
  const resolvedToken = await getStoredToken(token);
  return {
    Accept: "application/json",
    ...extra,
    ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
  };
}

export async function getNotifications(params?: { page?: number; limit?: number; unreadOnly?: boolean }, token?: string): Promise<NotificationListResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.unreadOnly) query.set("unreadOnly", "true");

  const url = `${API_BASE_URL}/notifications${query.toString() ? `?${query.toString()}` : ""}`;
  const headers = await getAuthHeaders(token);

  const res = await fetch(url, { method: "GET", headers });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not load notifications (${res.status})`);
  }

  return (json as NotificationListResponse) ?? { data: { notifications: [] } };
}

export async function getUnreadNotificationCount(token?: string): Promise<number> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(`${API_BASE_URL}/notifications/unread-count`, { method: "GET", headers });
  const json = await parseJsonSafe(res);
  if (!res.ok) {
    if (res.status === 401 || /expired|unauthorized/i.test(String(json?.message || ""))) {
      await handleExpiredSession(json, res.status);
    }
    throw new Error(json?.message || `Could not load unread notifications (${res.status})`);
  }

  if (typeof json?.count === "number") return json.count;
  if (typeof json?.data?.count === "number") return json.data.count;
  if (typeof json?.unreadCount === "number") return json.unreadCount;
  if (typeof json?.data?.unreadCount === "number") return json.data.unreadCount;
  return 0;
}

export async function registerDeviceToken(
  payload: { token: string; platform: "ios" | "android" | "web" | string },
  token?: string,
) {
  const res = await fetch(`${API_BASE_URL}/notifications/device-token`, {
    method: "POST",
    headers: await getAuthHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  const json = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error(json?.message || `Could not register device token (${res.status})`);
  }

  return json;
}

export async function deregisterDeviceToken(payload: { token: string }, token?: string) {
  const res = await fetch(`${API_BASE_URL}/notifications/device-token`, {
    method: "DELETE",
    headers: await getAuthHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  const json = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error(json?.message || `Could not deregister device token (${res.status})`);
  }

  return json;
}

export async function markNotificationAsRead(notificationId: string, token?: string) {
  const res = await fetch(`${API_BASE_URL}/notifications/${encodeURIComponent(notificationId)}/read`, {
    method: "PATCH",
    headers: await getAuthHeaders(token),
  });

  const json = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error(json?.message || `Could not mark notification as read (${res.status})`);
  }

  return json;
}

export async function markAllNotificationsAsRead(token?: string) {
  const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: "PATCH",
    headers: await getAuthHeaders(token),
  });

  const json = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error(json?.message || `Could not mark all notifications as read (${res.status})`);
  }

  return json;
}

export async function deleteNotification(notificationId: string, token?: string) {
  const res = await fetch(`${API_BASE_URL}/notifications/${encodeURIComponent(notificationId)}`, {
    method: "DELETE",
    headers: await getAuthHeaders(token),
  });

  const json = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error(json?.message || `Could not delete notification (${res.status})`);
  }

  return json;
}

export async function getNotificationDeliveryLogs(limit = 50, token?: string) {
  const params = new URLSearchParams({ limit: String(limit) });
  const res = await fetch(`${API_BASE_URL}/notifications/delivery-logs?${params.toString()}`, {
    method: "GET",
    headers: await getAuthHeaders(token),
  });

  const json = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error(json?.message || `Could not load delivery logs (${res.status})`);
  }

  return json;
}

export async function getNotificationDeliveryLogById(id: string, token?: string) {
  const res = await fetch(`${API_BASE_URL}/notifications/delivery-logs/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: await getAuthHeaders(token),
  });

  const json = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error(json?.message || `Could not load delivery log (${res.status})`);
  }

  return json;
}

// GET /services/{id}
export async function getServiceById(id: string): Promise<ServiceResponse> {
  const res = await fetch(`${API_BASE_URL}/services/${encodeURIComponent(id)}`, {
    headers: { Accept: "application/json" },
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) throw new Error(json?.message || `Service not found (${res.status})`);
  return json as ServiceResponse;
}

// GET /services/category/{id}
export async function getServicesByCategory(categoryId: string): Promise<ServicesResponse> {
  const res = await fetch(`${API_BASE_URL}/services/category/${encodeURIComponent(categoryId)}`, {
    headers: { Accept: "application/json" },
  });
  const json = await parseJsonSafe(res);
  if (!res.ok) throw new Error(json?.message || `Could not load category (${res.status})`);
  return json as ServicesResponse;
}


// 
// ── Google authentication ────────────────────────────────────────────────────

export interface GoogleAuthPayload {
  idToken: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: CustomerUser;
  };
}

export async function googleAuth(
  payload: GoogleAuthPayload,
): Promise<GoogleAuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(
      json?.message || `Google authentication failed (${res.status})`,
    );
  }

  return json as GoogleAuthResponse;
}