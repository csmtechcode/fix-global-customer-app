import React, { useRef, useState } from "react";
import {
    Animated,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import Svg, { Circle, Path, Line } from "react-native-svg";
import { COLORS, styles } from "./signupStyles";

interface FieldProps {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    placeholder: string;
    error?: string;
    keyboardType?: "default" | "email-address";
    autoCapitalize?: "none" | "words";
    autoCorrect?: boolean;
    secure?: boolean;
    showToggle?: boolean;
    showSecure?: boolean;
    onToggleSecure?: () => void;
    style?: object;
    editable?: boolean;
}

function EyeIcon({ color = COLORS.placeholder }: { color?: string }) {
    return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
                d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                stroke={color}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.8} />
        </Svg>
    );
}

function EyeOffIcon({ color = COLORS.placeholder }: { color?: string }) {
    return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
                d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"
                stroke={color}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"
                stroke={color}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M14.12 14.12a3 3 0 11-4.24-4.24"
                stroke={color}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Line
                x1={1}
                y1={1}
                x2={23}
                y2={23}
                stroke={color}
                strokeWidth={1.8}
                strokeLinecap="round"
            />
        </Svg>
    );
}

export default function Field({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    keyboardType = "default",
    autoCapitalize = "none",
    autoCorrect = false,
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
        Animated.timing(borderAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const onBlur = () => {
        setFocused(false);
        Animated.timing(borderAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [error ? COLORS.error : COLORS.border, error ? COLORS.error : COLORS.blue],
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
                    placeholderTextColor={COLORS.placeholder}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={autoCorrect}
                    secureTextEntry={secure && !showSecure}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    editable={editable}
                />
                {showToggle && (
                    <Pressable
                        onPress={onToggleSecure}
                        style={styles.eyeBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        {showSecure ? (
                            <EyeOffIcon color={focused ? COLORS.blue : COLORS.placeholder} />
                        ) : (
                            <EyeIcon color={focused ? COLORS.blue : COLORS.placeholder} />
                        )}
                    </Pressable>
                )}
            </Animated.View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}
