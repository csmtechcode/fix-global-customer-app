// app/(tabs)/search.tsx
// FixGlobal — Search Screen
// Live search + filter sheet (distance, rating, reviews, price)
// Full dark-mode support via useTheme — mirrors home.tsx pattern

import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
  Modal,
  Animated,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TopBar from "../../src/components/layout/TopBar";
import Navbar from "../../src/components/layout/Navbar";
import useTheme from "../../src/context/ThemeContext";

const { height } = Dimensions.get("window");

// ─── Static tokens (non-theme) ────────────────────────────────────────────────
const GOLD = "#FFC300";
const WHITE = "#FFFFFF";
const BLUE = "#1A3C6E";

// ─── Mock fixers data ─────────────────────────────────────────────────────────
const ALL_FIXERS = [
  {
    id: "1",
    name: "Chukwudi Adeyemi",
    trade: "Master Plumber",
    category: "Plumbing",
    rating: 4.9,
    reviews: 214,
    distance: 1.2,
    price: 3500,
    priceLabel: "₦3,500/hr",
    tag: "Top Rated",
    tagColor: GOLD,
    tagText: BLUE,
    avatarBg: "#1A3C6E",
    initials: "CA",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    available: true,
  },
  {
    id: "2",
    name: "Amara Okonkwo",
    trade: "Certified Electrician",
    category: "Electrical",
    rating: 4.8,
    reviews: 178,
    distance: 2.4,
    price: 4000,
    priceLabel: "₦4,000/hr",
    tag: "Fast Response",
    tagColor: "#ECFDF5",
    tagText: "#10B981",
    avatarBg: "#8B5CF6",
    initials: "AO",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    available: true,
  },
  {
    id: "3",
    name: "Emeka Tunde",
    trade: "Painter & Decorator",
    category: "Painting",
    rating: 4.7,
    reviews: 132,
    distance: 3.1,
    price: 2800,
    priceLabel: "₦2,800/hr",
    tag: "Popular",
    tagColor: "#EFF6FF",
    tagText: "#3B82F6",
    avatarBg: "#EF4444",
    initials: "ET",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    available: false,
  },
  {
    id: "4",
    name: "Fatima Kabir",
    trade: "Deep Cleaning Expert",
    category: "Cleaning",
    rating: 5.0,
    reviews: 98,
    distance: 0.8,
    price: 5500,
    priceLabel: "₦5,500/hr",
    tag: "⭐ New",
    tagColor: "#F5F3FF",
    tagText: "#8B5CF6",
    avatarBg: "#10B981",
    initials: "FK",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    available: true,
  },
  {
    id: "5",
    name: "Biodun Salami",
    trade: "AC & Appliance Repair",
    category: "AC Repair",
    rating: 4.6,
    reviews: 89,
    distance: 4.5,
    price: 6000,
    priceLabel: "₦6,000/hr",
    tag: "Verified",
    tagColor: "#FEF9EC",
    tagText: "#B8860B",
    avatarBg: "#06B6D4",
    initials: "BS",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    available: true,
  },
];

const CATEGORIES = [
  { id: "all", label: "All", icon: "grid-outline" },
  { id: "Plumbing", label: "Plumbing", icon: "water-outline" },
  { id: "Electrical", label: "Electrical", icon: "flash-outline" },
  { id: "Painting", label: "Painting", icon: "color-palette-outline" },
  { id: "Cleaning", label: "Cleaning", icon: "sparkles-outline" },
  { id: "AC Repair", label: "AC Repair", icon: "snow-outline" },
];

// ─── Filter state type ────────────────────────────────────────────────────────
interface Filters {
  maxDistance: number;
  minRating: number;
  minReviews: number;
  maxPrice: number;
  sortBy: "rating" | "distance" | "price" | "reviews";
}

const DEFAULT_FILTERS: Filters = {
  maxDistance: 10,
  minRating: 0,
  minReviews: 0,
  maxPrice: 10000,
  sortBy: "rating",
};

