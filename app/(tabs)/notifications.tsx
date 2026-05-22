// app/profile/notifications.tsx
// FixGlobal — Notifications Screen
// Features: grouped by date, unread dot, Mark All Read, long-press to delete, empty state
// Full dark-mode support via useTheme — mirrors home.tsx / search.tsx pattern

import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TopBar from "../../src/components/layout/TopBar";
import Navbar from "../../src/components/layout/Navbar";
import useTheme from "../../src/context/ThemeContext";

// window dimensions not required here

// ─── Static tokens ────────────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────
type NotifCategory =
  | "booking"
  | "payment"
  | "promo"
  | "system"
  | "review"
  | "alert";

interface Notification {
  id: string;
  category: NotifCategory;
  title: string;
  body: string;
  time: string;
  group: string; // date label
  read: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const INITIAL_NOTIFS: Notification[] = [
  {
    id: "n1",
    category: "booking",
    title: "Pro is on the way!",
    body: "Chukwudi Adeyemi has accepted your booking and is 8 mins away.",
    time: "2 mins ago",
    group: "Today",
    read: false,
  },
  {
    id: "n2",
    category: "payment",
    title: "Payment Successful",
    body: "₦4,500 was deducted for your Plumbing service. Ref: FG-2025-0521.",
    time: "34 mins ago",
    group: "Today",
    read: false,
  },
  {
    id: "n3",
    category: "review",
    title: "How was your service?",
    body: "Rate your experience with Amara Okonkwo for Electrical repairs.",
    time: "1 hr ago",
    group: "Today",
    read: false,
  },
  {
    id: "n4",
    category: "promo",
    title: "🎁 Invite & Earn ₦1,000",
    body: "Share your referral code with a friend and earn ₦1,000 when they book.",
    time: "3 hrs ago",
    group: "Today",
    read: true,
  },
  {
    id: "n5",
    category: "booking",
    title: "Booking Confirmed",
    body: "Your Deep Cleaning booking with Fatima Kabir is confirmed for May 20, 10:00 AM.",
    time: "Yesterday, 4:15 PM",
    group: "Yesterday",
    read: true,
  },
  {
    id: "n6",
    category: "payment",
    title: "Refund Processed",
    body: "₦12,000 has been refunded to your FixGlobal wallet. It may take a few minutes.",
    time: "Yesterday, 11:30 AM",
    group: "Yesterday",
    read: true,
  },
  {
    id: "n7",
    category: "alert",
    title: "Login from new device",
    body: "A new sign-in was detected from Lagos, NG. If this wasn't you, secure your account.",
    time: "Yesterday, 8:02 AM",
    group: "Yesterday",
    read: true,
  },
  {
    id: "n8",
    category: "system",
    title: "App Update Available",
    body: "FixGlobal v2.4 is out — faster bookings, new chat features and bug fixes.",
    time: "Apr 30",
    group: "Earlier",
    read: true,
  },
  {
    id: "n9",
    category: "promo",
    title: "Weekend Flash Sale 🔥",
    body: "Get 20% off any AC Repair booked this weekend. Limited slots available.",
    time: "Apr 29",
    group: "Earlier",
    read: true,
  },
];

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_META: Record<
  NotifCategory,
  { icon: string; lightBg: string; darkBg: string; iconColor: string }
> = {
  booking: {
    icon: "calendar-outline",
    lightBg: "#EFF6FF",
    darkBg: "#0F1B37",
    iconColor: "#3B82F6",
  },
  payment: {
    icon: "card-outline",
    lightBg: "#ECFDF5",
    darkBg: "#0B2218",
    iconColor: "#10B981",
  },
  promo: {
    icon: "gift-outline",
    lightBg: "#FFFBEB",
    darkBg: "#1A1408",
    iconColor: "#F59E0B",
  },
  system: {
    icon: "settings-outline",
    lightBg: "#F5F3FF",
    darkBg: "#130D2A",
    iconColor: "#8B5CF6",
  },
  review: {
    icon: "star-outline",
    lightBg: "#FEF9EC",
    darkBg: "#1A1408",
    iconColor: "#FFC300",
  },
  alert: {
    icon: "shield-outline",
    lightBg: "#FEF2F2",
    darkBg: "#1F0A0A",
    iconColor: "#EF4444",
  },
};

// ─── Single notification row ──────────────────────────────────────────────────
function NotifRow({
  item,
  onLongPress,
  onPress,
  isDark,
}: {
  item: Notification;
  onLongPress: (id: string) => void;
  onPress: (id: string) => void;
  isDark: boolean;
}) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const meta = CATEGORY_META[item.category];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={() => onPress(item.id)}
        onLongPress={() => onLongPress(item.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        delayLongPress={400}
        style={[
          styles.notifRow,
          {
            backgroundColor: item.read ? colors.card : colors.surface,
            borderColor: item.read ? colors.border : colors.accent + "30",
            borderLeftColor: item.read ? colors.border : colors.accent,
            borderLeftWidth: item.read ? 1 : 3,
          },
        ]}
      >
        {/* Icon */}
        <View
          style={[
            styles.notifIcon,
            {
              backgroundColor: isDark ? meta.darkBg : meta.lightBg,
            },
          ]}
        >
          <Ionicons name={meta.icon as any} size={20} color={meta.iconColor} />
        </View>

        {/* Content */}
        <View style={styles.notifContent}>
          <View style={styles.notifTitleRow}>
            <Text
              style={[
                styles.notifTitle,
                {
                  color: colors.textPrimary,
                  fontWeight: item.read ? "600" : "800",
                },
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {!item.read && (
              <View
                style={[styles.unreadDot, { backgroundColor: colors.accent }]}
              />
            )}
          </View>
          <Text
            style={[styles.notifBody, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {item.body}
          </Text>
          <Text style={[styles.notifTime, { color: colors.muted }]}>
            {item.time}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Group header ─────────────────────────────────────────────────────────────
function GroupHeader({ label, colors }: { label: string; colors: any }) {
  return (
    <View style={styles.groupHeader}>
      <View style={[styles.groupLine, { backgroundColor: colors.border }]} />
      <Text style={[styles.groupLabel, { color: colors.muted }]}>{label}</Text>
      <View style={[styles.groupLine, { backgroundColor: colors.border }]} />
    </View>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ colors }: { colors: any }) {
  return (
    <View style={styles.emptyWrap}>
      <View style={[styles.emptyIconCircle, { backgroundColor: colors.surface }]}>
        <Ionicons name="notifications-off-outline" size={40} color={colors.muted} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
        All caught up!
      </Text>
      <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
        No notifications yet. When something{"\n"}happens, you will see it here.
      </Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function NotificationsScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);

  const unreadCount = notifs.filter((n) => !n.read).length;

  // Mark single as read on press
  const handlePress = useCallback((id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Long-press → confirm delete
  const handleLongPress = useCallback((id: string) => {
    Alert.alert("Delete Notification", "Remove this notification?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setNotifs((prev) => prev.filter((n) => n.id !== id)),
      },
    ]);
  }, []);

  // Mark all read
  const markAllRead = useCallback(() => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Group notifications
  const groups = ["Today", "Yesterday", "Earlier"];
  const grouped = groups
    .map((g) => ({ label: g, items: notifs.filter((n) => n.group === g) }))
    .filter((g) => g.items.length > 0);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      {/* Top navigation bar */}
      <TopBar
        location="Lagos, NG"
        notificationCount={3}
        initials="JD"
        onNotificationPress={() => router.push("/(tabs)/notifications")}
        onLocationPress={() => router.push("/(tabs)/settings")}
        onAvatarPress={() => router.push("/(tabs)/profile")}
      />


      {/* ── Page header ─────────────────────────────────────────────── */}
      <View
        style={[
          styles.pageHeader,
          {
            backgroundColor: colors.panel,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.pageHeaderLeft}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: colors.surface }]}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={20} color={colors.icon} />
          </Pressable>
          <View>
            <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <Text style={[styles.pageSubtitle, { color: colors.muted }]}>
                {unreadCount} unread
              </Text>
            )}
          </View>
        </View>

        {unreadCount > 0 && (
          <Pressable
            style={[
              styles.markAllBtn,
              { backgroundColor: colors.accent + "18", borderColor: colors.accent + "40" },
            ]}
            onPress={markAllRead}
          >
            <Ionicons name="checkmark-done" size={14} color={colors.accent} />
            <Text style={[styles.markAllText, { color: colors.accent }]}>
              Read all
            </Text>
          </Pressable>
        )}
      </View>

      {/* ── Hint ────────────────────────────────────────────────────── */}
      {notifs.length > 0 && (
        <View
          style={[
            styles.hintBar,
            { backgroundColor: colors.surface, borderBottomColor: colors.border },
          ]}
        >
          <Ionicons name="hand-left-outline" size={12} color={colors.muted} />
          <Text style={[styles.hintText, { color: colors.muted }]}>
            Hold down a notification to delete it
          </Text>
        </View>
      )}

      {/* ── List ────────────────────────────────────────────────────── */}
      {notifs.length === 0 ? (
        <EmptyState colors={colors} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {grouped.map(({ label, items }) => (
            <View key={label}>
              <GroupHeader label={label} colors={colors} />
              <View style={styles.groupItems}>
                {items.map((item) => (
                  <NotifRow
                    key={item.id}
                    item={item}
                    onPress={handlePress}
                    onLongPress={handleLongPress}
                    isDark={isDarkMode}
                  />
                ))}
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      <Navbar />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 24 },

  // ── Page header ──
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  pageHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 1,
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: "800",
  },

  // ── Hint bar ──
  hintBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  hintText: {
    fontSize: 11,
    fontWeight: "500",
  },

  // ── Group ──
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 10,
  },
  groupLine: {
    flex: 1,
    height: 1,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  groupItems: {
    paddingHorizontal: 16,
    gap: 10,
  },

  // ── Notification row ──
  notifRow: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifContent: { flex: 1 },
  notifTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 3,
  },
  notifTitle: {
    fontSize: 14,
    flex: 1,
    letterSpacing: -0.2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  notifBody: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
    marginBottom: 6,
  },
  notifTime: {
    fontSize: 11,
    fontWeight: "500",
  },

  // ── Empty state ──
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
  },
});