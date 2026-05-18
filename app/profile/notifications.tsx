import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import TopBar from "../../src/components/layout/TopBar";

const BLUE = "#1A3C6E";
const GOLD = "#FFC300";
const WHITE = "#FFFFFF";
const LIGHT = "#F4F7FD";
const GREY = "#64748B";
const BORDER = "#EAF0FB";

export default function ProfileNotificationsScreen() {
  const router = useRouter();
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [offers, setOffers] = useState(true);
  const [payments, setPayments] = useState(true);
  const [serviceAlerts, setServiceAlerts] = useState(true);
  const [chatMessages, setChatMessages] = useState(true);

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <TopBar
        notificationCount={3}
        initials="OA"
        onNotificationPress={() => router.push("/profile/notifications")}
        onLocationPress={() => router.push("/(tabs)/settings")}
        onAvatarPress={() => router.push("/(tabs)/profile")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.heading}>Notifications</Text>
        <Text style={styles.subtitle}>
          Control which alerts you receive from FixGlobal.
        </Text>

        <View style={styles.section}>
          <NotificationRow
            label="Booking updates"
            description="Service confirmations, reminders, and schedule changes"
            value={bookingUpdates}
            onValueChange={setBookingUpdates}
          />
          <NotificationRow
            label="Offers & promos"
            description="Discounts, special deals, and seasonal savings"
            value={offers}
            onValueChange={setOffers}
          />
          <NotificationRow
            label="Payment alerts"
            description="Receipts, failed payments, and billing reminders"
            value={payments}
            onValueChange={setPayments}
          />
          <NotificationRow
            label="Service reminders"
            description="Pre-service notifications and arrival updates"
            value={serviceAlerts}
            onValueChange={setServiceAlerts}
          />
          <NotificationRow
            label="Chat notifications"
            description="Live support replies and messages from service pros"
            value={chatMessages}
            onValueChange={setChatMessages}
          />
        </View>

        <Pressable
          style={styles.saveButton}
          onPress={() => Alert.alert("Saved", "Notification preferences updated")}
        >
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationRow({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowSubtitle}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: LIGHT, true: GOLD }}
        thumbColor={value ? BLUE : WHITE}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFD" },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 36 },
  heading: { fontSize: 22, fontWeight: "900", color: BLUE, marginBottom: 8 },
  subtitle: { fontSize: 14, color: GREY, lineHeight: 20, marginBottom: 24 },
  section: {
    backgroundColor: WHITE,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  rowText: { flex: 1, marginRight: 14 },
  rowLabel: { fontSize: 15, fontWeight: "800", color: BLUE, marginBottom: 4 },
  rowSubtitle: { fontSize: 13, color: GREY, lineHeight: 20 },
  saveButton: {
    backgroundColor: BLUE,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: { color: WHITE, fontWeight: "800", fontSize: 15 },
});
