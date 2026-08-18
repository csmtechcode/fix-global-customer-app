// src/features/home/RecentBookingsSection.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../../context/ThemeContext";
import { getCompletedBookings, Booking } from "../../bookings/api";

function formatStatus(status: string) {
    return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function RecentBookingsSection() {
    const { colors } = useTheme();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        getCompletedBookings()
            .then((res) => {
                if (mounted) setBookings(res.bookings ?? []);
            })
            .catch(() => {
                if (mounted) setBookings([]);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <View style={[styles.section, { paddingHorizontal: 20 }]}>
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Bookings</Text>
                <Pressable onPress={() => router.push("/(tabs)/bookings")}>
                    <Text style={[styles.seeAll, { color: colors.accent }]}>See all →</Text>
                </Pressable>
            </View>

            {loading ? (
                <ActivityIndicator color={colors.accent} style={{ marginVertical: 12 }} />
            ) : bookings.length === 0 ? (
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>No bookings yet</Text>
            ) : (
                <View style={{ gap: 10 }}>
                    {bookings.slice(0, 3).map((item) => (
                        <Pressable
                            key={item.id}
                            style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => router.push("/(tabs)/bookings")}
                        >
                            <View style={[styles.icon, { backgroundColor: colors.surface }]}>
                                <Ionicons name="checkmark-done-outline" size={20} color={colors.accent} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.trade, { color: colors.textPrimary }]}>{item.serviceName}</Text>
                                <Text style={[styles.sub, { color: colors.textSecondary }]}>
                                    {item.fixer ? `${item.fixer.firstName} ${item.fixer.lastName}` : "Fixer"}
                                    {item.scheduledFor ? ` · ${new Date(item.scheduledFor).toLocaleDateString()}` : ""}
                                </Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: colors.surface }]}>
                                <Text style={[styles.badgeText, { color: colors.accent }]}>{formatStatus(item.status)}</Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: { marginTop: 24 },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    sectionTitle: { fontSize: 17, fontWeight: "800", letterSpacing: -0.3 },
    seeAll: { fontSize: 13, fontWeight: "700" },
    row: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        padding: 14,
        gap: 12,
        borderWidth: 1,
    },
    icon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    trade: { fontSize: 14, fontWeight: "700", marginBottom: 3 },
    sub: { fontSize: 12, fontWeight: "500" },
    badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
    badgeText: { fontSize: 11, fontWeight: "700" },
});