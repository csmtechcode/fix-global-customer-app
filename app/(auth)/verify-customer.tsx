// ─── app/(auth)/verify-customer.tsx ────────────────────────────────────────
// Verification screen aligned to the shared app theme.

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { resendVerificationCode, verifyOtp } from "@/src/features/auth/api";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export default function VerifyCustomerScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const rawParams = useLocalSearchParams<{ email?: string | string[]; phoneNumber?: string | string[] }>();

  const email = Array.isArray(rawParams.email) ? rawParams.email[0] ?? "" : rawParams.email ?? "";
  const phoneNumber = Array.isArray(rawParams.phoneNumber) ? rawParams.phoneNumber[0] ?? "" : rawParams.phoneNumber ?? "";

  const [method, setMethod] = useState<"email" | "phone">("email");
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const inputs = useRef<(TextInput | null)[]>([]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 22 },
        logoRow: { flexDirection: "row", alignItems: "center", marginTop: 58 },
        logoFix: { fontSize: 22, fontWeight: "900", color: colors.textPrimary },
        logoGlobal: { fontSize: 22, fontWeight: "900", color: colors.accent },
        headBlock: { marginTop: 32, marginBottom: 24 },
        headline: { fontSize: 34, fontWeight: "900", color: colors.textPrimary, lineHeight: 40, marginBottom: 8 },
        subline: { fontSize: 15, color: colors.textSecondary, fontWeight: "500" },
        methodRow: { flexDirection: "row", marginBottom: 16, gap: 10 },
        methodPill: {
          flex: 1,
          height: 44,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.surface,
        },
        methodPillActive: { borderColor: colors.accent, backgroundColor: colors.cardAlt },
        methodText: { fontSize: 14, fontWeight: "700", color: colors.muted },
        methodTextActive: { color: colors.accent },
        destinationText: { fontSize: 13, color: colors.textSecondary, marginBottom: 24, fontWeight: "500" },
        destinationBold: { color: colors.textPrimary, fontWeight: "800" },
        otpRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
        otpBox: {
          width: 46,
          height: 54,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          fontSize: 20,
          fontWeight: "800",
          color: colors.textPrimary,
        },
         footer: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 24,
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
        otpBoxError: { borderColor: colors.danger },
        errorText: { color: colors.danger, fontSize: 12, fontWeight: "600", marginBottom: 12 },
        goldBtn: {
          height: 54,
          backgroundColor: colors.accent,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 12,
        },
        goldBtnText: { fontSize: 15, fontWeight: "800", color: colors.card },
        resendRow: { alignItems: "center", marginTop: 20 },
        resendText: { fontSize: 13, fontWeight: "700", color: colors.accent },
      }),
    [colors]
  );

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const destination = method === "email" ? email : phoneNumber;
  const code = digits.join("");

  const handleDigitChange = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (!cleaned) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    const next = [...digits];
    next[index] = cleaned[cleaned.length - 1];
    setDigits(next);

    if (index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (code.length !== CODE_LENGTH) {
      setError(`Enter the ${CODE_LENGTH}-digit code`);
      return;
    }

    setError("");
    setLoading(true);

    try {
      await verifyOtp({ email: email || "", code });
      router.replace("/(tabs)/home");
    } catch (err: any) {
      setError(err?.message ?? "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    setError("");

    try {
      await resendVerificationCode({ email, phoneNumber });
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(CODE_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } catch (err: any) {
      setError(err?.message ?? "Could not resend code. Try again shortly.");
    } finally {
      setResending(false);
    }
  };

  const switchMethod = (nextMethod: "email" | "phone") => {
    if (nextMethod === method) return;
    setMethod(nextMethod);
    setDigits(Array(CODE_LENGTH).fill(""));
    setError("");
    setCooldown(0);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.topBarBg} />

      <View style={styles.logoRow}>
        <Text style={styles.logoFix}>EIV</Text>
        <Text style={styles.logoGlobal}>VER</Text>
      </View>

      <View style={styles.headBlock}>
        <Text style={styles.headline}>Verify your{"\n"}account</Text>
        <Text style={styles.subline}>Choose how you&apos;d like to receive your code.</Text>
      </View>

      <View style={styles.methodRow}>
        <Pressable style={[styles.methodPill, method === "email" && styles.methodPillActive]} onPress={() => switchMethod("email")}>
          <Text style={[styles.methodText, method === "email" && styles.methodTextActive]}>Email</Text>
        </Pressable>
        <Pressable style={[styles.methodPill, method === "phone" && styles.methodPillActive]} onPress={() => switchMethod("phone")}>
          <Text style={[styles.methodText, method === "phone" && styles.methodTextActive]}>Phone</Text>
        </Pressable>
      </View>

      <Text style={styles.destinationText}>
        Code will be sent to <Text style={styles.destinationBold}>{destination || "—"}</Text>
      </Text>

      <View style={styles.otpRow}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(element) => {
              inputs.current[index] = element;
            }}
            style={[styles.otpBox, error && styles.otpBoxError]}
            value={digit}
            onChangeText={(text) => handleDigitChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            autoFocus={index === 0}
          />
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable style={({ pressed }) => [styles.goldBtn, (pressed || loading) && { opacity: 0.82 }]} onPress={handleVerify} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.card} /> : <Text style={styles.goldBtnText}>Verify Account</Text>}
      </Pressable>

      <Pressable style={styles.resendRow} onPress={handleResend} disabled={cooldown > 0 || resending}>
        {resending ? (
          <ActivityIndicator color={colors.accent} size="small" />
        ) : (
          <Text style={styles.resendText}>{cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't get a code? Resend"}</Text>
        )}
      </Pressable>
      <View style={styles.footer}>
                  <Text style={styles.footerText}>Already have an account?</Text>
                  <Pressable onPress={() => router.push("/(auth)/login")}>
                    <Text style={styles.footerLink}>Sign in</Text>
                  </Pressable>
                </View>
    </View>

    
  );
}
