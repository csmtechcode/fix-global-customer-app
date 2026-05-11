// app/(tabs)/payment-methods.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import TopBar from "../../src/components/layout/TopBar";
import Navbar from "@/src/components/layout/Navbar";

const BLUE = "#1A3C6E";
const GOLD = "#FFC300";
const WHITE = "#FFFFFF";
const GREY = "#64748B";

interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "ussd";
  label: string;
  detail: string;
  isDefault: boolean;
  brand?: "visa" | "mastercard" | "verve";
  expiryOrAccount?: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    brand: "visa",
    label: "Visa Debit",
    detail: "**** **** **** 4242",
    expiryOrAccount: "Expires 08/27",
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    brand: "mastercard",
    label: "Mastercard",
    detail: "**** **** **** 5580",
    expiryOrAccount: "Expires 03/26",
    isDefault: false,
  },
  {
    id: "3",
    type: "bank",
    label: "GTBank",
    detail: "0123456789",
    expiryOrAccount: "Guaranty Trust Bank",
    isDefault: false,
  },
  {
    id: "4",
    type: "ussd",
    label: "USSD Payment",
    detail: "*737#",
    expiryOrAccount: "GTBank USSD",
    isDefault: false,
  },
];

const BrandLogo = ({ brand }: { brand?: "visa" | "mastercard" | "verve" }) => {
  if (brand === "visa") {
    return (
      <Text style={{ color: WHITE, fontWeight: "900", fontSize: 15, letterSpacing: 1 }}>
        VISA
      </Text>
    );
  }
  if (brand === "mastercard") {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: "#EB001B", opacity: 0.9 }} />
        <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: "#F79E1B", marginLeft: -8, opacity: 0.9 }} />
      </View>
    );
  }
  return null;
};

