// src/components/layout/TopBar.tsx
// FixGlobal top navigation bar — used across all tab screens

import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../context/ThemeContext";
import { getMe, getUnreadNotificationCount } from "../../features/auth/api";

interface TopBarProps {
  location?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
  onAvatarPress?: () => void;
  onLocationPress?: () => void;
  initials?: string;
}
export default function TopBar({
  location,
  initials: propInitials,
  notificationCount: propNotificationCount = 0,
  onNotificationPress,
  onSettingsPress,
  onAvatarPress,
  onLocationPress,
}: TopBarProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const [initials, setInitials] = useState(propInitials ?? "?");
  const [notificationCount, setNotificationCount] = useState(propNotificationCount);

  useEffect(() => {
    let mounted = true;
    if (!propInitials) {
      getMe()
        .then((res) => {
          if (!mounted) return;
          const { firstName, lastName } = res.user;
          setInitials(`${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?");
        })
        .catch((error) => {
          const message = String(error?.message || "");
          if (/expired|unauthorized|401/i.test(message)) {
            router.replace("/(auth)/login");
            return;
          }
        });
    }
    return () => {
      mounted = false;
    };
  }, [propInitials, router]);

  useEffect(() => {
    let active = true;

    const loadUnreadCount = async () => {
      if (typeof propNotificationCount === "number" && propNotificationCount > 0) {
        setNotificationCount(propNotificationCount);
        return;
      }

      try {
        const count = await getUnreadNotificationCount();
        if (active) setNotificationCount(count || 0);
      } catch (error) {
        const message = String((error as any)?.message || "");
        console.warn("[notifications] unread count unavailable", error);
        if (/expired|unauthorized|401/i.test(message)) {
          router.replace("/(auth)/login");
          return;
        }
        if (active) setNotificationCount(0);
      }
    };

    loadUnreadCount();
    return () => {
      active = false;
    };
  }, [propNotificationCount, router]);

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.topBarBg, borderBottomColor: colors.border }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.topBarBg} />

      <View style={styles.row}>
        {/* ── Left: Logo ─────────────────────────────────────────── */}
        <View style={styles.logoBlock}>
          <Text style={[styles.logoFix, { color: colors.textPrimary }]}>EIV</Text>
          <Text style={[styles.logoGold, { color: colors.accent }]}>VER</Text>
        </View>

        {/* ── Center: optional location */}
        {location ? <View style={styles.center}><Text style={[styles.locationText, { color: colors.textSecondary }]}>{location}</Text></View> : null}

        <View style={styles.rightRow}>
          <Pressable style={[styles.settingsBtn, { backgroundColor: colors.surface }]} onPress={onSettingsPress}>
            <Ionicons name="settings-outline" size={20} color={colors.icon} />
          </Pressable>

          {/* Notification bell */}
          <Pressable
            style={[styles.bellBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onNotificationPress}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.icon} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount > 9 ? "9+" : notificationCount}</Text>
              </View>
            )}
          </Pressable>

          {/* Avatar circle — initials pulled from /users/me */}
          <Pressable
            style={[styles.avatar, { backgroundColor: colors.icon, borderColor: colors.accent }]}
            onPress={onAvatarPress}
          >
            <Text style={[styles.avatarText, { color: colors.panel }]}>{initials}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Logo
  logoBlock: { flexDirection: "row", alignItems: "center" },
  logoFix: { fontSize: 20, fontWeight: "900", letterSpacing: -0.4 },
  logoGold: { fontSize: 20, fontWeight: "900", letterSpacing: -0.4 },

  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  // Right actions
  rightRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
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
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  avatarText: { fontSize: 13, fontWeight: "800" },
  center: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  locationText: { fontSize: 13, fontWeight: "700" },
});