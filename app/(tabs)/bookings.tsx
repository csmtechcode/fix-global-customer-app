// app/(tabs)/bookings.tsx
// FixGlobal — Bookings Screen

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TopBar from "../../src/components/layout/TopBar";
import Navbar from "../../src/components/layout/Navbar";
import useTheme from "../../src/context/ThemeContext";

// ─── Static Tokens ────────────────────────────────────────────────────────────
const BLUE = "#1A3C6E";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  active: {
    label: "Active",
    color: "#1A9E6A",
    bg: "#ECFDF5",
    icon: "ellipse" as const,
  },
  completed: {
    label: "Completed",
    color: "#3B82F6",
    bg: "#EFF6FF",
    icon: "checkmark-circle" as const,
  },
  cancelled: {
    label: "Cancelled",
    color: "#EF4444",
    bg: "#FEF2F2",
    icon: "close-circle" as const,
  },
  pending: {
    label: "Pending",
    color: "#F59E0B",
    bg: "#FFFBEB",
    icon: "time" as const,
  },
};

type BookingStatus = keyof typeof STATUS;

// ─── Mock bookings ────────────────────────────────────────────────────────────
const ALL_BOOKINGS = [
  {
    id: "1",
    service: "Plumbing Service",
    desc: "Fix leaking kitchen sink pipes",
    pro: "Chukwudi Adeyemi",
    proInitials: "CA",
    proBg: BLUE,
    date: "2025-06-15",
    dateLabel: "Jun 15, 2025",
    time: "2:00 PM",
    price: "₦3,500",
    status: "active" as BookingStatus,
    icon: "water-outline" as const,
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
    month: "June 2025",
  },
  {
    id: "2",
    service: "Electrical Repair",
    desc: "Install new ceiling fan + wiring check",
    pro: "Amara Okonkwo",
    proInitials: "AO",
    proBg: "#8B5CF6",
    date: "2025-06-10",
    dateLabel: "Jun 10, 2025",
    time: "10:00 AM",
    price: "₦4,000",
    status: "completed" as BookingStatus,
    icon: "flash-outline" as const,
    iconColor: "#F59E0B",
    iconBg: "#FFFBEB",
    month: "June 2025",
  },
  {
    id: "3",
    service: "Deep Cleaning",
    desc: "Full apartment deep clean — 3 rooms",
    pro: "Fatima Kabir",
    proInitials: "FK",
    proBg: "#10B981",
    date: "2025-06-05",
    dateLabel: "Jun 5, 2025",
    time: "9:00 AM",
    price: "₦5,500",
    status: "completed" as BookingStatus,
    icon: "sparkles-outline" as const,
    iconColor: "#10B981",
    iconBg: "#ECFDF5",
    month: "June 2025",
  },
  {
    id: "4",
    service: "Painting & Decoration",
    desc: "Paint living room + bedroom walls",
    pro: "Emeka Tunde",
    proInitials: "ET",
    proBg: "#EF4444",
    date: "2025-05-28",
    dateLabel: "May 28, 2025",
    time: "8:00 AM",
    price: "₦2,800",
    status: "cancelled" as BookingStatus,
    icon: "color-palette-outline" as const,
    iconColor: "#8B5CF6",
    iconBg: "#F5F3FF",
    month: "May 2025",
  },
  {
    id: "5",
    service: "AC Repair",
    desc: "Service + gas refill for 2 AC units",
    pro: "Biodun Salami",
    proInitials: "BS",
    proBg: "#06B6D4",
    date: "2025-05-20",
    dateLabel: "May 20, 2025",
    time: "11:00 AM",
    price: "₦6,000",
    status: "completed" as BookingStatus,
    icon: "snow-outline" as const,
    iconColor: "#06B6D4",
    iconBg: "#ECFEFF",
    month: "May 2025",
  },
  {
    id: "6",
    service: "Carpentry",
    desc: "Fix broken wardrobe door + shelf",
    pro: "Tunde Bakare",
    proInitials: "TB",
    proBg: "#F59E0B",
    date: "2025-05-10",
    dateLabel: "May 10, 2025",
    time: "3:00 PM",
    price: "₦2,200",
    status: "completed" as BookingStatus,
    icon: "hammer-outline" as const,
    iconColor: "#EF4444",
    iconBg: "#FEF2F2",
    month: "May 2025",
  },
  {
    id: "7",
    service: "Security Installation",
    desc: "Install 2 CCTV cameras at gate + door",
    pro: "Kemi Adeleye",
    proInitials: "KA",
    proBg: BLUE,
    date: "2025-07-02",
    dateLabel: "Jul 2, 2025",
    time: "1:00 PM",
    price: "₦8,500",
    status: "pending" as BookingStatus,
    icon: "shield-outline" as const,
    iconColor: BLUE,
    iconBg: "#EEF4FD",
    month: "July 2025",
  },
];

const MONTHS = [
  "All Months",
  ...Array.from(new Set(ALL_BOOKINGS.map((b) => b.month))),
];

