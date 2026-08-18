// src/features/home/ActiveBookingCard.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../context/ThemeContext";
import type { Booking } from "../bookings/api";

interface Props {
    booking: Booking;
    onPress: () => void;
}

const PROGRESS_BY_STATUS: Record<string, number> = {
    pending: 0.1,
    accepted: 0.3,
    on_the_way: 0.55,
    arrived: 0.75,
    in_progress: 0.9,
    completed: 1,
};

function formatStatus(status: string) {
    return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ActiveBookingCard({ booking, onPress }: Props) {
    const { colors } = useTheme();
    const progress = PROGRESS_BY_STATUS[booking.status] ?? 0.2;
    const fixerName = booking.fixer ? `${booking.fixer.firstName} ${booking.fixer.lastName}` : "Awaiting a pro";
    const when = booking.scheduledFor
        ? new Date(booking.scheduledFor).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
        : "";

    return (
        <Pressable style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onPress}>
            <View style={styles.content}>
                <View style={styles.left}>
                    <View style={[styles.iconBox, { backgroundColor: colors.cardAlt }]}>
                        <Ionicons name="construct-outline" size={20} color={colors.accent} />
                    </View>
                    <View>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>{booking.serviceName}</Text>
                        <Text style={[styles.pro, { color: colors.textSecondary }]}>
                            {fixerName}{when ? ` • ${when}` : ""}
                        </Text>
                    </View>
                </View>

                <View style={[styles.status, { backgroundColor: colors.surface }]}>
                    <View style={[styles.pulse, { backgroundColor: colors.success }]} />
                    <Text style={[styles.statusText, { color: colors.success }]}>{formatStatus(booking.status)}</Text>
                </View>
            </View>

            <View style={[styles.track, { backgroundColor: colors.cardAlt }]}>
                <View style={[styles.fill, { width: `${Math.round(progress * 100)}%`, backgroundColor: colors.accent }]} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        overflow: "hidden",
    },
    content: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    left: { flexDirection: "row", alignItems: "center", gap: 12, flexShrink: 1 },
    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    title: { fontSize: 14, fontWeight: "800", marginBottom: 2 },
    pro: { fontSize: 12, fontWeight: "500" },
    status: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    pulse: { width: 7, height: 7, borderRadius: 4 },
    statusText: { fontSize: 12, fontWeight: "700" },
    track: { height: 5, borderRadius: 4 },
    fill: { height: 5, borderRadius: 4 },
});