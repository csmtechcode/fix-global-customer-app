// app/(tabs)/home.tsx
// FixGlobal — Home Screen
// Sections: TopBar, Hero, Search, Categories, Featured Pros, Active Booking, Recent

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../src/components/layout/TopBar";
import Navbar from "../../src/components/layout/Navbar";
import useTheme from "../../src/context/ThemeContext";

const { width } = Dimensions.get("window");

// ─── Tokens ──────────────────────────────────────────────────────────────────
const BLUE = "#1A3C6E";
const GOLD = "#FFC300";
const WHITE = "#FFFFFF";
const GREY = "#64748B";

// ─── Mock data ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "1",
    label: "Plumbing",
    icon: "water-outline",
    color: "#3B82F6",
    bg: "#EFF6FF",
  },
  {
    id: "2",
    label: "Electrical",
    icon: "flash-outline",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    id: "3",
    label: "Painting",
    icon: "color-palette-outline",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
  {
    id: "4",
    label: "Cleaning",
    icon: "sparkles-outline",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    id: "5",
    label: "Carpentry",
    icon: "hammer-outline",
    color: "#EF4444",
    bg: "#FEF2F2",
  },
  {
    id: "6",
    label: "AC Repair",
    icon: "snow-outline",
    color: "#06B6D4",
    bg: "#ECFEFF",
  },
  {
    id: "7",
    label: "Security",
    icon: "shield-outline",
    color: "#1A3C6E",
    bg: "#EEF4FD",
  },
  {
    id: "8",
    label: "More",
    icon: "grid-outline",
    color: "#6B7280",
    bg: "#F9FAFB",
  },
];

const PROS = [
  {
    id: "1",
    name: "Chukwudi A.",
    trade: "Master Plumber",
    rating: 4.9,
    jobs: 214,
    price: "₦3,500",
    tag: "Top Rated",
    tagColor: GOLD,
    tagText: BLUE,
    initials: "CA",
    avatarBg: "#1A3C6E",
  },
  {
    id: "2",
    name: "Amara O.",
    trade: "Electrician",
    rating: 4.8,
    jobs: 178,
    price: "₦4,000",
    tag: "Fast Response",
    tagColor: "#ECFDF5",
    tagText: "#10B981",
    initials: "AO",
    avatarBg: "#8B5CF6",
  },
  {
    id: "3",
    name: "Emeka T.",
    trade: "Painter & Decorator",
    rating: 4.7,
    jobs: 132,
    price: "₦2,800",
    tag: "Popular",
    tagColor: "#EFF6FF",
    tagText: "#3B82F6",
    initials: "ET",
    avatarBg: "#EF4444",
  },
  {
    id: "4",
    name: "Fatima K.",
    trade: "Deep Cleaner",
    rating: 5.0,
    jobs: 98,
    price: "₦5,500",
    tag: "⭐ New",
    tagColor: "#F5F3FF",
    tagText: "#8B5CF6",
    initials: "FK",
    avatarBg: "#10B981",
  },
];