// ─── Fixer card ───────────────────────────────────────────────────────────────
function FixerCard({
  fixer,
  onViewProfile,
}: {
  fixer: (typeof ALL_FIXERS)[0];
  onViewProfile: () => void;
}) {
  const { colors } = useTheme();
  const [imgError, setImgError] = useState(false);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.textPrimary,
        },
      ]}
    >
      {/* Card top: avatar + tag */}
      <View style={styles.cardTop}>
        <View style={styles.avatarWrap}>
          {!imgError ? (
            <Image
              source={{ uri: fixer.avatar }}
              style={[styles.avatar, { borderColor: colors.border }]}
              onError={() => setImgError(true)}
            />
          ) : (
            <View
              style={[styles.avatarFallback, { backgroundColor: fixer.avatarBg }]}
            >
              <Text style={styles.avatarInitials}>{fixer.initials}</Text>
            </View>
          )}
          {/* Online dot */}
          <View
            style={[
              styles.onlineDot,
              {
                backgroundColor: fixer.available ? colors.success : colors.muted,
                borderColor: colors.card,
              },
            ]}
          />
        </View>

        {/* Tag */}
        <View style={[styles.tag, { backgroundColor: fixer.tagColor }]}>
          <Text style={[styles.tagText, { color: fixer.tagText }]}>
            {fixer.tag}
          </Text>
        </View>
      </View>

      {/* Info */}
      <Text style={[styles.fixerName, { color: colors.textPrimary }]}>
        {fixer.name}
      </Text>
      <Text style={[styles.fixerTrade, { color: colors.textSecondary }]}>
        {fixer.trade}
      </Text>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={[styles.statPill, { backgroundColor: colors.cardAlt }]}>
          <Ionicons name="star" size={12} color={colors.accent} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {fixer.rating}
          </Text>
        </View>
        <View style={[styles.statPill, { backgroundColor: colors.cardAlt }]}>
          <Ionicons name="chatbubble-outline" size={12} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {fixer.reviews} reviews
          </Text>
        </View>
        <View style={[styles.statPill, { backgroundColor: colors.cardAlt }]}>
          <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {fixer.distance} km
          </Text>
        </View>
      </View>

      {/* Price + CTA */}
      <View style={[styles.cardBottom, { borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
            Starting from
          </Text>
          <Text style={[styles.price, { color: colors.textPrimary }]}>
            {fixer.priceLabel}
          </Text>
        </View>
        <Pressable
          style={[styles.viewBtn, { backgroundColor: colors.accent }]}
          onPress={onViewProfile}
        >
          <Text style={[styles.viewBtnText, { color: colors.card }]}>View Profile</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.card} />
        </Pressable>
      </View>
    </View>
  );
}

