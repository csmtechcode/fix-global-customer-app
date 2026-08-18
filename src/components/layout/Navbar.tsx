// src/components/layout/Navbar.tsx
// FixGlobal — Bottom Navbar
// Usage: import Navbar from "@/src/components/layout/Navbar";
//        <Navbar active="home" />

import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import useTheme from "../../context/ThemeContext";

type TabName = "home" | "search" | "bookings" | "wallet" | "profile";

const TABS: {
  name: TabName;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconActive: React.ComponentProps<typeof Ionicons>["name"];
  route: string;
}[] = [
    { name: "home", label: "Home", icon: "home-outline", iconActive: "home", route: "/(tabs)/home" },
    { name: "search", label: "Search", icon: "search-outline", iconActive: "search", route: "/(tabs)/search" },
    { name: "bookings", label: "Bookings", icon: "calendar-outline", iconActive: "calendar", route: "/(tabs)/bookings" },
    { name: "wallet", label: "Wallet", icon: "wallet-outline", iconActive: "wallet", route: "/(tabs)/wallet" },
    { name: "profile", label: "Profile", icon: "person-outline", iconActive: "person", route: "/(tabs)/profile" },
  ];

interface NavbarProps {
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
      <View style={[styles.navbar, { backgroundColor: colors.navBg, borderColor: colors.navBorder, shadowColor: colors.textPrimary }]}>
        {TABS.map((tab) => {
          const isActive = getActive(tab.name);

          return (
            <Pressable
              key={tab.name}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => router.push(tab.route as any)}
              style={({ pressed }) => [
                styles.tab,
                isActive && [styles.tabActive, { backgroundColor: colors.accent }],
                pressed && !isActive && { opacity: 0.8 },
              ]}
            >
              <View style={[styles.iconWrap, isActive && { backgroundColor: colors.cardAlt }]}>
                <Ionicons
                  name={isActive ? tab.iconActive : tab.icon}
                  size={isActive ? 21 : 20}
                  color={isActive ? colors.panel : colors.textSecondary}
                />
              </View>
              <Text style={[styles.label, isActive && { color: colors.panel }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 10,
    paddingBottom: 18,
    paddingTop: 10,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 26,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: Platform.OS === "ios" ? 0.18 : 0.12,
    shadowRadius: 18,
    elevation: 14,
  },
  tab: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
    borderRadius: 18,
    paddingVertical: 6,
    gap: 4,
  },
  tabActive: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  iconWrap: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.2,
    color: "#6B7280",
  },
});
