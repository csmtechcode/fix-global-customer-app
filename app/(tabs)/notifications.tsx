// app/profile/notifications.tsx
// FixGlobal — Notifications Screen
// Features: grouped by date, unread dot, Mark All Read, long-press to delete, empty state
// Full dark-mode support via useTheme — mirrors home.tsx / search.tsx pattern

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TopBar from "../../src/components/layout/TopBar";
import Navbar from "../../src/components/layout/Navbar";
import useTheme from "../../src/context/ThemeContext";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationItem,
} from "../../src/features/auth/api";

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
  group: string;
  read: boolean;
}

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function deriveCategory(type?: string): NotifCategory {
  const value = (type ?? "").toLowerCase();
  if (value.includes("booking") || value.includes("appointment")) return "booking";
  if (value.includes("payment") || value.includes("wallet") || value.includes("refund")) return "payment";
  if (value.includes("promo") || value.includes("offer") || value.includes("discount")) return "promo";
  if (value.includes("review") || value.includes("rating")) return "review";
  if (value.includes("alert") || value.includes("security") || value.includes("login")) return "alert";
  return "system";
}

function mapNotification(item: NotificationItem): Notification {
  const createdAt = item.createdAt ? new Date(item.createdAt) : new Date();

  const diffDays = Math.floor((Date.now() - createdAt.getTime()) / 86400000);
  const group = diffDays <= 0 ? "Today" : diffDays === 1 ? "Yesterday" : "Earlier";

  return {
    id: item.id,
    category: deriveCategory(item.type),
    title: item.title || "Notification",
    body: item.message || "",
    time: formatRelativeTime(createdAt),
    group,
    read: Boolean(item.isRead),
  };
}

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
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getNotifications({ page: 1, limit: 50 });
      const items = (res?.data?.notifications ?? res?.notifications ?? []) as NotificationItem[];
      setNotifs(items.map(mapNotification));
    } catch (err: any) {
      const message = String(err?.message || "");
      console.warn("[notifications] could not load", err);
      if (/expired|unauthorized|401/i.test(message)) {
        router.replace("/(auth)/login");
        return;
      }
      setError(message || "Could not load notifications right now.");
      setNotifs([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const handlePress = useCallback(async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.warn("[notifications] mark as read failed", err);
    }
  }, []);

  const handleLongPress = useCallback((id: string) => {
    Alert.alert("Delete Notification", "Remove this notification?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteNotification(id);
            setNotifs((prev) => prev.filter((n) => n.id !== id));
          } catch (err) {
            console.warn("[notifications] delete failed", err);
            Alert.alert("Unable to delete", "This notification could not be removed right now.");
          }
        },
      },
    ]);
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.warn("[notifications] mark all read failed", err);
    }
  }, []);

  const groups = ["Today", "Yesterday", "Earlier"];
  const grouped = groups
    .map((g) => ({ label: g, items: notifs.filter((n) => n.group === g) }))
    .filter((g) => g.items.length > 0);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <TopBar
        onNotificationPress={() => router.push("/(tabs)/notifications")}
        onSettingsPress={() => router.push("/(tabs)/settings")}
        onLocationPress={() => router.push("/(tabs)/settings")}
        onAvatarPress={() => router.push("/(tabs)/profile")}
      />

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
            <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={[styles.pageSubtitle, { color: colors.muted }]}>{unreadCount} unread</Text>
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
            <Text style={[styles.markAllText, { color: colors.accent }]}>Read all</Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading notifications...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.surface }]}>
            <Ionicons name="alert-circle-outline" size={40} color={colors.danger} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Couldn’t load notifications</Text>
          <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>{error}</Text>
          <Pressable style={[styles.retryBtn, { backgroundColor: colors.accent }]} onPress={loadNotifications}>
            <Text style={[styles.retryText, { color: colors.panel }]}>Retry</Text>
          </Pressable>
        </View>
      ) : notifs.length === 0 ? (
        <EmptyState colors={colors} />
      ) : (
        <>
          <View
            style={[
              styles.hintBar,
              { backgroundColor: colors.surface, borderBottomColor: colors.border },
            ]}
          >
            <Ionicons name="hand-left-outline" size={12} color={colors.muted} />
            <Text style={[styles.hintText, { color: colors.muted }]}>Hold down a notification to delete it</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
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
        </>
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
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "700",
  },
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