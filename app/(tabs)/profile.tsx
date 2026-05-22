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
import useTheme from "../../src/context/ThemeContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
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
    avatar: "https://via.placeholder.com/150",
    rating: 4.8,
    bookings: 47,
    joined: "March 2024",
  };

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


      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={[styles.avatar, { borderColor: colors.panel }]} />
            <View style={[styles.editBadge, { backgroundColor: colors.accent }]}>
              <Ionicons name="pencil" size={16} color={colors.panel} />
            </View>
          </View>

          <Text style={[styles.name, { color: colors.textPrimary }]}>{user.name}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user.email}</Text>

          <Pressable
            style={[styles.editProfileBtn, { backgroundColor: colors.accent }]}
            onPress={() => alert("Edit Profile Modal Coming Soon")}
          >
            <Text style={[styles.editProfileText, { color: colors.panel }]}>Edit Profile</Text>
          </Pressable>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{user.bookings}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Bookings</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{user.rating}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Months</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Account</Text>
          <MenuItem icon="calendar-outline" title="My Bookings" onPress={() => router.push("/(tabs)/bookings")} colors={colors} />
          <MenuItem icon="location-outline" title="Saved Addresses" onPress={() => router.push("/profile/saved_addresses")} colors={colors} />
          <MenuItem icon="card-outline" title="Payment Methods" onPress={() => router.push("/profile/payment_methods")} colors={colors} />
          <MenuItem icon="heart-outline" title="Favorites" onPress={() => router.push("/profile/favorites")} colors={colors} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Support</Text>
          <MenuItem icon="help-circle-outline" title="Help & Support" onPress={() => router.push("/profile/help_support")} colors={colors} />
          <MenuItem icon="chatbubble-outline" title="Chat with Us" onPress={() => router.push("/profile/live_chat")} colors={colors} />
          <MenuItem icon="document-text-outline" title="Terms & Privacy" onPress={() => router.push("/profile/legal")} colors={colors} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Settings</Text>
          <MenuItem icon="settings-outline" title="App Settings" onPress={() => router.push("/(tabs)/settings")} showArrow colors={colors} />
          <MenuItem icon="notifications-outline" title="Notifications" onPress={() => router.push("/profile/notifications")} showArrow colors={colors} />
        </View>

        <Pressable
          style={[styles.logoutBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text style={[styles.logoutText, { color: colors.textPrimary }]}>Log Out</Text>
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
}

const MenuItem = ({
  icon,
  title,
  onPress,
  showArrow = true,
  colors,
}: {
  icon: string;
  title: string;
  onPress: () => void;
  showArrow?: boolean;
  colors: ReturnType<typeof useTheme>["colors"];
}) => (
  <Pressable style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onPress}>
    <View style={[styles.menuIconContainer, { backgroundColor: colors.surface }]}>
      <Ionicons name={icon as any} size={24} color={colors.icon} />
    </View>
    <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{title}</Text>
    {showArrow && <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
  </Pressable>
);

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 24 },
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
    borderColor: "#fff",
  },
  editBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
  },
  email: {
    fontSize: 15,
    marginTop: 2,
    marginBottom: 16,
  },
  editProfileBtn: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  editProfileText: {
    fontWeight: "700",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
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
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 40,
    alignSelf: "center",
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 12,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
