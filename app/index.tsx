import { Redirect } from "expo-router";
import { useAuth } from "../src/hooks/useAuth";

export default function Index() {
  const { isLoggedIn, hasOnboarded } = useAuth();

  // Splash delay (simulate loading)
  if (!hasOnboarded && !isLoggedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
