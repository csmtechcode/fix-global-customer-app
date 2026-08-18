import AsyncStorage from "@react-native-async-storage/async-storage";

import type { CustomerUser } from "@/src/features/auth/api";

export interface AuthSession {
  token: string;
  refreshToken?: string;
  user?: CustomerUser | null;
}

export const AUTH_SESSION_KEY = "fix_global_auth_session";

export async function saveAuthSession(session: AuthSession | null): Promise<void> {
  try {
    if (!session || !session.token) {
      await clearAuthSession();
      return;
    }

    const payload = JSON.stringify(session);
    await AsyncStorage.setItem(AUTH_SESSION_KEY, payload);
    console.log("[auth] saved session", {
      hasToken: !!session.token,
      email: session.user?.email ?? "unknown",
    });
  } catch (error) {
    console.error("[auth] save session failed", error);
    throw error;
  }
}

export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_SESSION_KEY);

    if (!raw) {
      console.log("[auth] no stored session found");
      return null;
    }

    const parsed = JSON.parse(raw) as AuthSession;
    console.log("[auth] restored session", {
      hasToken: !!parsed?.token,
      email: parsed?.user?.email ?? "unknown",
    });

    if (!parsed?.token) {
      await clearAuthSession();
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("[auth] read session failed", error);
    return null;
  }
}

export async function clearAuthSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTH_SESSION_KEY);
    console.log("[auth] session cleared");
  } catch (error) {
    console.error("[auth] clear session failed", error);
    throw error;
  }
}

export async function hasStoredAuthSession(): Promise<boolean> {
  const session = await getAuthSession();
  return Boolean(session?.token);
}
