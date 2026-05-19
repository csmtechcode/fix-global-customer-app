// src/components/layout/TopBar.tsx
// FixGlobal top navigation bar — used across all tab screens

import React from "react";
import { View, Text, Pressable, StyleSheet, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import  useTheme  from "../../context/ThemeContext";

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
  const { colors } = useTheme();

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.topBarBg, borderBottomColor: colors.border }]}> 
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.topBarBg} />

      <View style={styles.row}>
        {/* ── Left: Logo ─────────────────────────────────────────── */}
        <View style={styles.logoBlock}>
          <Text style={[styles.logoFix, { color: colors.textPrimary }]}>Fix</Text>
          <Text style={[styles.logoGold, { color: colors.accent }]}>Global</Text>
        </View>

        <View style={styles.rightRow}>
          <Pressable style={[styles.settingsBtn, { backgroundColor: colors.surface }]} onPress={onLocationPress}>
            <Ionicons name="settings-outline" size={20} color={colors.icon} />
          </Pressable>

          {/* Notification bell */}
          <Pressable style={[styles.bellBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onNotificationPress}>
            <Ionicons name="notifications-outline" size={22} color={colors.icon} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Avatar circle */}
          <Pressable style={[styles.avatar, { backgroundColor: colors.icon, borderColor: colors.accent }]} onPress={onAvatarPress}>
            <Text style={[styles.avatarText, { color: colors.panel }]}>{initials}</Text>
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
    color: "#1A3C6E",
    letterSpacing: -0.4,
  },
  logoGold: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFC300",
    letterSpacing: -0.4,
  },

  // Location pill placeholder
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
    color: "#1A3C6E",
    flexShrink: 1,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F4F7FD",
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#1A3C6E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFC300",
  },
  avatarText: { fontSize: 13, fontWeight: "800", color: "#fff" },
});
