// src/components/layout/Navbar.tsx
// FixGlobal — Bottom Navbar
// Usage: import Navbar from "@/src/components/layout/Navbar";
//        <Navbar active="home" />

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import  useTheme  from "../../context/ThemeContext";

type TabName = "home" | "search" | "bookings" | "wallet" | "profile";

const TABS: {
  name: TabName;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconActive: React.ComponentProps<typeof Ionicons>["name"];
  route: string;
}[] = [
  {
    name: "home",
    label: "Home",
    icon: "home-outline",
    iconActive: "home",
    route: "/(tabs)/home",
  },
  {
    name: "search",
    label: "Search",
    icon: "search-outline",
    iconActive: "search",
    route: "/(tabs)/search",
  },
  {
    name: "bookings",
    label: "Bookings",
    icon: "calendar-outline",
    iconActive: "calendar",
    route: "/(tabs)/bookings",
  },
  {
    name: "wallet",
    label: "Wallet",
    icon: "wallet-outline",
    iconActive: "wallet",
    route: "/(tabs)/wallet",
  },
  {
    name: "profile",
    label: "Profile",
    icon: "person-outline",
    iconActive: "person",
    route: "/(tabs)/profile",
  },
];

interface NavbarProps {
  /** Override active tab. If not passed, auto-detects from current route. */
  active?: TabName;
}

export default function Navbar({ active }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();

  const getActive = (name: TabName): boolean => {
    if (active) return active === name;
    return pathname.includes(name);
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.navBg, borderTopColor: colors.navBorder }]}> 
      {TABS.map((tab) => {
        const isActive = getActive(tab.name);
        return (
          <Pressable
            key={tab.name}
            style={({ pressed }) => [
              styles.tab,
              isActive && { backgroundColor: colors.accent },
              pressed && !isActive && { backgroundColor: colors.surface },
            ]}
            onPress={() => router.push(tab.route as any)}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={20}
              color={isActive ? colors.panel : colors.textSecondary}
            />
            <Text style={[styles.label, isActive && { color: colors.panel }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Outer bar — white bg, subtle top shadow
  wrapper: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 24, // safe area breathing room
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 14,
    gap: 6,
  },

  // Each tab item — sits side by side (flex-row inside wrapper)
  tab: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 14,
    gap: 4,
  },

  // Label
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.2,
  },
});