// ─── Filter bottom sheet ──────────────────────────────────────────────────────
function FilterSheet({
  visible,
  filters,
  onApply,
  onClose,
}: {
  visible: boolean;
  filters: Filters;
  onApply: (f: Filters) => void;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  const [local, setLocal] = useState<Filters>(filters);
  const slideAnim = useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : height,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  }, [visible, slideAnim]);

  const SORT_OPTIONS: { key: Filters["sortBy"]; label: string }[] = [
    { key: "rating", label: "⭐ Rating" },
    { key: "distance", label: "📍 Distance" },
    { key: "price", label: "💰 Price" },
    { key: "reviews", label: "💬 Reviews" },
  ];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.panel,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Handle */}
        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
        <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>
          Filter & Sort
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Sort by */}
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
            Sort By
          </Text>
          <View style={styles.sortRow}>
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.key}
                style={[
                  styles.sortChip,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                  local.sortBy === opt.key && {
                    backgroundColor: colors.icon,
                    borderColor: colors.icon,
                  },
                ]}
                onPress={() => setLocal((p) => ({ ...p, sortBy: opt.key }))}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    { color: colors.textSecondary },
                    local.sortBy === opt.key && { color: colors.panel },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Max distance */}
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
            Max Distance:{" "}
            <Text style={[styles.filterValue, { color: colors.accent }]}>
              {local.maxDistance} km
            </Text>
          </Text>
          <View style={styles.sliderRow}>
            {[1, 2, 5, 10, 20].map((v) => (
              <Pressable
                key={v}
                style={[
                  styles.sliderChip,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                  local.maxDistance === v && {
                    backgroundColor: colors.accent,
                    borderColor: colors.accent,
                  },
                ]}
                onPress={() => setLocal((p) => ({ ...p, maxDistance: v }))}
              >
                <Text
                  style={[
                    styles.sliderChipText,
                    { color: colors.textSecondary },
                    local.maxDistance === v && { color: colors.panel },
                  ]}
                >
                  {v} km
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Min rating */}
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
            Min Rating:{" "}
            <Text style={[styles.filterValue, { color: colors.accent }]}>
              {local.minRating === 0 ? "Any" : `${local.minRating}+`}
            </Text>
          </Text>
          <View style={styles.sliderRow}>
            {[0, 4.0, 4.5, 4.8, 5.0].map((v) => (
              <Pressable
                key={v}
                style={[
                  styles.sliderChip,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                  local.minRating === v && {
                    backgroundColor: colors.accent,
                    borderColor: colors.accent,
                  },
                ]}
                onPress={() => setLocal((p) => ({ ...p, minRating: v }))}
              >
                <Text
                  style={[
                    styles.sliderChipText,
                    { color: colors.textSecondary },
                    local.minRating === v && { color: colors.panel },
                  ]}
                >
                  {v === 0 ? "Any" : `${v}+`}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Min reviews */}
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
            Min Reviews:{" "}
            <Text style={[styles.filterValue, { color: colors.accent }]}>
              {local.minReviews === 0 ? "Any" : `${local.minReviews}+`}
            </Text>
          </Text>
          <View style={styles.sliderRow}>
            {[0, 50, 100, 150, 200].map((v) => (
              <Pressable
                key={v}
                style={[
                  styles.sliderChip,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                  local.minReviews === v && {
                    backgroundColor: colors.accent,
                    borderColor: colors.accent,
                  },
                ]}
                onPress={() => setLocal((p) => ({ ...p, minReviews: v }))}
              >
                <Text
                  style={[
                    styles.sliderChipText,
                    { color: colors.textSecondary },
                    local.minReviews === v && { color: colors.panel },
                  ]}
                >
                  {v === 0 ? "Any" : `${v}+`}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Max price */}
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
            Max Price:{" "}
            <Text style={[styles.filterValue, { color: colors.accent }]}>
              {local.maxPrice >= 10000
                ? "Any"
                : `₦${local.maxPrice.toLocaleString()}/hr`}
            </Text>
          </Text>
          <View style={styles.sliderRow}>
            {[2000, 3500, 5000, 7500, 10000].map((v) => (
              <Pressable
                key={v}
                style={[
                  styles.sliderChip,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                  local.maxPrice === v && {
                    backgroundColor: colors.accent,
                    borderColor: colors.accent,
                  },
                ]}
                onPress={() => setLocal((p) => ({ ...p, maxPrice: v }))}
              >
                <Text
                  style={[
                    styles.sliderChipText,
                    { color: colors.textSecondary },
                    local.maxPrice === v && { color: colors.panel },
                  ]}
                >
                  {v >= 10000
                    ? "Any"
                    : `₦${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Action buttons */}
        <View style={styles.sheetActions}>
          <Pressable
            style={[
              styles.resetBtn,
              { borderColor: colors.border, backgroundColor: colors.panel },
            ]}
            onPress={() => setLocal(DEFAULT_FILTERS)}
          >
            <Text style={[styles.resetBtnText, { color: colors.textPrimary }]}>
              Reset
            </Text>
          </Pressable>
          <Pressable
            style={[styles.applyBtn, { backgroundColor: colors.accent }]}
            onPress={() => {
              onApply(local);
              onClose();
            }}
          >
            <Text style={[styles.applyBtnText, { color: colors.card }]}>
              Apply Filters
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.maxDistance !== DEFAULT_FILTERS.maxDistance) count++;
    if (filters.minRating !== DEFAULT_FILTERS.minRating) count++;
    if (filters.minReviews !== DEFAULT_FILTERS.minReviews) count++;
    if (filters.maxPrice !== DEFAULT_FILTERS.maxPrice) count++;
    if (filters.sortBy !== DEFAULT_FILTERS.sortBy) count++;
    return count;
  }, [filters]);

  // Filter + search logic
  const results = useMemo(() => {
    let list = [...ALL_FIXERS];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.trade.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== "all") {
      list = list.filter((f) => f.category === activeCategory);
    }
    list = list.filter((f) => f.distance <= filters.maxDistance);
    list = list.filter((f) => f.rating >= filters.minRating);
    list = list.filter((f) => f.reviews >= filters.minReviews);
    list = list.filter((f) => f.price <= filters.maxPrice);
    list.sort((a, b) => {
      switch (filters.sortBy) {
        case "distance": return a.distance - b.distance;
        case "price": return a.price - b.price;
        case "reviews": return b.reviews - a.reviews;
        default: return b.rating - a.rating;
      }
    });
    return list;
  }, [query, activeCategory, filters]);

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

      {/* ── Search bar + filter button ─────────────────────────────── */}
      <View
        style={[
          styles.searchRow,
          {
            backgroundColor: colors.panel,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            value={query}
            onChangeText={setQuery}
            placeholder="Search fixers, services..."
            placeholderTextColor={colors.muted}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>

        {/* Filter button */}
        <Pressable
          style={[
            styles.filterBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            activeFilterCount > 0 && {
              backgroundColor: colors.icon,
              borderColor: colors.icon,
            },
          ]}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeFilterCount > 0 ? colors.panel : colors.icon}
          />
          {activeFilterCount > 0 && (
            <View style={[styles.filterBadge, { borderColor: colors.panel }]}>
              <Text style={[styles.filterBadgeText, { color: colors.panel }]}>
                {activeFilterCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* ── Category chips ─────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[
          styles.categoryScrollOuter,
          {
            backgroundColor: colors.panel,
            borderBottomColor: colors.border,
          },
        ]}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            style={[
              styles.categoryChip,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              activeCategory === cat.id && {
                backgroundColor: colors.icon,
                borderColor: colors.icon,
              },
            ]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Ionicons
              name={cat.icon as any}
              size={14}
              color={activeCategory === cat.id ? colors.panel : colors.textSecondary}
            />
            <Text
              style={[
                styles.categoryChipText,
                { color: colors.textSecondary },
                activeCategory === cat.id && { color: colors.panel },
              ]}
            >
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ── Results count ──────────────────────────────────────────── */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
          {results.length} fixer{results.length !== 1 ? "s" : ""} found
        </Text>
        {activeFilterCount > 0 && (
          <Pressable onPress={() => setFilters(DEFAULT_FILTERS)}>
            <Text style={[styles.clearFilters, { color: colors.accent }]}>
              Clear filters
            </Text>
          </Pressable>
        )}
      </View>

      {/* ── Fixer list ─────────────────────────────────────────────── */}
      {results.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={52} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            No fixers found
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
            Try adjusting your search or filters
          </Text>
          <Pressable
            style={[styles.emptyBtn, { backgroundColor: colors.accent }]}
            onPress={() => {
              setQuery("");
              setFilters(DEFAULT_FILTERS);
              setActiveCategory("all");
            }}
          >
            <Text style={[styles.emptyBtnText, { color: colors.card }]}>
              Reset Search
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <FixerCard
                fixer={item}
                onViewProfile={() => console.log("View profile:", item.name)}
              />
            )}
          />
        </View>
      )}

      {/* ── Filter sheet ───────────────────────────────────────────── */}
      <FilterSheet
        visible={showFilters}
        filters={filters}
        onApply={setFilters}
        onClose={() => setShowFilters(false)}
      />

      <Navbar />
    </SafeAreaView>
  );
}

// ─── Styles (layout/spacing only — colours applied inline) ───────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Search row ──
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
    borderBottomWidth: 1,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  filterBadgeText: { fontSize: 9, fontWeight: "900" },

  // ── Category chips ──
  categoryScrollOuter: {
    borderBottomWidth: 1,
    flexGrow: 0,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    alignItems: "center",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: { fontSize: 12, fontWeight: "700" },

  // ── Results header ──
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  resultsCount: { fontSize: 13, fontWeight: "700" },
  clearFilters: { fontSize: 13, fontWeight: "700" },

  // ── List ──
  list: { paddingHorizontal: 20, paddingBottom: 24, gap: 14 },

  // ── Fixer card ──
  card: {
    borderRadius: 20,
    padding: 16,
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  avatarWrap: { position: "relative" },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: { fontSize: 22, fontWeight: "900", color: WHITE },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  tagText: { fontSize: 11, fontWeight: "800" },

  fixerName: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  fixerTrade: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statText: { fontSize: 12, fontWeight: "600" },

  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  priceLabel: { fontSize: 10, fontWeight: "500", marginBottom: 2 },
  price: { fontSize: 16, fontWeight: "900" },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  viewBtnText: { fontSize: 13, fontWeight: "800" },

  // ── Empty state ──
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

  // ── Filter sheet ──
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00000055",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    maxHeight: height * 0.82,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 20,
    letterSpacing: -0.4,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  filterValue: { fontWeight: "800", textTransform: "none" },

  sortRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  sortChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  sortChipText: { fontSize: 13, fontWeight: "700" },

  sliderRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  sliderChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  sliderChipText: { fontSize: 13, fontWeight: "700" },

  sheetActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  resetBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  resetBtnText: { fontSize: 15, fontWeight: "700" },
  applyBtn: {
    flex: 2,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  applyBtnText: { fontSize: 15, fontWeight: "800" },
});