import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import TopBar from "../../src/components/layout/TopBar";
import Navbar from "../../src/components/layout/Navbar";
import useTheme from "../../src/context/ThemeContext";

const BLUE = "#1A3C6E";
const WHITE = "#FFFFFF";
const LIGHT = "#F4F7FD";
const GREY = "#64748B";
const BORDER = "#EAF0FB";

const TERM_TEXT = `By using FixGlobal, you agree to our terms of service. We reserve the right to update the app, services, and pricing at any time. You must provide accurate contact and payment information to complete bookings. All bookings are subject to availability and provider acceptance. Cancellation fees may apply depending on the time and type of service.`;
const PRIVACY_TEXT = `We collect only the information needed to provide services, process payments, and communicate about your bookings. Your data is stored securely and is not shared with third parties except to complete service requests, process payments, or comply with legal requirements. You can request account deletion or data access through customer support.`;

export default function LegalScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={["top"]}>
      <TopBar
        location="Lagos, NG"
        initials="JD"
        notificationCount={3}
        onNotificationPress={() => router.push("/(tabs)/notifications")}
        onLocationPress={() => router.push("/(tabs)/settings")}
        onAvatarPress={() => router.push("/(tabs)/profile")}
      />

      <View style={styles.tabsRow}>
        <Pressable
          style={[
            styles.tab,
            activeTab === "terms" && styles.tabActive,
          ]}
          onPress={() => setActiveTab("terms")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "terms" && styles.tabTextActive,
            ]}
          >
            Terms
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === "privacy" && styles.tabActive,
          ]}
          onPress={() => setActiveTab("privacy")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "privacy" && styles.tabTextActive,
            ]}
          >
            Privacy
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {activeTab === "terms" ? "Terms of Service" : "Privacy Policy"}
        </Text>
        <Text style={[styles.bodyText, { color: colors.textSecondary }]}> {activeTab === "terms" ? TERM_TEXT : PRIVACY_TEXT}</Text>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Next steps</Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>This is a demo version. Real legal text and full integration will be added during the next development phase.</Text>
        </View>
      </ScrollView>
      <Navbar />
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
  tabsRow: {
    margin: 20,
    flexDirection: "row",
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: LIGHT,
    alignItems: "center",
  },
  tabActive: { backgroundColor: BLUE },
  tabText: { fontSize: 14, fontWeight: "700", color: BLUE },
  tabTextActive: { color: WHITE },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: BLUE,
    marginBottom: 14,
  },
  bodyText: {
    fontSize: 14,
    color: GREY,
    lineHeight: 22,
    marginBottom: 22,
  },
  sectionCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardTitle: { fontSize: 15, fontWeight: "800", color: BLUE, marginBottom: 8 },
  cardText: { fontSize: 14, color: GREY, lineHeight: 20 },
});