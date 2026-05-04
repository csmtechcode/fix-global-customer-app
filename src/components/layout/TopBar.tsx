// src/components/layout/TopBar.tsx
// FixGlobal top navigation bar — used across all tab screens

import React from "react";
import { View, Text, Pressable, StyleSheet, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BLUE = "#1A3C6E";
const GOLD = "#FFC300";
const LIGHT = "#F4F7FD";

interface TopBarProps {
  location?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onLocationPress?: () => void;
  onAvatarPress?: () => void;
  initials?: string; // user initials e.g. "JD"
}

export default function TopBar({
  location = "Lagos, NG",
  notificationCount = 0,
  onNotificationPress,
  onLocationPress,
  onAvatarPress,
  initials = "JD",
}: TopBarProps) {
  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.row}>
        {/* ── Left: Logo ─────────────────────────────────────────── */}
        <View style={styles.logoBlock}>
          <Text style={styles.logoFix}>Fix</Text>
          <Text style={styles.logoGold}>Global</Text>
        </View>

        {/* ── Center: Location pill ──────────────────────────────── */}
        <Pressable style={styles.locationPill} onPress={onLocationPress}>
          <Ionicons name="location-sharp" size={13} color={GOLD} />
          <Text style={styles.locationText} numberOfLines={1}>
            {location}
          </Text>
          <Ionicons name="chevron-down" size={12} color={BLUE} />
        </Pressable>

        {/* ── Right: Bell + Avatar ───────────────────────────────── */}
        <View style={styles.rightRow}>
          {/* Notification bell */}
          <Pressable style={styles.bellBtn} onPress={onNotificationPress}>
            <Ionicons name="notifications-outline" size={22} color={BLUE} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Avatar circle */}
          <Pressable style={styles.avatar} onPress={onAvatarPress}>
            <Text style={styles.avatarText}>{initials}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAF0FB",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Logo
  logoBlock: { flexDirection: "row", alignItems: "center" },
  logoFix: {
    fontSize: 20,
    fontWeight: "900",
    color: BLUE,
    letterSpacing: -0.4,
  },
  logoGold: {
    fontSize: 20,
    fontWeight: "900",
    color: GOLD,
    letterSpacing: -0.4,
  },

  // Location
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F4F7FD",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    maxWidth: 140,
    borderWidth: 1,
    borderColor: "#DDE4F0",
  },
  locationText: {
    fontSize: 12,
    fontWeight: "700",
    color: BLUE,
    flexShrink: 1,
  },

  // Right actions
  rightRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F4F7FD",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDE4F0",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E84040",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  badgeText: { fontSize: 9, fontWeight: "800", color: "#fff" },

  // Avatar
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: GOLD,
  },
  avatarText: { fontSize: 13, fontWeight: "800", color: "#fff" },
});