const RECENT_BOOKINGS = [
  {
    id: "1",
    trade: "Plumbing",
    pro: "Chukwudi A.",
    date: "May 28, 2025",
    status: "Completed",
    statusColor: "#10B981",
    statusBg: "#ECFDF5",
    icon: "water-outline",
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
  },
  {
    id: "2",
    trade: "Electrical",
    pro: "Amara O.",
    date: "May 20, 2025",
    status: "Completed",
    statusColor: "#10B981",
    statusBg: "#ECFDF5",
    icon: "flash-outline",
    iconColor: "#F59E0B",
    iconBg: "#FFFBEB",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

// Hero banner — greeting + promo strip
function HeroBanner({ name = "John" }: { name?: string }) {
  const { colors } = useTheme();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <View style={[styles.heroBanner, { backgroundColor: colors.hero }]}>
      {/* Blobs */}
      <View style={[styles.heroBlob1, { backgroundColor: colors.surface + "18" }]} />
      <View style={[styles.heroBlob2, { backgroundColor: colors.accent + "18" }]} />

      <View style={styles.heroContent}>
        <View>
          <Text style={[styles.heroGreeting, { color: colors.textSecondary }]}>
            {greeting},
          </Text>
          <Text style={[styles.heroName, { color: colors.textPrimary }]}>
            {name} 👋
          </Text>

          <Text style={[styles.heroSub, { color: colors.textSecondary }]}>What do you need fixed today?</Text>
        </View>

        {/* Promo pill */}
        <View
          style={[
            styles.promoPill,
            { backgroundColor: colors.panel + "22", borderColor: colors.panel + "30" },
          ]}
        >
          <View style={styles.promoDot} />
          <Text style={[styles.promoText, { color: colors.accent }]}>500+ Pros Ready</Text>
        </View>
      </View>
    </View>
  );
}

// Search bar — tappable, routes to search tab
function SearchBar({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
    >
      <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
      <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>Search for a service...</Text>
      <View style={[styles.searchFilter, { backgroundColor: colors.cardAlt }]}>
        <Ionicons name="options-outline" size={16} color={colors.icon} />
      </View>
    </Pressable>
  );
}

// Category chip
function CategoryChip({
  item,
  onPress,
}: {
  item: (typeof CATEGORIES)[0];
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[
        styles.categoryChip,
        { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
      ]}
      onPress={onPress}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.bg }]}>
        <Ionicons name={item.icon as any} size={22} color={item.color} />
      </View>
      <Text style={[styles.categoryLabel, { color: colors.textPrimary }]}>
        {item.label}
      </Text>
    </Pressable>
  );
}

function ProCard({
  pro, onPress,
}: {
  pro: (typeof PROS)[0];
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[styles.proCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      {/* Tag */}
      <View style={[styles.proTag, { backgroundColor: pro.tagColor }]}>
        <Text style={[styles.proTagText, { color: pro.tagText }]}>
          {pro.tag}
        </Text>
      </View>

      {/* Avatar */}
      <View style={[styles.proAvatar, { backgroundColor: pro.avatarBg }]}>
        <Text style={styles.proInitials}>{pro.initials}</Text>
      </View>

      <Text style={[styles.proName, { color: colors.textPrimary }]}>{pro.name}</Text>
      <Text style={[styles.proTrade, { color: colors.textSecondary }]}>{pro.trade}</Text>

      {/* Rating row */}
      <View style={styles.proRatingRow}>
        <Ionicons name="star" size={12} color={colors.accent} />
        <Text style={[styles.proRating, { color: colors.textPrimary }]}>{pro.rating}</Text>
        <Text style={[styles.proJobs, { color: colors.textSecondary }]}>· {pro.jobs} jobs</Text>
      </View>

      {/* Price + Book */}
      <View style={styles.proPriceRow}>
        <Text style={[styles.proPrice, { color: colors.textPrimary }]}>{pro.price}/hr</Text>
        <View style={[styles.proBookBtn, { backgroundColor: colors.accent }]}>
          <Text style={[styles.proBookText, { color: colors.card }]}>Book</Text>
        </View>
      </View>
    </Pressable>
  );
}

function ActiveBookingCard({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[styles.activeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.activeContent}>
        <View style={styles.activeLeft}>
          <View style={[styles.activeIconBox, { backgroundColor: colors.cardAlt }]}>
            <Ionicons name="water-outline" size={20} color={colors.accent} />
          </View>
          <View>
            <Text style={[styles.activeTitle, { color: colors.textPrimary }]}>Plumbing Service</Text>
            <Text style={[styles.activePro, { color: colors.textSecondary }]}>Chukwudi A. • Today, 2:00 PM</Text>
          </View>
        </View>

        <View style={[styles.activeStatus, { backgroundColor: colors.surface }]}>
          <View style={[styles.activePulse, { backgroundColor: colors.success }]} />
          <Text style={[styles.activeStatusText, { color: colors.success }]}>En Route</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressTrack, { backgroundColor: colors.cardAlt }]}>
        <View style={[styles.progressFill, { width: "65%", backgroundColor: colors.accent }]} />
      </View>
      <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Pro is 8 mins away</Text>
    </Pressable>
  );
}

