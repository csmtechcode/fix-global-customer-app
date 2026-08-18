import React, { useState, useRef } from "react";
import { View, Text, TextInput, Pressable, Animated, StyleSheet } from "react-native";
import { EyeIcon, EyeOffIcon } from "./EyeIcons";
import { COLORS } from "../../theme/colors";

interface FieldProps {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    placeholder: string;
    error?: string;
    keyboardType?: "default" | "email-address";
    autoCapitalize?: "none" | "words";
    secure?: boolean;
    showToggle?: boolean;
    showSecure?: boolean;
    onToggleSecure?: () => void;
    style?: object;
    editable?: boolean;
}

export function Field({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    keyboardType = "default",
    autoCapitalize = "none",
    secure = false,
    showToggle = false,
    showSecure = false,
    onToggleSecure,
    style,
    editable = true,
}: FieldProps) {
    const [focused, setFocused] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;

    const onFocus = () => {
        setFocused(true);
        Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    };
    const onBlur = () => {
        setFocused(false);
        Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [error ? "#E84040" : "#DDE4F0", error ? "#E84040" : "#1A3C6E"],
    });

    return (
        <View style={[styles.fieldWrapper, style]}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Animated.View style={[styles.inputShell, { borderColor }]}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#8FA0B8"
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                    secureTextEntry={secure && !showSecure}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    editable={editable}
                />
                {showToggle && (
                    <Pressable onPress={onToggleSecure} style={styles.eyeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        {showSecure ? <EyeOffIcon color={focused ? COLORS.BLUE : COLORS.PLACEHOLDER} /> : <EyeIcon color={focused ? COLORS.BLUE : COLORS.PLACEHOLDER} />}
                    </Pressable>
                )}
            </Animated.View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    fieldWrapper: { marginBottom: 16 },
    fieldLabel: { fontSize: 12, fontWeight: "700", color: "#3A4E6A", marginBottom: 7, letterSpacing: 0.3, textTransform: "uppercase" },
    inputShell: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderRadius: 12, backgroundColor: "#F4F7FD", paddingHorizontal: 14, height: 48 },
    input: { flex: 1, fontSize: 14, color: "#1A3C6E", fontWeight: "500" },
    eyeBtn: { paddingLeft: 8, paddingVertical: 4 },
    errorText: { color: "#E84040", fontSize: 11, fontWeight: "600", marginTop: 4 },
});