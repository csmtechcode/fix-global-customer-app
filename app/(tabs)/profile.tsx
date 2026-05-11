// app/(tabs)/profile.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "@/src/components/layout/Navbar";
import TopBar from "../../src/components/layout/TopBar";

const BLUE = "#1A3C6E";
const GOLD = "#FFC300";
const WHITE = "#FFFFFF";
const LIGHT = "#F4F7FD";
const GREY = "#64748B";

export default function ProfileScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const user = {
    name: "Olateju Adebayo",
    email: "olateju@example.com",
    phone: "+234 803 123 4567",
    location: "Ibadan, Oyo State",
    avatar: "https://via.placeholder.com/150", // Replace with real image later
    rating: 4.8,
    bookings: 47,
    joined: "March 2024",
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <TopBar
        location="Ibadan, NG"
        notificationCount={1}
        initials="OA"
        onNotificationPress={() => console.log("Notifications")}
        onLocationPress={() => console.log("Change location")}
        onAvatarPress={() => router.push("/(tabs)/profile")} // already on profile
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scroll}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={16} color={WHITE} />
            </View>
          </View>

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          <Pressable
            style={styles.editProfileBtn}
            onPress={() => alert("Edit Profile Modal Coming Soon")}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.bookings}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Months</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <MenuItem
            icon="calendar-outline"
            title="My Bookings"
            onPress={() => router.push("/(tabs)/bookings")}
          />
          <MenuItem
            icon="location-outline"
            title="Saved Addresses"
            onPress={() => router.push("/profile/saved_addresses")}
          />
          <MenuItem
            icon="card-outline"
            title="Payment Methods"
            onPress={() => router.push("/profile/payment_methods")}
          />
          <MenuItem
            icon="heart-outline"
            title="Favorites"
            onPress={() => router.push("/profile/favorites")}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            onPress={() => router.push("/profile/help_support")}
          />
          <MenuItem
            icon="chatbubble-outline"
            title="Chat with Us"
            onPress={() => router.push("/profile/live_chat")}
          />
          <MenuItem
            icon="document-text-outline"
            title="Terms & Privacy"
            onPress={() => router.push("/profile/legal")}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <MenuItem
            icon="settings-outline"
            title="App Settings"
            onPress={() => router.push("/(tabs)/settings")}
            showArrow
          />
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            onPress={() => router.push("/(tabs)/notifications")}
            showArrow
          />
        </View>

        {/* Logout */}
        <Pressable
          style={styles.logoutBtn}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
}

// Reusable Menu Item
const MenuItem = ({
  icon,
  title,
  onPress,
  showArrow = true,
}: {
  icon: string;
  title: string;
  onPress: () => void;
  showArrow?: boolean;
}) => (
  <Pressable style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconContainer}>
      <Ionicons name={icon as any} size={24} color={BLUE} />
    </View>
    <Text style={styles.menuTitle}>{title}</Text>
    {showArrow && <Ionicons name="chevron-forward" size={20} color={GREY} />}
  </Pressable>
);

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFD" },
  scroll: { paddingBottom: 24 },

  // Header
  header: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: WHITE,
  },
  editBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: BLUE,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: WHITE,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: BLUE,
  },
  email: {
    fontSize: 15,
    color: GREY,
    marginTop: 2,
    marginBottom: 16,
  },
  editProfileBtn: {
    backgroundColor: BLUE,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  editProfileText: {
    color: WHITE,
    fontWeight: "700",
    fontSize: 14,
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: BLUE,
  },
  statLabel: {
    fontSize: 12,
    color: GREY,
    marginTop: 4,
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#EAF0FB",
    alignSelf: "center",
  },

  // Sections
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: BLUE,
    marginBottom: 12,
    paddingLeft: 4,
  },

  // Menu Item
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EAF0FB",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EEF4FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: BLUE,
  },

  // Logout
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
  },
});
