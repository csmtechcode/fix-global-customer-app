// src/features/home/GreetingHeader.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import useTheme from "../../context/ThemeContext";
import { getMe, CustomerUser } from "../auth/api";

export default function GreetingHeader() {
    const { colors } = useTheme();
    const [user, setUser] = useState<CustomerUser | null>(null);

    useEffect(() => {
        let mounted = true;
        getMe()
            .then((res) => {
                if (mounted) setUser(res.user);
            })
            .catch(() => {
                // stay silent — greeting just falls back to "there"
            });
        return () => {
            mounted = false;
        };
    }, []);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    return (
        <View style={[styles.wrapper, { backgroundColor: colors.hero }]}>
            <View style={[styles.blob1, { backgroundColor: colors.surface + "18" }]} />
            <View style={[styles.blob2, { backgroundColor: colors.accent + "18" }]} />

            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting},</Text>
            <Text style={[styles.name, { color: colors.textPrimary }]}>{user?.firstName || "there"} 👋</Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>What do you need fixed today?</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 24,
        padding: 24,
        overflow: "hidden",
        minHeight: 130,
        justifyContent: "center",
    },
    blob1: {
        position: "absolute",
        width: 180,
        height: 180,
        borderRadius: 90,
        top: -60,
        right: -40,
    },
    blob2: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 50,
        bottom: -20,
        left: 20,
    },
    greeting: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 2,
    },
    name: {
        fontSize: 26,
        fontWeight: "900",
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    sub: {
        fontSize: 13,
        fontWeight: "500",
    },
});