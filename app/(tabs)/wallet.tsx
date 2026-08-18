// app/(tabs)/wallet.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import TopBar from "../../src/components/layout/TopBar";
import Navbar from "@/src/components/layout/Navbar";
import useTheme from "../../src/context/ThemeContext";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  service?: string;
  date: string;
  status: string;
}

const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "debit",
    amount: 4500,
    description: "iPhone 13 Screen Replacement",
    service: "Plumbing",
    date: "Today",
    status: "Completed",
  },
  {
    id: "2",
    type: "credit",
    amount: 12000,
    description: "Refund - Cancelled Booking",
    date: "Yesterday",
    status: "Completed",
  },
  {
    id: "3",
    type: "debit",
    amount: 8500,
    description: "Laptop Battery Replacement",
    date: "Apr 30",
    status: "Completed",
  },
];

export default function WalletScreen() {

  const router = useRouter();
  const { colors } = useTheme();
  const [balance] = useState(12450);
  const [refreshing, setRefreshing] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true); // Eye toggle

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scroll}
      >
        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: colors.cardAlt, shadowColor: colors.border }]}>
          <View style={styles.balanceHeader}>
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Available Balance</Text>
            <Pressable onPress={toggleBalanceVisibility} hitSlop={10}>
              <Ionicons
                name={isBalanceVisible ? "eye-outline" : "eye-off-outline"}
                size={24}
                color={colors.muted}
              />
            </Pressable>
          </View>

          <Text style={[styles.balanceAmount, { color: colors.textPrimary }]}>
            {isBalanceVisible ? formatNaira(balance) : "••••••"}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Spent</Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>₦67,800</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Refunded</Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>₦12,000</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.card, shadowColor: colors.border }]}
            onPress={() => alert("Deposit Modal Coming Soon")}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.surface }]}>
              <Ionicons name="add-circle" size={28} color={colors.accent} />
            </View>
            <Text style={[styles.actionText, { color: colors.textPrimary }]}>Deposit</Text>
          </Pressable>

          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.card, shadowColor: colors.border }]}
            onPress={() => alert("Withdraw Modal Coming Soon")}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.surface }]}>
              <Ionicons name="cash-outline" size={28} color={colors.accent} />
            </View>
            <Text style={[styles.actionText, { color: colors.textPrimary }]}>Withdraw</Text>
          </Pressable>

          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.card, shadowColor: colors.border }]}
            onPress={() => alert("Send Money")}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.surface }]}>
              <Ionicons name="send" size={28} color={colors.accent} />
            </View>
            <Text style={[styles.actionText, { color: colors.textPrimary }]}>Send</Text>
          </Pressable>
        </View>

        {/* Repair Credit */}
        <View style={[styles.repairCreditCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.repairCreditContent}>
            <View>
              <Text style={[styles.repairCreditTitle, { color: colors.textPrimary }]}>Repair Credit</Text>
              <Text style={[styles.repairCreditSubtitle, { color: colors.textSecondary }]}>₦2,000 available</Text>
            </View>
            <Pressable style={[styles.useNowBtn, { backgroundColor: colors.accent }]}>
              <Text style={[styles.useNowText, { color: colors.card }]}>Use Now</Text>
            </Pressable>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Transactions</Text>
            <Pressable onPress={() => router.push("/(tabs)/search")}
            >
              <Text style={[styles.seeAll, { color: colors.accent }]}>See all →</Text>
            </Pressable>
          </View>

          <FlatList
            data={TRANSACTIONS}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <View style={[styles.transactionRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.transactionIconContainer, { backgroundColor: colors.surface }]}>
                  <Ionicons
                    name={
                      item.type === "credit"
                        ? "arrow-down-circle"
                        : "arrow-up-circle"
                    }
                    size={26}
                    color={item.type === "credit" ? colors.success : colors.danger}
                  />
                </View>

                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionDesc, { color: colors.textPrimary }]}>{item.description}</Text>
                  {item.service && (
                    <Text style={[styles.transactionService, { color: colors.textSecondary }]}>
                      {item.service}
                    </Text>
                  )}
                  <Text style={[styles.transactionDate, { color: colors.muted }]}>{item.date}</Text>
                </View>

                <View style={styles.transactionAmountContainer}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: item.type === "credit" ? colors.success : colors.danger },
                    ]}
                  >
                    {item.type === "credit" ? "+" : "-"}
                    {formatNaira(item.amount)}
                  </Text>
                  <Text style={[styles.transactionStatus, { color: colors.success }]}>{item.status}</Text>
                </View>
              </View>
            )}
          />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
}

// Styles (same as your current one - no major changes needed)
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 24 },

  balanceCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "900",
    marginVertical: 12,
    letterSpacing: -1,
    minHeight: 45, // Prevents layout shift when toggling
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  stat: {},
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 24,
  },
  actionBtn: {
    alignItems: "center",
    paddingVertical: 14,
    width: "30%",
    borderRadius: 16,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700",
  },

  repairCreditCard: {
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
  },
  repairCreditContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  repairCreditTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  repairCreditSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  useNowBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  useNowText: {
    fontWeight: "800",
    fontSize: 13,
  },

  section: { marginTop: 28, paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "700",
  },

  transactionRow: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  transactionIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionInfo: { flex: 1, marginLeft: 14 },
  transactionDesc: {
    fontSize: 14,
    fontWeight: "700",
  },
  transactionService: {
    fontSize: 12,
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    marginTop: 4,
  },
  transactionAmountContainer: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: "800",
  },
  transactionStatus: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
});
