import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, styles } from "./signupStyles";

interface SignupActionsProps {
    loading: boolean;
    onSubmit: () => void;
}

export default function SignupActions({
    loading,
    onSubmit,
}: SignupActionsProps) {
    return (
        <View style={styles.actions}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create my account"
                accessibilityState={{ disabled: loading, busy: loading }}
                style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && !loading && styles.primaryButtonPressed,
                    loading && styles.primaryButtonDisabled,
                ]}
                onPress={onSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={COLORS.paper} />
                ) : (
                    <View style={styles.buttonContent}>
                        <Text style={styles.primaryButtonText}>Create My Account</Text>
                        <Ionicons
                            name="arrow-forward"
                            size={19}
                            color={COLORS.paper}
                            style={styles.buttonIcon}
                        />
                    </View>
                )}
            </Pressable>

            <View style={styles.actionNote}>
                <Ionicons
                    name="shield-checkmark-outline"
                    size={15}
                    color={COLORS.forest}
                />
                <Text style={styles.actionNoteText}>
                    Your details are kept secure.
                </Text>
            </View>
        </View>
    );
}