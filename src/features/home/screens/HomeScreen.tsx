// src/features/home/HomeScreen.tsx
import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../../components/layout/TopBar";
import Navbar from "../../../components/layout/Navbar";
import useTheme from "../../../context/ThemeContext";
import GreetingHeader from "../GreetingHeader";
import ActiveBookingSection from "../ActiveBookingSection";
import ServicesSection from "./../ServicesGrid";
import RecentBookingsSection from "./RecentBookingSection";
import CreateBookingSheet from "./CreateBookingSheet";
import type { ServiceCategory } from "../../auth/api";

export default function HomeScreen() {
    const router = useRouter();
    const { colors } = useTheme();

    const [sheetVisible, setSheetVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    function openBookingSheet(category?: ServiceCategory) {
        setSelectedCategory(category ?? null);
        setSheetVisible(true);
    }

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={["top"]}>
            <TopBar
                onNotificationPress={() => router.push("/(tabs)/notifications")}
                onSettingsPress={() => router.push("/(tabs)/settings")}
                onAvatarPress={() => router.push("/(tabs)/profile")}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <GreetingHeader />

                <ActiveBookingSection key={`active-${refreshKey}`} />

                <ServicesSection onSelectCategory={(cat) => openBookingSheet(cat)} onBookNow={() => openBookingSheet()} />

                <RecentBookingsSection key={`recent-${refreshKey}`} />

                <View style={{ height: 32 }} />
            </ScrollView>

            <CreateBookingSheet
                visible={sheetVisible}
                category={selectedCategory}
                onClose={() => setSheetVisible(false)}
                onCreated={() => setRefreshKey((k) => k + 1)}
            />

            <Navbar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    scroll: { paddingBottom: 24 },
});