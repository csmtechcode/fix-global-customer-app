import React, { useState } from "react";
import {
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
const WHITE = "#FFFFFF";
const LIGHT = "#F4F7FD";
const GREY = "#64748B";
const BORDER = "#EAF0FB";

const TERM_TEXT = `By using FixGlobal, you agree to our terms of service. We reserve the right to update the app, services, and pricing at any time. You must provide accurate contact and payment information to complete bookings. All bookings are subject to availability and provider acceptance. Cancellation fees may apply depending on the time and type of service.`;
const PRIVACY_TEXT = `We collect only the information needed to provide services, process payments, and communicate about your bookings. Your data is stored securely and is not shared with third parties except to complete service requests, process payments, or comply with legal requirements. You can request account deletion or data access through customer support.`;

export default function LegalScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={BLUE} />
        </Pressable>
        <Text style={styles.title}>Terms & Privacy</Text>
        <View style={styles.headerSpacer} />
      </View>

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
        <Text style={styles.sectionTitle}>
          {activeTab === "terms" ? "Terms of Service" : "Privacy Policy"}
        </Text>
        <Text style={styles.bodyText}>
          {activeTab === "terms" ? TERM_TEXT : PRIVACY_TEXT}
        </Text>

        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Next steps</Text>
          <Text style={styles.cardText}>
            This is a demo version. Real legal text and full integration will be added during the next development phase.
          </Text>
        </View>
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