// src/features/home/CreateBookingSheet.tsx
import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import useTheme from "../../../context/ThemeContext";
import { createBooking } from "../../bookings/api";
import type { ServiceCategory } from "../../services/api";

interface Props {
    visible: boolean;
    category?: ServiceCategory | null;
    onClose: () => void;
    onCreated: () => void;
}

export default function CreateBookingSheet({ visible, category, onClose, onCreated }: Props) {
    const { colors } = useTheme();
    const [serviceName, setServiceName] = useState("");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (category) setServiceName(category.name);
    }, [category]);

    async function handleSubmit() {
        if (!serviceName.trim() || !address.trim()) {
            setError("Please fill in the service and address");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            await createBooking({
                serviceName,
                serviceId: category?.id ?? serviceName.toLowerCase().replace(/\s+/g, "-"),
                address,
                notes,
                scheduledFor: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            });
            setServiceName("");
            setAddress("");
            setNotes("");
            onCreated();
            onClose();
        } catch (err: any) {
            setError(err?.message || "Could not create booking");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.sheet, { backgroundColor: colors.card }]}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>New Booking</Text>

                    <TextInput
                        style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
                        placeholder="Service (e.g. Pipe Installation)"
                        placeholderTextColor={colors.textSecondary}
                        value={serviceName}
                        onChangeText={setServiceName}
                    />
                    <TextInput
                        style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
                        placeholder="Address"
                        placeholderTextColor={colors.textSecondary}
                        value={address}
                        onChangeText={setAddress}
                    />
                    <TextInput
                        style={[styles.input, styles.multiline, { borderColor: colors.border, color: colors.textPrimary }]}
                        placeholder="Notes (optional)"
                        placeholderTextColor={colors.textSecondary}
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                    />

                    {error && <Text style={styles.error}>{error}</Text>}

                    <View style={styles.actions}>
                        <Pressable style={styles.cancelBtn} onPress={onClose} disabled={submitting}>
                            <Text style={{ color: colors.textSecondary, fontWeight: "700" }}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.submitBtn, { backgroundColor: colors.accent }]}
                            onPress={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color={colors.card} />
                            ) : (
                                <Text style={{ color: colors.card, fontWeight: "800" }}>Book Now</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "#00000055",
        justifyContent: "flex-end",
    },
    sheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        gap: 12,
    },
    title: { fontSize: 18, fontWeight: "800", marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
    },
    multiline: { minHeight: 70, textAlignVertical: "top" },
    error: { color: "#E84040", fontSize: 12, fontWeight: "600" },
    actions: { flexDirection: "row", gap: 12, marginTop: 8 },
    cancelBtn: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 14 },
    submitBtn: { flex: 2, alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 12 },
});