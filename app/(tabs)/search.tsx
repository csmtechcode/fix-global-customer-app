// app/(tabs)/search.tsx
// FixGlobal — Search Screen
// Live search + filter sheet (distance, rating, reviews, price)

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
import useTheme  from "../../src/context/ThemeContext";

const { width, height } = Dimensions.get("window");

// ─── Tokens ──────────────────────────────────────────────────────────────────
const BLUE = "#1A3C6E";
const GOLD = "#FFC300";
const WHITE = "#FFFFFF";
const GREY = "#64748B";
const LIGHT = "#F4F7FD";

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
  maxDistance: number; // km
  minRating: number;
  minReviews: number;
  maxPrice: number; // naira/hr
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
  const [imgError, setImgError] = useState(false);

  return (
    <View style={styles.card}>
      {/* Availability dot */}
      <View style={styles.cardTop}>
        <View style={styles.avatarWrap}>
          {!imgError ? (
            <Image
              source={{ uri: fixer.avatar }}
              style={styles.avatar}
              onError={() => setImgError(true)}
            />
          ) : (
            <View
              style={[
                styles.avatarFallback,
                { backgroundColor: fixer.avatarBg },
              ]}
            >
              <Text style={styles.avatarInitials}>{fixer.initials}</Text>
            </View>
          )}
          {/* Online dot */}
          <View
            style={[
              styles.onlineDot,
              { backgroundColor: fixer.available ? "#10B981" : "#CBD5E0" },
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
      <Text style={styles.fixerName}>{fixer.name}</Text>
      <Text style={styles.fixerTrade}>{fixer.trade}</Text>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Ionicons name="star" size={12} color={GOLD} />
          <Text style={styles.statText}>{fixer.rating}</Text>
        </View>
        <View style={styles.statPill}>
          <Ionicons name="chatbubble-outline" size={12} color={GREY} />
          <Text style={styles.statText}>{fixer.reviews} reviews</Text>
        </View>
        <View style={styles.statPill}>
          <Ionicons name="location-outline" size={12} color={GREY} />
          <Text style={styles.statText}>{fixer.distance} km</Text>
        </View>
      </View>

      {/* Price + CTA */}
      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.priceLabel}>Starting from</Text>
          <Text style={styles.price}>{fixer.priceLabel}</Text>
        </View>
        <Pressable style={styles.viewBtn} onPress={onViewProfile}>
          <Text style={styles.viewBtnText}>View Profile</Text>
          <Ionicons name="arrow-forward" size={14} color={WHITE} />
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
  const [local, setLocal] = useState<Filters>(filters);
  const slideAnim = useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : height,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  }, [visible]);

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
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        {/* Handle */}
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>Filter & Sort</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Sort by */}
          <Text style={styles.filterLabel}>Sort By</Text>
          <View style={styles.sortRow}>
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.key}
                style={[
                  styles.sortChip,
                  local.sortBy === opt.key && styles.sortChipActive,
                ]}
                onPress={() => setLocal((p) => ({ ...p, sortBy: opt.key }))}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    local.sortBy === opt.key && styles.sortChipTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Max distance */}
          <Text style={styles.filterLabel}>
            Max Distance:{" "}
            <Text style={styles.filterValue}>{local.maxDistance} km</Text>
          </Text>
          <View style={styles.sliderRow}>
            {[1, 2, 5, 10, 20].map((v) => (
              <Pressable
                key={v}
                style={[
                  styles.sliderChip,
                  local.maxDistance === v && styles.sliderChipActive,
                ]}
                onPress={() => setLocal((p) => ({ ...p, maxDistance: v }))}
              >
                <Text
                  style={[
                    styles.sliderChipText,
                    local.maxDistance === v && styles.sliderChipTextActive,
                  ]}
                >
                  {v} km
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Min rating */}
          <Text style={styles.filterLabel}>
            Min Rating:{" "}
            <Text style={styles.filterValue}>
              {local.minRating === 0 ? "Any" : `${local.minRating}+`}
            </Text>
          </Text>
          <View style={styles.sliderRow}>
            {[0, 4.0, 4.5, 4.8, 5.0].map((v) => (
              <Pressable
                key={v}
                style={[
                  styles.sliderChip,
                  local.minRating === v && styles.sliderChipActive,
                ]}
                onPress={() => setLocal((p) => ({ ...p, minRating: v }))}
              >
                <Text
                  style={[
                    styles.sliderChipText,
                    local.minRating === v && styles.sliderChipTextActive,
                  ]}
                >
                  {v === 0 ? "Any" : `${v}+`}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Min reviews */}
          <Text style={styles.filterLabel}>
            Min Reviews:{" "}
            <Text style={styles.filterValue}>
              {local.minReviews === 0 ? "Any" : `${local.minReviews}+`}
            </Text>
          </Text>
          <View style={styles.sliderRow}>
            {[0, 50, 100, 150, 200].map((v) => (
              <Pressable
                key={v}
                style={[
                  styles.sliderChip,
                  local.minReviews === v && styles.sliderChipActive,
                ]}
                onPress={() => setLocal((p) => ({ ...p, minReviews: v }))}
              >
                <Text
                  style={[
                    styles.sliderChipText,
                    local.minReviews === v && styles.sliderChipTextActive,
                  ]}
                >
                  {v === 0 ? "Any" : `${v}+`}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Max price */}
          <Text style={styles.filterLabel}>
            Max Price:{" "}
            <Text style={styles.filterValue}>
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
                  local.maxPrice === v && styles.sliderChipActive,
                ]}
                onPress={() => setLocal((p) => ({ ...p, maxPrice: v }))}
              >
                <Text
                  style={[
                    styles.sliderChipText,
                    local.maxPrice === v && styles.sliderChipTextActive,
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
            style={styles.resetBtn}
            onPress={() => setLocal(DEFAULT_FILTERS)}
          >
            <Text style={styles.resetBtnText}>Reset</Text>
          </Pressable>
          <Pressable
            style={styles.applyBtn}
            onPress={() => {
              onApply(local);
              onClose();
            }}
          >
            <Text style={styles.applyBtnText}>Apply Filters</Text>
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

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.trade.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q),
      );
    }

    // Category filter
    if (activeCategory !== "all") {
      list = list.filter((f) => f.category === activeCategory);
    }

    // Distance
    list = list.filter((f) => f.distance <= filters.maxDistance);
    // Rating
    list = list.filter((f) => f.rating >= filters.minRating);
    // Reviews
    list = list.filter((f) => f.reviews >= filters.minReviews);
    // Price
    list = list.filter((f) => f.price <= filters.maxPrice);

    // Sort
    list.sort((a, b) => {
      switch (filters.sortBy) {
        case "distance":
          return a.distance - b.distance;
        case "price":
          return a.price - b.price;
        case "reviews":
          return b.reviews - a.reviews;
        case "rating":
        default:
          return b.rating - a.rating;
      }
    });

    return list;
  }, [query, activeCategory, filters]);

  return (
    <SafeAreaView
          style={[styles.root, { backgroundColor: colors.background }]}
          edges={["top"]}
        >  <TopBar
        location="Lagos, NG"
        notificationCount={3}
        initials="JD"
        onAvatarPress={() => router.push("/(tabs)/profile")}
      />

      {/* ── Search bar + filter button ─────────────────────────────── */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={GREY} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search fixers, services..."
            placeholderTextColor="#A0AEC0"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color="#A0AEC0" />
            </Pressable>
          )}
        </View>

        {/* Filter button */}
        <Pressable
          style={[
            styles.filterBtn,
            activeFilterCount > 0 && styles.filterBtnActive,
          ]}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeFilterCount > 0 ? WHITE : BLUE}
          />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* ── Category chips ─────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScrollOuter}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            style={[
              styles.categoryChip,
              activeCategory === cat.id && styles.categoryChipActive,
            ]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Ionicons
              name={cat.icon as any}
              size={14}
              color={activeCategory === cat.id ? WHITE : GREY}
            />
            <Text
              style={[
                styles.categoryChipText,
                activeCategory === cat.id && styles.categoryChipTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ── Results count ──────────────────────────────────────────── */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {results.length} fixer{results.length !== 1 ? "s" : ""} found
        </Text>
        {activeFilterCount > 0 && (
          <Pressable onPress={() => setFilters(DEFAULT_FILTERS)}>
            <Text style={styles.clearFilters}>Clear filters</Text>
          </Pressable>
        )}
      </View>

      {/* ── Fixer list ─────────────────────────────────────────────── */}
      {results.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={52} color="#CBD5E0" />
          <Text style={styles.emptyTitle}>No fixers found</Text>
          <Text style={styles.emptyDesc}>
            Try adjusting your search or filters
          </Text>
          <Pressable
            style={styles.emptyBtn}
            onPress={() => {
              setQuery("");
              setFilters(DEFAULT_FILTERS);
              setActiveCategory("all");
            }}
          >
            <Text style={styles.emptyBtnText}>Reset Search</Text>
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: LIGHT },

  // ── Search row ──
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: "#EAF0FB",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#DDE4F0",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: BLUE,
    fontWeight: "500",
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#DDE4F0",
  },
  filterBtnActive: {
    backgroundColor: BLUE,
    borderColor: BLUE,
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
    borderColor: WHITE,
  },
  filterBadgeText: { fontSize: 9, fontWeight: "900", color: BLUE },

  // ── Category chips ──
  categoryScrollOuter: {
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: "#EAF0FB",
    flexGrow: 0, // prevents it from expanding and eating layout space
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    alignItems: "center", // vertically center chips
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: LIGHT,
    borderWidth: 1,
    borderColor: "#DDE4F0",
  },
  categoryChipActive: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  categoryChipText: { fontSize: 12, fontWeight: "700", color: GREY },
  categoryChipTextActive: { color: WHITE },

  // ── Results header ──
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  resultsCount: { fontSize: 13, fontWeight: "700", color: GREY },
  clearFilters: { fontSize: 13, fontWeight: "700", color: GOLD },

  // ── List ──
  list: { paddingHorizontal: 20, paddingBottom: 24, gap: 14 },

  // ── Fixer card ──
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    shadowColor: BLUE,
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#EAF0FB",
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
    borderColor: "#EAF0FB",
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
    borderColor: WHITE,
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
    color: BLUE,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  fixerTrade: {
    fontSize: 13,
    color: GREY,
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
    backgroundColor: LIGHT,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statText: { fontSize: 12, fontWeight: "600", color: GREY },

  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EAF0FB",
  },
  priceLabel: { fontSize: 10, color: GREY, fontWeight: "500", marginBottom: 2 },
  price: { fontSize: 16, fontWeight: "900", color: BLUE },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: BLUE,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  viewBtnText: { fontSize: 13, fontWeight: "800", color: WHITE },

  // ── Empty state ──
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: BLUE },
  emptyDesc: { fontSize: 14, color: GREY, textAlign: "center", lineHeight: 21 },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: GOLD,
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  emptyBtnText: { fontSize: 14, fontWeight: "800", color: BLUE },

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
    backgroundColor: WHITE,
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
    backgroundColor: "#DDE4F0",
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: BLUE,
    marginBottom: 20,
    letterSpacing: -0.4,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: GREY,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  filterValue: { color: BLUE, fontWeight: "800", textTransform: "none" },

  sortRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  sortChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: LIGHT,
    borderWidth: 1,
    borderColor: "#DDE4F0",
  },
  sortChipActive: { backgroundColor: BLUE, borderColor: BLUE },
  sortChipText: { fontSize: 13, fontWeight: "700", color: GREY },
  sortChipTextActive: { color: WHITE },

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
    backgroundColor: LIGHT,
    borderWidth: 1,
    borderColor: "#DDE4F0",
  },
  sliderChipActive: { backgroundColor: GOLD, borderColor: GOLD },
  sliderChipText: { fontSize: 13, fontWeight: "700", color: GREY },
  sliderChipTextActive: { color: BLUE },

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
    borderColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  resetBtnText: { fontSize: 15, fontWeight: "700", color: BLUE },
  applyBtn: {
    flex: 2,
    height: 50,
    borderRadius: 14,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GOLD,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  applyBtnText: { fontSize: 15, fontWeight: "800", color: BLUE },
});
