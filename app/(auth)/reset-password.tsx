import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useTheme from "@/src/context/ThemeContext";
import { resetPassword } from "@/src/features/auth/api";

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const params = useLocalSearchParams<{ email?: string | string[] }>();
    const initialEmail = Array.isArray(params.email) ? params.email[0] ?? "" : params.email ?? "";

    const [email, setEmail] = useState(initialEmail);
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const styles = useMemo(
        () =>
            StyleSheet.create({
                root: {
                    flex: 1,
                    backgroundColor: colors.background,
                    paddingHorizontal: 22,
                },
                inner: {
                    flex: 1,
                    justifyContent: "center",
                },
                brandRow: {
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 16,
                    marginBottom: 18,
                },
                logoFix: {
                    fontSize: 22,
                    fontWeight: "900",
                    color: colors.textPrimary,
                    letterSpacing: -0.4,
                },
                logoGlobal: {
                    fontSize: 22,
                    fontWeight: "900",
                    color: colors.accent,
                    letterSpacing: -0.4,
                },
                card: {
                    backgroundColor: colors.panel,
                    borderRadius: 24,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 22,
                    shadowColor: colors.textPrimary,
                    shadowOpacity: 0.08,
                    shadowRadius: 16,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 6,
                },
                title: {
                    fontSize: 26,
                    fontWeight: "900",
                    color: colors.textPrimary,
                    marginBottom: 18,
                    letterSpacing: -0.5,
                },
                inputGroup: {
                    marginBottom: 16,
                },
                label: {
                    fontSize: 12,
                    fontWeight: "700",
                    color: colors.textSecondary,
                    marginBottom: 7,
                    letterSpacing: 0.3,
                    textTransform: "uppercase",
                },
                inputWrap: {
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1.5,
                    borderRadius: 12,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    minHeight: 52,
                    paddingHorizontal: 14,
                },
                input: {
                    flex: 1,
                    minHeight: 52,
                    fontSize: 15,
                    fontWeight: "600",
                    color: colors.textPrimary,
                    paddingVertical: 14,
                },
                passwordInput: {
                    paddingRight: 8,
                },
                toggleButton: {
                    marginLeft: 8,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    backgroundColor: colors.panel,
                    borderWidth: 1,
                    borderColor: colors.border,
                },
                toggleText: {
                    color: colors.textSecondary,
                    fontWeight: "700",
                    fontSize: 12,
                },
                error: {
                    color: colors.danger,
                    marginTop: 8,
                    marginBottom: 4,
                    fontWeight: "700",
                    fontSize: 12,
                },
                button: {
                    width: "100%",
                    minHeight: 56,
                    paddingHorizontal: 28,
                    paddingVertical: 14,
                    backgroundColor: colors.accent,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 14,
                    shadowColor: colors.accent,
                    shadowOpacity: 0.24,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 6,
                },
                buttonText: {
                    color: colors.card,
                    fontWeight: "800",
                    fontSize: 15,
                    letterSpacing: 0.2,
                },
                footer: {
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 16,
                },
                footerText: {
                    color: colors.textSecondary,
                    fontSize: 14,
                },
                footerLink: {
                    color: colors.accent,
                    fontSize: 14,
                    fontWeight: "700",
                    marginLeft: 4,
                },
            }),
        [colors]
    );

    const validate = () => {
        if (!email.trim()) return setError("Email is required");
        if (!token.trim()) return setError("Reset token is required");
        if (!password || password.length < 8) return setError("Password must be at least 8 characters");
        setError("");
        return true;
    };

    const handleReset = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await resetPassword({ email, token, password });
            router.replace("/(auth)/login");
        } catch (err: any) {
            setError(err?.message || "Could not reset password. Check token and email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.topBarBg} />

            <View style={styles.inner}>
                <View style={styles.brandRow}>
                    <Text style={styles.logoFix}>EIV</Text>
                    <Text style={styles.logoGlobal}>VER</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>Reset Password</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputWrap}>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={(value) => {
                                    setEmail(value);
                                    setError("");
                                }}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                placeholderTextColor={colors.muted}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Reset Token</Text>
                        <View style={styles.inputWrap}>
                            <TextInput
                                style={styles.input}
                                value={token}
                                onChangeText={(value) => {
                                    setToken(value);
                                    setError("");
                                }}
                                autoCapitalize="none"
                                placeholderTextColor={colors.muted}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New Password</Text>
                        <View style={styles.inputWrap}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                value={password}
                                onChangeText={(value) => {
                                    setPassword(value);
                                    setError("");
                                }}
                                secureTextEntry={!showPassword}
                                placeholderTextColor={colors.muted}
                            />
                            <Pressable
                                style={styles.toggleButton}
                                onPress={() => setShowPassword((current) => !current)}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Text style={styles.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
                            </Pressable>
                        </View>
                    </View>

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <Pressable style={styles.button} onPress={handleReset} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color={colors.card} />
                        ) : (
                            <Text style={styles.buttonText}>Reset Password</Text>
                        )}
                    </Pressable>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Remembered it?</Text>
                        <Pressable onPress={() => router.push("/(auth)/login")}>
                            <Text style={styles.footerLink}>Back to Login</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