const cardGradients: Record<string, string[]> = {
  visa: [BLUE, "#2657A8"],
  mastercard: ["#1F2937", "#374151"],
  verve: ["#065F46", "#059669"],
  bank: ["#3730A3", "#4F46E5"],
  ussd: ["#92400E", "#B45309"],
};

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [methods, setMethods] = useState<PaymentMethod[]>(PAYMENT_METHODS);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"card" | "bank" | "ussd">("card");

  const handleSetDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    );
  };

  const handleRemove = (id: string) => {
    Alert.alert(
      "Remove Payment Method",
      "Are you sure you want to remove this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => setMethods((prev) => prev.filter((m) => m.id !== id)),
        },
      ]
    );
  };

  const getIconName = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "card": return "card";
      case "bank": return "business";
      case "ussd": return "keypad";
    }
  };

  const getGradientKey = (m: PaymentMethod) => {
    if (m.type === "card") return m.brand ?? "visa";
    return m.type;
  };

  const defaultMethod = methods.find((m) => m.isDefault);

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <TopBar
        location="Lagos, NG"
        notificationCount={2}
        initials="JD"
        onNotificationPress={() => console.log("Notifications")}
        onLocationPress={() => console.log("Change location")}
        onAvatarPress={() => router.push("/(tabs)/profile")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header Card — mirrors balanceCard */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerLabel}>Default Payment Method</Text>
              <Text style={styles.headerTitle}>
                {defaultMethod ? defaultMethod.label : "None set"}
              </Text>
              {defaultMethod && (
                <Text style={styles.headerSub}>{defaultMethod.detail}</Text>
              )}
            </View>
            <View style={styles.headerIconBox}>
              <Ionicons name="shield-checkmark" size={28} color={GOLD} />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Saved Methods</Text>
              <Text style={styles.statValue}>{methods.length}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Cards</Text>
              <Text style={styles.statValue}>
                {methods.filter((m) => m.type === "card").length}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Bank Accounts</Text>
              <Text style={styles.statValue}>
                {methods.filter((m) => m.type === "bank").length}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions — mirrors wallet actionsContainer */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={styles.actionBtn}
            onPress={() => { setSelectedTab("card"); setAddModalVisible(true); }}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="card" size={26} color={BLUE} />
            </View>
            <Text style={styles.actionText}>Add Card</Text>
          </Pressable>

          <Pressable
            style={styles.actionBtn}
            onPress={() => { setSelectedTab("bank"); setAddModalVisible(true); }}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="business" size={26} color={BLUE} />
            </View>
            <Text style={styles.actionText}>Add Bank</Text>
          </Pressable>

          <Pressable
            style={styles.actionBtn}
            onPress={() => { setSelectedTab("ussd"); setAddModalVisible(true); }}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="keypad" size={26} color={BLUE} />
            </View>
            <Text style={styles.actionText}>USSD</Text>
          </Pressable>
        </View>

        {/* Secure Badge — mirrors repairCreditCard */}
        <View style={styles.secureBadgeCard}>
          <View style={styles.secureBadgeContent}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons name="lock-closed" size={22} color={BLUE} />
              <View>
                <Text style={styles.secureBadgeTitle}>Bank-level Security</Text>
                <Text style={styles.secureBadgeSub}>256-bit SSL encryption</Text>
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Methods</Text>
            <Pressable onPress={() => setAddModalVisible(true)}>
              <Text style={styles.seeAll}>+ Add new →</Text>
            </Pressable>
          </View>

          <FlatList
            data={methods}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => {
              const gradKey = getGradientKey(item);
              const colors = cardGradients[gradKey] ?? [BLUE, "#2657A8"];
              return (
                <View style={styles.methodCard}>
                  {/* Coloured left strip */}
                  <View
                    style={[
                      styles.methodStrip,
                      { backgroundColor: colors[0] },
                    ]}
                  >
                    {item.type === "card" ? (
                      <BrandLogo brand={item.brand} />
                    ) : (
                      <Ionicons
                        name={getIconName(item.type)}
                        size={20}
                        color={WHITE}
                      />
                    )}
                  </View>

                  <View style={styles.methodInfo}>
                    <View style={styles.methodTop}>
                      <Text style={styles.methodLabel}>{item.label}</Text>
                      {item.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.methodDetail}>{item.detail}</Text>
                    {item.expiryOrAccount && (
                      <Text style={styles.methodSub}>{item.expiryOrAccount}</Text>
                    )}
                  </View>

                  <View style={styles.methodActions}>
                    {!item.isDefault && (
                      <Pressable
                        onPress={() => handleSetDefault(item.id)}
                        style={styles.methodActionBtn}
                        hitSlop={8}
                      >
                        <Ionicons name="star-outline" size={18} color={GOLD} />
                      </Pressable>
                    )}
                    {item.isDefault && (
                      <Ionicons name="star" size={18} color={GOLD} />
                    )}
                    <Pressable
                      onPress={() => handleRemove(item.id)}
                      style={[styles.methodActionBtn, { marginTop: 8 }]}
                      hitSlop={8}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </Pressable>
                  </View>
                </View>
              );
            }}
          />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Add Method Modal */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* Handle */}
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Payment Method</Text>
              <Pressable onPress={() => setAddModalVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={24} color={BLUE} />
              </Pressable>
            </View>

            {/* Tab switcher */}
            <View style={styles.tabRow}>
              {(["card", "bank", "ussd"] as const).map((tab) => (
                <Pressable
                  key={tab}
                  style={[
                    styles.tab,
                    selectedTab === tab && styles.tabActive,
                  ]}
                  onPress={() => setSelectedTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === tab && styles.tabTextActive,
                    ]}
                  >
                    {tab === "card" ? "Card" : tab === "bank" ? "Bank" : "USSD"}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Form Fields */}
            {selectedTab === "card" && (
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#94A3B8"
                />
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  maxLength={19}
                />
                <View style={styles.inputRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Expiry</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      placeholderTextColor="#94A3B8"
                      keyboardType="number-pad"
                      maxLength={5}
                    />
                  </View>
                  <View style={{ width: 16 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>CVV</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="•••"
                      placeholderTextColor="#94A3B8"
                      keyboardType="number-pad"
                      secureTextEntry
                      maxLength={3}
                    />
                  </View>
                </View>
              </View>
            )}

            {selectedTab === "bank" && (
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Bank Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. GTBank"
                  placeholderTextColor="#94A3B8"
                />
                <Text style={styles.inputLabel}>Account Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10-digit account number"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  maxLength={10}
                />
                <Text style={styles.inputLabel}>Account Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            )}

            {selectedTab === "ussd" && (
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Select Bank</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. GTBank (*737#)"
                  placeholderTextColor="#94A3B8"
                />
                <Text style={styles.ussdNote}>
                  Dial the USSD code on your phone to authorize payments quickly
                  without internet.
                </Text>
              </View>
            )}

            <Pressable
              style={styles.saveBtn}
              onPress={() => {
                Alert.alert("Success", "Payment method added!");
                setAddModalVisible(false);
              }}
            >
              <Text style={styles.saveBtnText}>Save Method</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFD" },
  scroll: { paddingBottom: 24 },

  // Header Card — mirrors balanceCard
  headerCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: BLUE,
    borderRadius: 24,
    padding: 24,
    shadowColor: BLUE,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLabel: {
    color: "#ffffff90",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: WHITE,
    letterSpacing: -0.5,
  },
  headerSub: {
    color: "#ffffff90",
    fontSize: 13,
    marginTop: 4,
    fontWeight: "500",
  },
  headerIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#ffffff15",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  stat: {},
  statLabel: { fontSize: 12, color: "#ffffff90", fontWeight: "500" },
  statValue: { fontSize: 15, fontWeight: "700", color: WHITE, marginTop: 2 },

  // Actions — mirrors wallet
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 24,
  },
  actionBtn: {
    backgroundColor: WHITE,
    alignItems: "center",
    paddingVertical: 14,
    width: "30%",
    borderRadius: 16,
    shadowColor: BLUE,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF4FD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  actionText: { fontSize: 13, fontWeight: "700", color: BLUE },

  // Secure badge — mirrors repairCreditCard
  secureBadgeCard: {
    marginHorizontal: 20,
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EAF0FB",
  },
  secureBadgeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secureBadgeTitle: { fontSize: 15, fontWeight: "800", color: BLUE },
  secureBadgeSub: { fontSize: 12, color: GREY, marginTop: 2 },
  verifiedBadge: {
    backgroundColor: GOLD,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  verifiedText: { fontWeight: "800", color: BLUE, fontSize: 13 },

  // Section
  section: { marginTop: 28, paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: BLUE },
  seeAll: { fontSize: 13, fontWeight: "700", color: GOLD },

  // Method card row
  methodCard: {
    flexDirection: "row",
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAF0FB",
    overflow: "hidden",
  },
  methodStrip: {
    width: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
  },
  methodInfo: { flex: 1, padding: 14 },
  methodTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  methodLabel: { fontSize: 14, fontWeight: "700", color: BLUE },
  defaultBadge: {
    backgroundColor: "#EEF4FD",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  defaultBadgeText: { fontSize: 11, fontWeight: "700", color: BLUE },
  methodDetail: { fontSize: 13, color: GREY, marginTop: 3, fontWeight: "500" },
  methodSub: { fontSize: 11, color: "#94A3B8", marginTop: 2 },
  methodActions: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  methodActionBtn: { padding: 4 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000060",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: BLUE },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 10,
  },
  tabActive: { backgroundColor: BLUE },
  tabText: { fontSize: 13, fontWeight: "700", color: GREY },
  tabTextActive: { color: WHITE },

  formGroup: { gap: 4 },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: BLUE,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#F8FAFD",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: BLUE,
    fontWeight: "500",
  },
  inputRow: { flexDirection: "row" },
  ussdNote: {
    fontSize: 13,
    color: GREY,
    marginTop: 12,
    lineHeight: 20,
    backgroundColor: "#F8FAFD",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  saveBtn: {
    backgroundColor: BLUE,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  saveBtnText: { color: WHITE, fontWeight: "800", fontSize: 15 },
});     