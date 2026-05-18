import React, { useState } from "react";
import {
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

import Navbar from "@/src/components/layout/Navbar";
import TopBar from "../../src/components/layout/TopBar";

const BLUE = "#1A3C6E";
const GOLD = "#FFC300";
const WHITE = "#FFFFFF";
const LIGHT = "#F4F7FD";
const GREY = "#64748B";
const BORDER = "#EAF0FB";

export default function SettingsScreen() {
  const router = useRouter();
  const [loginSave, setLoginSave] = useState(true);
  const [fingerprint, setFingerprint] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBooking, setAutoBooking] = useState(true);

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <TopBar
        location="Ibadan, NG"
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
        <Text style={styles.heading}>App Settings</Text>
        <Text style={styles.subtitle}>
          Core settings for user experience, security, and booking preferences.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <SettingRow
            label="Keep me logged in"
            value={loginSave}
            onValueChange={setLoginSave}
          />
          <SettingRow
            label="Biometric access"
            value={fingerprint}
            onValueChange={setFingerprint}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingRow
            label="Dark mode"
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <SettingRow
            label="Auto booking reminders"
            value={autoBooking}
            onValueChange={setAutoBooking}
          />
          <TouchableAction
            title="Manage languages"
            subtitle="English"
            onPress={() => console.log("Language settings")}
          />
          <TouchableAction
            title="Default payment method"
            subtitle="Visa ending 4242"
            onPress={() => router.push("/profile/payment_methods")}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About app</Text>
          <TouchableAction
            title="App version"
            subtitle="1.0.0"
            onPress={() => console.log("App info")}
          />
          <TouchableAction
            title="Demo note"
            subtitle="Integration still pending"
            onPress={() => console.log("Demo note")}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
}

function SettingRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.rowLabel}>{label}</Text>
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

function TouchableAction({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.touchRow} onPress={onPress}>
      <View>
        <Text style={styles.rowLabel}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={GREY} />
    </Pressable>
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
    marginBottom: 18,
    borderWidth: 1,
    borderColor: BORDER,
  },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: BLUE, marginBottom: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  rowLabel: { fontSize: 15, fontWeight: "700", color: BLUE },
  rowSubtitle: { fontSize: 13, color: GREY, marginTop: 4, maxWidth: 240 },
  touchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
});