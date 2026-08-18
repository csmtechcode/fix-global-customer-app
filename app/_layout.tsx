// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return <Stack />;
// }

import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { AppThemeProvider } from "../src/context/ThemeContext";
import { getMe } from "@/src/features/auth/api";
import { clearAuthSession, getAuthSession } from "@/src/lib/storage";

function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0B1F3A",
      }}
    >
      <Text style={{ color: "#D4AF37", fontSize: 65, fontWeight: "bold" }}>
        EIVVER
      </Text>
    </View>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [hasStoredSession, setHasStoredSession] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        const session = await getAuthSession();

        if (!session?.token) {
          if (isMounted) {
            setHasStoredSession(false);
            console.log("[auth] boot session check", { hasStoredSession: false });
          }
          return;
        }

        try {
          await getMe(session.token);
          if (isMounted) {
            setHasStoredSession(true);
            console.log("[auth] boot session check", { hasStoredSession: true });
          }
        } catch (error) {
          const message = String((error as any)?.message || "");
          console.warn("[auth] stored session rejected by backend", { message });
          await clearAuthSession();
          if (isMounted) setHasStoredSession(false);
        }
      } catch (error) {
        console.error("[auth] boot session check failed", error);
        if (isMounted) setHasStoredSession(false);
      } finally {
        if (isMounted) setIsReady(true);
      }
    };

    const timer = setTimeout(() => {
      bootstrapAuth();
    }, 1500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  if (!isReady) return <SplashScreen />;

  return (
    <AppThemeProvider>
      <Stack screenOptions={{ headerShown: false }} initialRouteName={hasStoredSession ? "(tabs)" : "(auth)"}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppThemeProvider>
  );
}