// Recent booking row
function RecentRow({
  item,
  onPress,
}: {
  item: (typeof RECENT_BOOKINGS)[0];
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable style={[styles.recentRow, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onPress}>
      <View style={[styles.recentIcon, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
      </View>
      <View style={styles.recentInfo}>
        <Text style={[styles.recentTrade, { color: colors.textPrimary }]}>{item.trade}</Text>
        <Text style={[styles.recentPro, { color: colors.textSecondary }]}>
          {item.pro} · {item.date}
        </Text>
      </View>
      <View style={[styles.recentBadge, { backgroundColor: item.statusBg }]}>
        <Text style={[styles.recentBadgeText, { color: item.statusColor }]}>
          {item.status}
        </Text>
      </View>
    </Pressable>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  // const { colors } = ThemeContext.useTheme();
  const { colors } = useTheme();

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <HeroBanner name="John" />

        {/* ── Search ────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <SearchBar onPress={() => router.push("/(tabs)/search")} />
        </View>

        {/* ── Active booking (only show if there's one) ─────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Active Booking</Text>
            <Pressable onPress={() => router.push("/(tabs)/bookings")}>
              <Text style={[styles.seeAll, { color: colors.accent }]}>See all →</Text>
            </Pressable>
          </View>
          <ActiveBookingCard onPress={() => router.push("/(modals)/booking")} />
        </View>

        {/* ── Categories ────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Services</Text>
            <Pressable onPress={() => router.push("/(tabs)/search")}>
              <Text style={[styles.seeAll, { color: colors.accent }]}>See all →</Text>
            </Pressable>
          </View>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.id}
                item={cat}
                onPress={() => router.push("/(tabs)/search")}
              />
            ))}
          </View>
        </View>

        {/* ── Featured Pros ──────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Top Pros Near You</Text>
            <Pressable onPress={() => router.push("/(tabs)/search")}>
              <Text style={[styles.seeAll, { color: colors.accent }]}>See all →</Text>
            </Pressable>
          </View>
          <FlatList
            data={PROS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 14, paddingHorizontal: 20 }}
            renderItem={({ item }) => (
              <ProCard
                pro={item}
                onPress={() => router.push("/(modals)/booking")}
              />
            )}
          />
        </View>

        {/* ── Recent Bookings ───────────────────────────────────────── */}
        <View style={[styles.section, { paddingHorizontal: 20 }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Bookings</Text>
            <Pressable onPress={() => router.push("/(tabs)/bookings")}>
              <Text style={[styles.seeAll, { color: colors.accent }]}>See all →</Text>
            </Pressable>
          </View>
          <View style={styles.recentList}>
            {RECENT_BOOKINGS.map((item) => (
              <RecentRow
                key={item.id}
                item={item}
                onPress={() => router.push("/(tabs)/bookings")}
              />
            ))}
          </View>
        </View>

        {/* ── Promo banner ──────────────────────────────────────────── */}
        <View style={[styles.section, { paddingHorizontal: 20 }]}>
          <Pressable style={[styles.promoBanner, { backgroundColor: colors.card }]}>
            <View style={[styles.promoBannerBlob, { backgroundColor: colors.surface + "18" }]} />
            <View>
              <Text style={[styles.promoBannerTitle, { color: colors.textPrimary }]}>Invite & Earn 🎁</Text>
              <Text style={[styles.promoBannerSub, { color: colors.textSecondary }]}>
                Get ₦1,000 for every friend{"\n"}who books their first service.
              </Text>
              <View style={[styles.promoBannerBtn, { backgroundColor: colors.accent }]}>
                <Text style={[styles.promoBannerBtnText, { color: colors.card }]}>Invite Friends</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFD" },
  scroll: { paddingBottom: 24 },

  section: { marginTop: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: BLUE,
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "700",
    color: GOLD,
  },

  // ── Hero ──
  heroBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: BLUE,
    borderRadius: 24,
    padding: 24,
    overflow: "hidden",
    minHeight: 140,
    justifyContent: "center",
  },
  heroBlob1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#ffffff18",
    top: -60,
    right: -40,
  },
  heroBlob2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFC30020",
    bottom: -20,
    left: 20,
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  heroGreeting: {
    fontSize: 14,
    color: "#ffffff90",
    fontWeight: "500",
    marginBottom: 2,
  },
  heroName: {
    fontSize: 26,
    fontWeight: "900",
    color: WHITE,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    color: "#ffffffaa",
    fontWeight: "500",
  },
  promoPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff20",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#ffffff30",
  },
  promoDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: GOLD,
  },
  promoText: {
    fontSize: 11,
    fontWeight: "800",
    color: GOLD,
    letterSpacing: 0.3,
  },

  // ── Search ──
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    marginHorizontal: 20,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 10,
    shadowColor: BLUE,
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#EAF0FB",
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: "#A0AEC0",
    fontWeight: "500",
  },
  searchFilter: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEF4FD",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Active booking ──
  activeCard: {
    marginHorizontal: 20,
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 16,
    shadowColor: BLUE,
    shadowOpacity: 0.09,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    borderWidth: 1,
    borderColor: "#EAF0FB",
    overflow: "hidden",
  },
  activeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  activeLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  activeIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  activeTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: BLUE,
    marginBottom: 2,
  },
  activePro: { fontSize: 12, color: GREY, fontWeight: "500" },
  activeStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#ECFDF5",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  activePulse: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  activeStatusText: { fontSize: 12, fontWeight: "700", color: "#10B981" },
  progressTrack: {
    height: 5,
    backgroundColor: "#EEF4FD",
    borderRadius: 4,
    marginBottom: 6,
  },
  progressFill: {
    height: 5,
    backgroundColor: GOLD,
    borderRadius: 4,
  },
  progressLabel: { fontSize: 11, color: GREY, fontWeight: "500" },

  // ── Categories ──
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    width: (width - 56) / 4,
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 18,
  },
  categoryIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: BLUE,
    textAlign: "center",
  },

  // ── Pro card ──
  proCard: {
    width: 158,
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 14,
    shadowColor: BLUE,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#EAF0FB",
  },
  proTag: {
    alignSelf: "flex-start",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  proTagText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.2 },
  proAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  proInitials: { fontSize: 18, fontWeight: "900", color: WHITE },
  proName: { fontSize: 13, fontWeight: "800", color: BLUE, marginBottom: 2 },
  proTrade: { fontSize: 11, color: GREY, fontWeight: "500", marginBottom: 8 },
  proRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 10,
  },
  proRating: { fontSize: 12, fontWeight: "700", color: BLUE },
  proJobs: { fontSize: 11, color: GREY },
  proPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  proPrice: { fontSize: 13, fontWeight: "800", color: BLUE },
  proBookBtn: {
    backgroundColor: GOLD,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  proBookText: { fontSize: 11, fontWeight: "800", color: BLUE },

  // ── Recent bookings ──
  recentList: { gap: 10 },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: BLUE,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EAF0FB",
  },
  recentIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  recentInfo: { flex: 1 },
  recentTrade: {
    fontSize: 14,
    fontWeight: "700",
    color: BLUE,
    marginBottom: 3,
  },
  recentPro: { fontSize: 12, color: GREY, fontWeight: "500" },
  recentBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  recentBadgeText: { fontSize: 11, fontWeight: "700" },

  // ── Promo banner ──
  promoBanner: {
    backgroundColor: BLUE,
    borderRadius: 20,
    padding: 24,
    overflow: "hidden",
  },
  promoBannerBlob: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#ffffff12",
    top: -50,
    right: -30,
  },
  promoBannerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: WHITE,
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  promoBannerSub: {
    fontSize: 13,
    color: "#ffffffaa",
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 16,
  },
  promoBannerBtn: {
    alignSelf: "flex-start",
    backgroundColor: GOLD,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  promoBannerBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: BLUE,
  },
});
