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

import Navbar from "@/src/components/layout/Navbar";
import TopBar from "../../src/components/layout/TopBar";

import useTheme from "../../src/context/ThemeContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { themeMode, setThemeMode, language, setLanguage, colors, languages } = useTheme();
  const [loginSave, setLoginSave] = useState(true);
  const [fingerprint, setFingerprint] = useState(false);
  const [autoBooking, setAutoBooking] = useState(true);
  const darkMode = themeMode === "dark";

  const handleLanguagePress = () => {
    Alert.alert(
      "Choose language",
      undefined,
      languages.map((lang) => ({
        text: lang,
        onPress: () => setLanguage(lang),
      })),
    );
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={["top"]}>
      {/* Top navigation bar */}
      <TopBar
        onNotificationPress={() => router.push("/(tabs)/notifications")}
        onSettingsPress={() => router.push("/(tabs)/settings")}
        onLocationPress={() => router.push("/(tabs)/settings")}
        onAvatarPress={() => router.push("/(tabs)/profile")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.heading, { color: colors.textPrimary }]}>App Settings</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Core settings for user experience, security, and booking preferences.</Text>

        <View style={[styles.section, { backgroundColor: colors.panel, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Security</Text>
          <SettingRow
            label="Keep me logged in"
            value={loginSave}
            onValueChange={setLoginSave}
            colors={colors}
          />
          <SettingRow
            label="Biometric access"
            value={fingerprint}
            onValueChange={setFingerprint}
            colors={colors}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.panel, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Preferences</Text>
          <SettingRow
            label="Dark mode"
            value={darkMode}
            onValueChange={(value) => setThemeMode(value ? "dark" : "light")}
            colors={colors}
          />
          <SettingRow
            label="Auto booking reminders"
            value={autoBooking}
            onValueChange={setAutoBooking}
            colors={colors}
          />
          <TouchableAction
            title="Language"
            subtitle={language}
            onPress={handleLanguagePress}
            colors={colors}
          />
          <TouchableAction
            title="Default payment method"
            subtitle="Visa ending 4242"
            onPress={() => router.push("/profile/payment_methods")}
            colors={colors}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.panel, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>About app</Text>
          <TouchableAction
            title="App version"
            subtitle="1.0.0"
            onPress={() => Alert.alert("App version", "1.0.0")}
            colors={colors}
          />
          <TouchableAction
            title="Demo note"
            subtitle="Integration still pending"
            onPress={() => Alert.alert("Info", "Theme and language are now managed globally.")}
            colors={colors}
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
  colors,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View>
        <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{label}</Text>
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

function TouchableAction({
  title,
  subtitle,
  onPress,
  colors,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <Pressable style={styles.touchRow} onPress={onPress}>
      <View>
        <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </Pressable>
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
    marginBottom: 18,
    borderWidth: 1,
  },
  sectionTitle: { fontSize: 15, fontWeight: "800", marginBottom: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowLabel: { fontSize: 15, fontWeight: "700" },
  rowSubtitle: { fontSize: 13, marginTop: 4, maxWidth: 240 },
  touchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
});