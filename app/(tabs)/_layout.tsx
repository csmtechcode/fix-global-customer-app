// app/(tabs)/_layout.tsx
// Plain Stack — no tab bar rendered here.
// Navbar.tsx inside each screen handles the bottom navigation.

import { Stack } from "expo-router";

export default function TabsLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
