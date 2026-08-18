import { useCallback, useEffect, useState } from "react";

import { getMe } from "@/src/features/auth/api";
import { getAuthSession, clearAuthSession } from "@/src/lib/storage";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasOnboarded] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const refreshAuthState = useCallback(async () => {
    try {
      const session = await getAuthSession();

      if (!session?.token) {
        setIsLoggedIn(false);
        console.log("[auth] state refreshed", { isLoggedIn: false });
        return;
      }

      try {
        await getMe(session.token);
        setIsLoggedIn(true);
        console.log("[auth] state refreshed", { isLoggedIn: true });
      } catch (error) {
        const message = String((error as any)?.message || "");
        console.warn("[auth] stored session rejected during refresh", { message });
        await clearAuthSession();
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("[auth] refresh state failed", error);
      setIsLoggedIn(false);
    } finally {
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    refreshAuthState();
  }, [refreshAuthState]);

  const logout = useCallback(async () => {
    try {
      await clearAuthSession();
      setIsLoggedIn(false);
      console.log("[auth] logout complete");
    } catch (error) {
      console.error("[auth] logout failed", error);
    }
  }, []);

  return {
    isLoggedIn,
    hasOnboarded,
    authReady,
    logout,
    refreshAuthState,
  };
}