const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// ─── Summary strip ────────────────────────────────────────────────────────────
function SummaryStrip({ colors }: { colors: any }) {
  const counts = {
    total: ALL_BOOKINGS.length,
    active: ALL_BOOKINGS.filter((b) => b.status === "active").length,
    completed: ALL_BOOKINGS.filter((b) => b.status === "completed").length,
    cancelled: ALL_BOOKINGS.filter((b) => b.status === "cancelled").length,
  };

  const items = [
    { label: "Total", value: counts.total, color: BLUE },
    { label: "Active", value: counts.active, color: "#1A9E6A" },
    { label: "Done", value: counts.completed, color: "#3B82F6" },
    { label: "Cancelled", value: counts.cancelled, color: "#EF4444" },
  ];

  return (
    <View style={[styles.strip, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      {items.map((item, i) => (
        <View
          key={i}
          style={[styles.stripItem, i < items.length - 1 && { borderRightWidth: 1, borderRightColor: colors.border }]}
        >
          <Text style={[styles.stripValue, { color: item.color }]}>
            {item.value}
          </Text>
          <Text style={[styles.stripLabel, { color: colors.textSecondary }]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Booking card ─────────────────────────────────────────────────────────────
function BookingCard({
  booking,
  onViewDetails,
  onRebook,
  onCancel,
  colors,
  isDarkMode,
}: {
  booking: (typeof ALL_BOOKINGS)[0];
  onViewDetails: () => void;
  onRebook: () => void;
  onCancel: () => void;
  colors: any;
  isDarkMode: boolean;
}) {
  const s = STATUS[booking.status];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={[styles.cardIconBox, { backgroundColor: booking.iconBg }]}>
          <Ionicons name={booking.icon} size={22} color={booking.iconColor} />
        </View>
        <View style={styles.cardHeaderInfo}>
          <Text style={[styles.cardService, { color: colors.textPrimary }]}>{booking.service}</Text>
          <Text style={[styles.cardDesc, { color: colors.textSecondary }]} numberOfLines={1}>
            {booking.desc}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: isDarkMode ? colors.surface : s.bg }]}>
          <Ionicons name={s.icon} size={10} color={s.color} />
          <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
        </View>
      </View>

      <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />

      {/* Pro + date */}
      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <View style={[styles.proAvatar, { backgroundColor: booking.proBg }]}>
            <Text style={[styles.proInitials, { color: colors.card }]}>{booking.proInitials}</Text>
          </View>
          <View>
            <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Professional</Text>
            <Text style={[styles.metaValue, { color: colors.textPrimary }]}>{booking.pro}</Text>
          </View>
        </View>
        <View style={styles.metaItem}>
          <View style={[styles.metaIcon, { backgroundColor: colors.surface }]}>
            <Ionicons name="calendar-outline" size={16} color={colors.accent} />
          </View>
          <View>
            <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Date & Time</Text>
            <Text style={[styles.metaValue, { color: colors.textPrimary }]}>{booking.dateLabel}</Text>
            <Text style={[styles.metaTime, { color: colors.textSecondary }]}>{booking.time}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Total</Text>
          <Text style={[styles.price, { color: colors.textPrimary }]}>{booking.price}</Text>
        </View>
        <View style={styles.cardActions}>
          {(booking.status === "completed" || booking.status === "cancelled") && (
            <Pressable style={[styles.rebookBtn, { borderColor: colors.accent, backgroundColor: colors.card }]} onPress={onRebook}>
              <Ionicons name="refresh-outline" size={13} color={colors.accent} />
              <Text style={[styles.rebookText, { color: colors.accent }]}>Rebook</Text>
            </Pressable>
          )}
          {(booking.status === "active" || booking.status === "pending") && (
            <Pressable style={[styles.cancelBtn, { borderColor: colors.danger, backgroundColor: colors.cardAlt }]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelText, { color: colors.danger }]}>Cancel</Text>
            </Pressable>
          )}
          <Pressable style={[styles.detailsBtn, { backgroundColor: colors.accent }]}
            onPress={onViewDetails}
          >
            <Text style={[styles.detailsBtnText, { color: colors.card }]}>Details</Text>
            <Ionicons name="chevron-forward" size={13} color={colors.card} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ─── Month picker ─────────────────────────────────────────────────────────────
function MonthPicker({
  visible,
  selected,
  onSelect,
  onClose,
  colors,
}: {
  visible: boolean;
  selected: string;
  onSelect: (m: string) => void;
  onClose: () => void;
  colors: any;
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.pickerSheet, { backgroundColor: colors.card }]}>
        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
        <Text style={[styles.pickerTitle, { color: colors.textPrimary }]}>Filter by Month</Text>
        {MONTHS.map((m) => (
          <Pressable
            key={m}
            style={[
              styles.pickerRow,
              { backgroundColor: colors.surface },
              selected === m && { backgroundColor: colors.cardAlt, borderWidth: 1.5, borderColor: colors.accent },
            ]}
            onPress={() => {
              onSelect(m);
              onClose();
            }}
          >
            <Text
              style={[
                styles.pickerRowText,
                { color: colors.textSecondary },
                selected === m && { color: colors.accent, fontWeight: "800" },
              ]}
            >
              {m}
            </Text>
            {selected === m && (
              <Ionicons name="checkmark" size={18} color={colors.accent} />
            )}
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function BookingsScreen() {
  const router = useRouter();
  // ✅ FIX: useTheme must be called inside the component, not outside
  const { colors, isDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState("all");
  const [activeMonth, setActiveMonth] = useState("All Months");
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const filtered = useMemo(() => {
    let list = [...ALL_BOOKINGS];
    if (activeTab !== "all") list = list.filter((b) => b.status === activeTab);
    if (activeMonth !== "All Months")
      list = list.filter((b) => b.month === activeMonth);
    return list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [activeTab, activeMonth]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={["top"]}>

      {/* Top navigation bar */}
      <TopBar
        location="Lagos, NG"
        notificationCount={3}
        initials="JD"
        onNotificationPress={() => router.push("/(tabs)/notifications")}
        onLocationPress={() => router.push("/(tabs)/settings")}
        onAvatarPress={() => router.push("/(tabs)/profile")}
      />

      {/* Page header + month filter */}
      <View style={[styles.pageHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>My Bookings</Text>
          <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
            {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <Pressable
          style={[styles.monthBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => setShowMonthPicker(true)}
        >
          <Ionicons name="calendar-outline" size={14} color={colors.accent} />
          <Text style={[styles.monthBtnText, { color: colors.accent }]}>{activeMonth}</Text>
          <Ionicons name="chevron-down" size={13} color={colors.accent} />
        </Pressable>
      </View>

      {/* Summary strip */}
      <SummaryStrip colors={colors} />

      {/* Status tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsOuter, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
        contentContainerStyle={styles.tabsScroll}
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            style={[
              styles.tab,
              { backgroundColor: colors.surface, borderColor: colors.border },
              activeTab === tab.key && { backgroundColor: colors.accent, borderColor: colors.accent },
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.textSecondary },
                activeTab === tab.key && { color: colors.card },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* List or empty */}
      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={52} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No bookings found</Text>
          <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
            {activeTab === "all"
              ? "You haven't made any bookings yet."
              : `No ${activeTab} bookings${activeMonth !== "All Months" ? ` in ${activeMonth}` : ""}.`}
          </Text>
          <Pressable
            style={[styles.emptyBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.push("/(tabs)/search")}
          >
            <Text style={[styles.emptyBtnText, { color: colors.card }]}>Find a Fixer</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <BookingCard
                booking={item}
                colors={colors}
                isDarkMode={isDarkMode}
                onViewDetails={() => router.push("/(modals)/booking")}
                onRebook={() => router.push("/(tabs)/search")}
                onCancel={() => console.log("Cancel", item.id)}
              />
            )}
          />
        </View>
      )}

      <MonthPicker
        visible={showMonthPicker}
        selected={activeMonth}
        onSelect={setActiveMonth}
        onClose={() => setShowMonthPicker(false)}
        colors={colors}
      />

      <Navbar />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  pageSubtitle: { fontSize: 12, fontWeight: "500", marginTop: 2 },
  monthBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  monthBtnText: { fontSize: 12, fontWeight: "700" },

  // Strip
  strip: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  stripItem: { flex: 1, alignItems: "center", paddingVertical: 6 },
  stripValue: { fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
  stripLabel: { fontSize: 11, fontWeight: "600", marginTop: 2 },

  // Tabs
  tabsOuter: {
    flexGrow: 0,
    borderBottomWidth: 1,
  },
  tabsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    alignItems: "center",
  },
  tab: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: { fontSize: 13, fontWeight: "700" },

  // List
  list: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, gap: 14 },

  // Card
  card: {
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  cardIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardHeaderInfo: { flex: 1 },
  cardService: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  cardDesc: { fontSize: 12, fontWeight: "500" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    flexShrink: 0,
  },
  statusText: { fontSize: 10, fontWeight: "800" },
  cardDivider: { height: 1, marginBottom: 12 },

  cardMeta: { flexDirection: "row", gap: 16, marginBottom: 14 },
  metaItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  proAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  proInitials: { fontSize: 12, fontWeight: "900" },
  metaIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  metaLabel: { fontSize: 10, fontWeight: "600", marginBottom: 1 },
  metaValue: { fontSize: 12, fontWeight: "700" },
  metaTime: { fontSize: 11, fontWeight: "500" },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  priceLabel: { fontSize: 10, fontWeight: "500", marginBottom: 2 },
  price: { fontSize: 18, fontWeight: "900" },
  cardActions: { flexDirection: "row", gap: 8, alignItems: "center" },

  rebookBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  rebookText: { fontSize: 12, fontWeight: "700" },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  cancelText: { fontSize: 12, fontWeight: "700" },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  detailsBtnText: { fontSize: 12, fontWeight: "800" },

  // Empty
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800" },
  emptyDesc: { fontSize: 14, textAlign: "center", lineHeight: 21 },
  emptyBtn: {
    marginTop: 8,
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  emptyBtnText: { fontSize: 14, fontWeight: "800" },

  // Month picker
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00000055",
  },
  pickerSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 44,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 6,
  },
  pickerRowText: { fontSize: 14, fontWeight: "600" },
});