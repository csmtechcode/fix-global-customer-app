import React from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BLUE = "#1A3C6E";
const GOLD = "#FFC300";
const WHITE = "#FFFFFF";
const LIGHT = "#F4F7FD";
const GREY = "#64748B";
const BORDER = "#EAF0FB";

const FAVORITES = [
  {
    id: "1",
    title: "Trusted Plumber — Chukwudi",
    subtitle: "Plumbing, repairs, faucet installation",
    rating: "4.9",
  },
  {
    id: "2",
    title: "Electrical Expert — Amara",
    subtitle: "Wiring, lights, fan installation",
    rating: "4.8",
  },
  {
    id: "3",
    title: "Cleaning Pro — Fatima",
    subtitle: "Deep cleaning, disinfection, laundry",
    rating: "4.7",
  },
];

export default function FavoritesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={BLUE} />
        </Pressable>
        <Text style={styles.title}>Favorites</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.subtitle}>
          Your favorite pros and services — saved for faster booking.
        </Text>

        <FlatList
          data={FAVORITES}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 14 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{item.title.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color={GOLD} />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>

              <Pressable
                style={styles.bookBtn}
                onPress={() => router.push("/(tabs)/bookings")}
              >
                <Text style={styles.bookBtnText}>Book Again</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={52} color={BLUE} />
              <Text style={styles.emptyTitle}>No favorites yet</Text>
              <Text style={styles.emptyText}>
                Save trusted pros and services here for faster access.
              </Text>
            </View>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFD" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 18, fontWeight: "800", color: BLUE },
  headerSpacer: { width: 40 },
  content: { padding: 20, paddingBottom: 40 },
  subtitle: {
    fontSize: 14,
    color: GREY,
    marginBottom: 18,
    lineHeight: 20,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 18,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "800", color: BLUE },
  cardTitle: { fontSize: 15, fontWeight: "800", color: BLUE },
  cardSubtitle: { fontSize: 13, color: GREY, marginTop: 4 },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: { color: BLUE, fontWeight: "800" },
  bookBtn: {
    marginTop: 10,
    backgroundColor: BLUE,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  bookBtnText: { color: WHITE, fontWeight: "800" },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    padding: 24,
    borderRadius: 18,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: BLUE, marginTop: 14 },
  emptyText: { fontSize: 14, color: GREY, textAlign: "center", marginTop: 8, lineHeight: 20 },
});