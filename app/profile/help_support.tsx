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
import TopBar from "../../src/components/layout/TopBar";
import Navbar from "../../src/components/layout/Navbar";
import useTheme from "../../src/context/ThemeContext";
const BLUE = "#1A3C6E";
const WHITE = "#FFFFFF";
const LIGHT = "#F4F7FD";
const GREY = "#64748B";
const BORDER = "#EAF0FB";

const FAQ_ITEMS = [
  {
    id: "1",
    question: "How do I reschedule a booking?",
    answer:
      "Open the booking details screen, tap the reschedule button, and choose a new date and time. We'll confirm availability right away.",
  },
  {
    id: "2",
    question: "Can I change my payment method?",
    answer:
      "Yes. Go to Payment Methods in your profile, choose a saved method, or add a new card/bank account before confirming your next service.",
  },
  {
    id: "3",
    question: "What is your cancellation policy?",
    answer:
      "You can cancel up to 4 hours before the scheduled service. Some bookings may incur a small cancellation fee depending on the provider.",
  },
  {
    id: "4",
    question: "How do I update my home or work address?",
    answer:
      "Use Saved Addresses to add or edit your locations. Mark one address as Default so pros can find you faster.",
  },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>("1");
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={["top"]}>
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
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Need help? Find quick answers here or start a chat with our support team.</Text>

        <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Help & Support</Text>

        {FAQ_ITEMS.map((item) => {
          const expanded = item.id === activeId;
          return (
            <View key={item.id} style={styles.card}>
              <Pressable
                style={styles.questionRow}
                onPress={() =>
                  setActiveId((current) =>
                    current === item.id ? null : item.id,
                  )
                }
              >
                <View style={styles.questionTextBlock}>
                  <Text style={[styles.question, { color: colors.textPrimary }]}>{item.question}</Text>
                </View>
                <Ionicons
                  name={expanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.icon}
                />
              </Pressable>
              {expanded ? (
                <Text style={[styles.answer, { color: colors.textSecondary }]}>{item.answer}</Text>
              ) : null}
            </View>
          );
        })}

        <Pressable
          style={[styles.chatButton, { backgroundColor: colors.accent }]}
          onPress={() => router.push("/profile/live_chat")}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.panel} />
          <Text style={[styles.chatButtonText, { color: colors.panel }]}>Chat with Us</Text>
        </Pressable>
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
    marginBottom: 14,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  questionTextBlock: { flex: 1, marginRight: 12 },
  question: { fontSize: 15, fontWeight: "800", color: BLUE },
  answer: {
    marginTop: 14,
    fontSize: 14,
    color: GREY,
    lineHeight: 20,
  },
  chatButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: BLUE,
    paddingVertical: 16,
    borderRadius: 16,
  },
  chatButtonText: { color: WHITE, fontSize: 15, fontWeight: "800" },
});