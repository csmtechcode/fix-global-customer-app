import React, { useState, useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../src/context/ThemeContext";
import TopBar from "../../src/components/layout/TopBar";
import Navbar from "../../src/components/layout/Navbar";

// ─── Mock data ─────────────────────────────────────────────────────────────────
const ALL_FAVORITES = [
  {
    id: "1",
    name: "Chukwudi A.",
    title: "Master Plumber",
    subtitle: "Plumbing, repairs, faucet installation",
    rating: "4.9",
    jobs: 214,
    price: "₦3,500",
    initials: "CA",
    avatarBg: "#1A3C6E",
    tag: "Top Rated",
    tagBg: "#FFC300",
    tagText: "#1A3C6E",
  },
  {
    id: "2",
    name: "Amara O.",
    title: "Electrician",
    subtitle: "Wiring, lights, fan installation",
    rating: "4.8",
    jobs: 178,
    price: "₦4,000",
    initials: "AO",
    avatarBg: "#8B5CF6",
    tag: "Fast Response",
    tagBg: "#ECFDF5",
    tagText: "#10B981",
  },
  {
    id: "3",
    name: "Fatima K.",
    title: "Deep Cleaner",
    subtitle: "Deep cleaning, disinfection, laundry",
    rating: "4.7",
    jobs: 98,
    price: "₦5,500",
    initials: "FK",
    avatarBg: "#10B981",
    tag: "Popular",
    tagBg: "#EFF6FF",
    tagText: "#3B82F6",
  },
];

// ─── FavoriteCard ──────────────────────────────────────────────────────────────
function FavoriteCard({
  item,
  onBook,
  onRemove,
}: {
  item: (typeof ALL_FAVORITES)[0];
  onBook: () => void;
  onRemove: () => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Tag */}
      <View style={[styles.cardTag, { backgroundColor: item.tagBg }]}>
        <Text style={[styles.cardTagText, { color: item.tagText }]}>{item.tag}</Text>
      </View>

      {/* Remove heart */}
      <Pressable style={styles.heartBtn} onPress={onRemove} hitSlop={8}>
        <Ionicons name="heart" size={18} color={colors.danger} />
      </Pressable>

      {/* Avatar + Info row */}
      <View style={styles.cardTopRow}>
        <View style={[styles.avatarCircle, { backgroundColor: item.avatarBg }]}>
          <Text style={styles.avatarText}>{item.initials}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.cardName, { color: colors.textPrimary }]}>{item.name}</Text>
          <Text style={[styles.cardTitle, { color: colors.accent }]}>{item.title}</Text>
          <Text
            style={[styles.cardSubtitle, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {item.subtitle}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={[styles.statChip, { backgroundColor: colors.cardAlt }]}>
          <Ionicons name="star" size={13} color={colors.accent} />
          <Text style={[styles.statText, { color: colors.textPrimary }]}>{item.rating}</Text>
        </View>
        <View style={[styles.statChip, { backgroundColor: colors.cardAlt }]}>
          <Ionicons name="briefcase-outline" size={13} color={colors.icon} />
          <Text style={[styles.statText, { color: colors.textPrimary }]}>{item.jobs} jobs</Text>
        </View>
        <View style={[styles.statChip, { backgroundColor: colors.cardAlt }]}>
          <Ionicons name="cash-outline" size={13} color={colors.icon} />
          <Text style={[styles.statText, { color: colors.textPrimary }]}>{item.price}/hr</Text>
        </View>
      </View>

      {/* Book Again */}
      <Pressable
        style={[styles.bookBtn, { backgroundColor: colors.icon }]}
        onPress={onBook}
      >
        <Ionicons name="calendar-outline" size={15} color={colors.card} />
        <Text style={[styles.bookBtnText, { color: colors.card }]}>Book Again</Text>
      </Pressable>
    </View>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ isSearch }: { isSearch: boolean }) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.emptyBlob, { backgroundColor: colors.surface }]} />
      <View style={[styles.emptyIconBox, { backgroundColor: colors.surface }]}>
        <Ionicons
          name={isSearch ? "search-outline" : "heart-outline"}
          size={36}
          color={colors.accent}
        />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
        {isSearch ? "No results found" : "No favorites yet"}
      </Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {isSearch
          ? "Try searching by name, trade, or service."
          : "Save trusted pros here for faster access and one-tap booking."}
      </Text>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [favorites, setFavorites] = useState(ALL_FAVORITES);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRemove = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return favorites;
    return favorites.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.subtitle.toLowerCase().includes(q)
    );
  }, [searchQuery, favorites]);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      {/* ── TopBar ───────────────────────────────────────────── */}
      <TopBar
        location="Lagos, NG"
        notificationCount={3}
        initials="JD"
        onNotificationPress={() => router.push("/(tabs)/notifications")}
        onLocationPress={() => router.push("/(tabs)/settings")}
        onAvatarPress={() => router.push("/(tabs)/profile")}
      />

      {/* ── Page Header: Back Button + Search Bar (always visible) ───────── */}
      <View
        style={[
          styles.pageHeader,
          { backgroundColor: colors.panel, borderBottomColor: colors.border },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={20} color={colors.icon} />
        </Pressable>

        <View
          style={[
            styles.searchBarTrigger,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons name="search-outline" size={16} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search by name or trade..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Hero strip ─────────────────────────────────────────── */}
        {searchQuery.length === 0 && (
          <View style={[styles.heroBanner, { backgroundColor: colors.hero }]}>
            <View style={[styles.heroBlob, { backgroundColor: colors.accent + "18" }]} />
            <View>
              <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                Your Saved Pros
              </Text>
              <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
                One tap to rebook the pros you trust.
              </Text>
            </View>
            <View
              style={[
                styles.heroPill,
                {
                  backgroundColor: colors.accent + "22",
                  borderColor: colors.accent + "44",
                },
              ]}
            >
              <View style={[styles.heroDot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.heroPillText, { color: colors.accent }]}>
                {favorites.length} Saved
              </Text>
            </View>
          </View>
        )}

        {/* ── Cards ──────────────────────────────────────────────── */}
        <View style={styles.listWrapper}>
          {filtered.length === 0 ? (
            <EmptyState isSearch={searchQuery.length > 0} />
          ) : (
            filtered.map((item) => (
              <FavoriteCard
                key={item.id}
                item={item}
                onBook={() => router.push("/(tabs)/bookings")}
                onRemove={() => handleRemove(item.id)}
              />
            ))
          )}
        </View>

        {/* ── Tip banner ─────────────────────────────────────────── */}
        {favorites.length > 0 && searchQuery.length === 0 && (
          <View
            style={[
              styles.tipBanner,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              Tap the{" "}
              <Text style={{ color: colors.danger, fontWeight: "700" }}>♥</Text>{" "}
              icon to remove a pro from your favorites.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Navbar at bottom ───────────────────────────────────────── */}
      <Navbar active="profile" />
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  // Page Header: Back button + Search bar side-by-side
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBarTrigger: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
    fontWeight: "500",
  },
  closeSearchBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // Search (expanded)
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    padding: 0,
  },
  resultCount: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    marginLeft: 2,
  },

  scroll: { paddingBottom: 24 },

  // Hero strip
  heroBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    minHeight: 80,
  },
  heroBlob: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    top: -40,
    right: -20,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  heroSub: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  heroDot: { width: 7, height: 7, borderRadius: 4 },
  heroPillText: { fontSize: 12, fontWeight: "800" },

  // Cards
  listWrapper: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
    overflow: "hidden",
  },
  cardTag: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  cardTagText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.3 },
  heartBtn: { position: "absolute", top: 16, right: 16, padding: 4 },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "900", color: "#FFFFFF" },
  cardName: { fontSize: 16, fontWeight: "800", letterSpacing: -0.3, marginBottom: 2 },
  cardTitle: { fontSize: 13, fontWeight: "700", marginBottom: 3 },
  cardSubtitle: { fontSize: 12, fontWeight: "500", lineHeight: 16 },
  divider: { height: 1, marginBottom: 14 },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  statText: { fontSize: 12, fontWeight: "700" },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  bookBtnText: { fontSize: 14, fontWeight: "800", letterSpacing: 0.2 },

  // Empty
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 36,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    marginTop: 8,
  },
  emptyBlob: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -80,
    right: -60,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 17, fontWeight: "800", marginBottom: 8, letterSpacing: -0.3 },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
  },

  // Tip
  tipBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginTop: 4,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  tipText: { flex: 1, fontSize: 13, lineHeight: 18, fontWeight: "500" },
});