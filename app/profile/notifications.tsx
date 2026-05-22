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
import { useRouter } from "expo-router";

import TopBar from "../../src/components/layout/TopBar";
import Navbar from "../../src/components/layout/Navbar";
import useTheme from "../../src/context/ThemeContext";

export default function ProfileNotificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [offers, setOffers] = useState(true);
  const [payments, setPayments] = useState(true);
  const [serviceAlerts, setServiceAlerts] = useState(true);
  const [chatMessages, setChatMessages] = useState(true);

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
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.heading, { color: colors.textPrimary }]}>Notifications</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Control which alerts you receive from FixGlobal.
        </Text>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <NotificationRow
            colors={colors}
            label="Booking updates"
            description="Service confirmations, reminders, and schedule changes"
            value={bookingUpdates}
            onValueChange={setBookingUpdates}
          />
          <NotificationRow
            colors={colors}
            label="Offers & promos"
            description="Discounts, special deals, and seasonal savings"
            value={offers}
            onValueChange={setOffers}
          />
          <NotificationRow
            colors={colors}
            label="Payment alerts"
            description="Receipts, failed payments, and billing reminders"
            value={payments}
            onValueChange={setPayments}
          />
          <NotificationRow
            colors={colors}
            label="Service reminders"
            description="Pre-service notifications and arrival updates"
            value={serviceAlerts}
            onValueChange={setServiceAlerts}
          />
          <NotificationRow
            colors={colors}
            label="Chat notifications"
            description="Live support replies and messages from service pros"
            value={chatMessages}
            onValueChange={setChatMessages}
          />
        </View>

        <Pressable
          style={[styles.saveButton, { backgroundColor: colors.icon }]}
          onPress={() => Alert.alert("Saved", "Notification preferences updated")}
        >
          <Text style={[styles.saveButtonText, { color: colors.card }]}>Save Preferences</Text>
        </Pressable>
      </ScrollView>

      {/* ── Navbar at bottom ───────────────────────────────────────── */}
      <Navbar active="profile" />
    </SafeAreaView>
  );
}

function NotificationRow({
  colors,
  label,
  description,
  value,
  onValueChange,
}: {
  colors: any;
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{label}</Text>
        <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.surface, true: colors.accent }}
        thumbColor={value ? colors.icon : colors.panel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 36 },
  heading: { fontSize: 22, fontWeight: "900", marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 24 },
  section: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  rowText: { flex: 1, marginRight: 14 },
  rowLabel: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  rowSubtitle: { fontSize: 13, lineHeight: 20 },
  saveButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: { fontWeight: "800", fontSize: 15 },
});
