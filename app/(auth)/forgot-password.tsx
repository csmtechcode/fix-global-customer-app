import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Path, Polyline } from "react-native-svg";
import useTheme from "@/src/context/ThemeContext";
import { forgotPassword } from "@/src/features/auth/api";

function MailIcon({ color, size = 40 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Polyline
        points="22,6 12,13 2,6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CheckIcon({ color, size = 64 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1.8} />
      <Path
        d="M8 12l3 3 5-5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.92)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 22 },
        scroll: { flexGrow: 1 },
        brandRow: { flexDirection: "row", alignItems: "center", marginTop: 52, marginBottom: 18 },
        logoFix: { fontSize: 22, fontWeight: "900", color: colors.textPrimary, letterSpacing: -0.4 },
        logoGlobal: { fontSize: 22, fontWeight: "900", color: colors.accent, letterSpacing: -0.4 },
        backBtn: {
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          paddingVertical: 4,
          marginBottom: 20,
        },
        backText: { fontSize: 14, fontWeight: "600", color: colors.accent, marginLeft: 2 },
        headBlock: { marginBottom: 24 },
        headline: { fontSize: 34, fontWeight: "900", color: colors.textPrimary, lineHeight: 40, marginBottom: 8 },
        subline: { fontSize: 15, color: colors.textSecondary, fontWeight: "500", lineHeight: 22 },
        card: {
          backgroundColor: colors.panel,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 20,
          paddingTop: 22,
          paddingBottom: 22,
          shadowColor: colors.textPrimary,
          shadowOpacity: 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        },
        iconArea: { alignItems: "center", marginBottom: 20 },
        iconRing: {
          width: 92,
          height: 92,
          borderRadius: 46,
          backgroundColor: colors.cardAlt,
          alignItems: "center",
          justifyContent: "center",
        },
        fieldLabel: {
          fontSize: 12,
          fontWeight: "700",
          color: colors.textSecondary,
          marginBottom: 7,
          letterSpacing: 0.3,
          textTransform: "uppercase",
        },
        inputShell: {
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1.5,
          borderRadius: 12,
          backgroundColor: colors.surface,
          minHeight: 52,
          paddingHorizontal: 14,
        },
        input: {
          flex: 1,
          minHeight: 52,
          fontSize: 15,
          color: colors.textPrimary,
          fontWeight: "600",
          paddingVertical: 14,
        },
        errorText: {
          color: colors.danger,
          fontSize: 12,
          fontWeight: "600",
          marginTop: 8,
          marginBottom: 2,
        },
        hintText: {
          color: colors.muted,
          fontSize: 12,
          fontWeight: "500",
          marginTop: 8,
          marginBottom: 2,
        },
        primaryButton: {
          width: "100%",
          minHeight: 56,
          paddingHorizontal: 28,
          paddingVertical: 14,
          borderRadius: 14,
          backgroundColor: colors.accent,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 16,
          shadowColor: colors.accent,
          shadowOpacity: 0.24,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
        },
        primaryButtonText: {
          color: colors.card,
          fontWeight: "800",
          fontSize: 15,
          letterSpacing: 0.2,
        },
        buttonContent: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        },
        footer: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 16,
        },
        footerText: { color: colors.textSecondary, fontSize: 14 },
        footerLink: { color: colors.accent, fontSize: 14, fontWeight: "700", marginLeft: 4 },
        successBox: { alignItems: "center", paddingTop: 8 },
        successIconWrap: {
          width: 92,
          height: 92,
          borderRadius: 46,
          backgroundColor: colors.cardAlt,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        },
        successTitle: {
          fontSize: 24,
          fontWeight: "900",
          color: colors.textPrimary,
          marginBottom: 8,
          letterSpacing: -0.5,
        },
        successDesc: {
          fontSize: 14,
          color: colors.textSecondary,
          textAlign: "center",
          lineHeight: 20,
          marginBottom: 16,
        },
        successEmail: { color: colors.textPrimary, fontWeight: "800" },
        successNote: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 12,
          paddingVertical: 10,
          width: "100%",
        },
        successNoteText: { fontSize: 12, color: colors.muted, flex: 1 },
        resendBtn: { marginTop: 18, paddingVertical: 8 },
        resendText: { fontSize: 13, fontWeight: "700", color: colors.muted, textDecorationLine: "underline" },
      }),
    [colors]
  );

  const onFocus = () => {
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const onBlur = () => {
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? colors.danger : colors.border, error ? colors.danger : colors.accent],
  });

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
      Animated.parallel([
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(successScale, {
          toValue: 1,
          friction: 7,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.topBarBg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.brandRow}>
          <Text style={styles.logoFix}>EIV</Text>
          <Text style={styles.logoGlobal}>VER</Text>
        </View>

        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={18} color={colors.accent} />
          <Text style={styles.backText}>Back to Login</Text>
        </Pressable>

        <View style={styles.headBlock}>
          <Text style={styles.headline}>{`Forgot your\npassword?`}</Text>
          <Text style={styles.subline}>Enter your email and we&apos;ll send you a secure reset link.</Text>
        </View>

        <View style={styles.card}>
          {!sent ? (
            <>
              <View style={styles.iconArea}>
                <View style={styles.iconRing}>
                  <MailIcon color={colors.accent} size={40} />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Email Address</Text>
              <Animated.View style={[styles.inputShell, { borderColor }]}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  editable={!loading}
                />
              </Animated.View>

              {error ? <Text style={styles.errorText}>{error}</Text> : <Text style={styles.hintText}>We&apos;ll send a reset link to this address.</Text>}

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && !loading && { opacity: 0.92 },
                  loading && { opacity: 0.8 },
                ]}
                onPress={handleSend}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.card} />
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.primaryButtonText}>Send Reset Link</Text>
                    <Ionicons name="send" size={17} color={colors.card} style={{ marginLeft: 8 }} />
                  </View>
                )}
              </Pressable>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Remembered it?</Text>
                <Pressable onPress={() => router.push("/(auth)/login")}>
                  <Text style={styles.footerLink}>Sign in</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <Animated.View
              style={[
                styles.successBox,
                {
                  opacity: successOpacity,
                  transform: [{ scale: successScale }],
                },
              ]}
            >
              <View style={styles.successIconWrap}>
                <CheckIcon color={colors.success} size={68} />
              </View>

              <Text style={styles.successTitle}>Check your inbox</Text>
              <Text style={styles.successDesc}>
                We sent a password reset link to{"\n"}
                <Text style={styles.successEmail}>{email}</Text>
              </Text>

              <View style={styles.successNote}>
                <Ionicons name="information-circle-outline" size={15} color={colors.muted} style={{ marginRight: 8 }} />
                <Text style={styles.successNoteText}>Didn&apos;t get it? Check your spam folder.</Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  { marginTop: 20 },
                  pressed && { opacity: 0.92 },
                ]}
                onPress={() => router.push({ pathname: "/(auth)/reset-password", params: { email } })}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.primaryButtonText}>Use Reset Token</Text>
                  <Ionicons name="arrow-forward" size={17} color={colors.card} style={{ marginLeft: 8, paddingVertical: 12 }} />
                </View>
              </Pressable>

              <Pressable style={styles.resendBtn} onPress={() => { setSent(false); setEmail(""); setError(""); }}>
                <Text style={styles.resendText}>Try a different email</Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
