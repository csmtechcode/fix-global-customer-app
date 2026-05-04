// src/components/layout/Navbar.tsx
// FixGlobal — Bottom Navbar
// Usage: import Navbar from "@/src/components/layout/Navbar";
//        <Navbar active="home" />

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

const BLUE = "#1A3C6E";
const GOLD = "#FFC300";
const GREY = "#8FA0B8";

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

  const getActive = (name: TabName): boolean => {
    if (active) return active === name;
    return pathname.includes(name);
  };

  return (
    <View style={styles.wrapper}>
      {TABS.map((tab) => {
        const isActive = getActive(tab.name);
        return (
          <Pressable
            key={tab.name}
            style={({ pressed }) => [
              styles.tab,
              isActive && styles.tabActive,
              pressed && !isActive && styles.tabPressed,
            ]}
            onPress={() => router.push(tab.route as any)}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={20}
              color={isActive ? "#fff" : GREY}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
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
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EAF0FB",
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 24, // safe area breathing room
    shadowColor: BLUE,
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

  // Active tab gets blue pill bg
  tabActive: {
    backgroundColor: BLUE,
  },

  // Subtle press feedback on inactive tabs
  tabPressed: {
    backgroundColor: "#EEF4FD",
  },

  // Label
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: GREY,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: "#fff",
  },
});
