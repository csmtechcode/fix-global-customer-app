// src/features/home/ActiveBookingSection.tsx
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import useTheme from "../../context/ThemeContext";
import { getActiveBookings } from "../bookings/api";
import type { Booking } from "../bookings/api";
import ActiveBookingCard from "./ActiveBookingCard";

export default function ActiveBookingSection() {
    const { colors } = useTheme();
    const router = useRouter();
    const [booking, setBooking] = useState<Booking | null>(null);

    const load = useCallback(() => {
        getActiveBookings()
            .then((res) => setBooking(res.bookings?.[0] ?? null))
            .catch(() => setBooking(null));
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    if (!booking) return null;

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Active Booking</Text>
                <Pressable onPress={() => router.push("/(tabs)/bookings")}>
                    <Text style={[styles.seeAll, { color: colors.accent }]}>See all →</Text>
                </Pressable>
            </View>
            <ActiveBookingCard booking={booking} onPress={() => router.push("/(modals)/booking")} />
        </View>
    );
}

const styles = StyleSheet.create({
    section: { marginTop: 24 },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 14,
    },
    sectionTitle: { fontSize: 17, fontWeight: "800", letterSpacing: -0.3 },
    seeAll: { fontSize: 13, fontWeight: "700" },
});