// ─── app/(auth)/login.tsx ─────────────────────────────────────────────────────
// Login screen aligned with the shared app theme.

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
import Svg, { Circle, Line, Path } from "react-native-svg";
import useTheme from "@/src/context/ThemeContext";
import { getProfile, login } from "@/src/features/auth/api";
import { saveAuthSession } from "@/src/lib/storage";

function EyeIcon({ color }: { color: string }) {
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

function EyeOffIcon({ color }: { color: string }) {
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
  editable?: boolean;
}

function Field({
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
  editable = true,
}: FieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const fieldStyles = useMemo(
    () =>
      StyleSheet.create({
        fieldWrapper: { marginBottom: 16 },
        fieldLabel: { fontSize: 12, fontWeight: "700", color: colors.textSecondary, marginBottom: 7, letterSpacing: 0.3 },
        inputShell: {
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1.5,
          borderRadius: 12,
          backgroundColor: colors.surface,
          paddingHorizontal: 14,
          height: 48,
        },
        input: { flex: 1, fontSize: 14, color: colors.textPrimary, fontWeight: "500" },
        eyeBtn: { paddingLeft: 8, paddingVertical: 4 },
        errorText: { color: colors.danger, fontSize: 11, fontWeight: "600", marginTop: 4 },
      }),
    [colors]
  );

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
    outputRange: [error ? colors.danger : colors.border, error ? colors.danger : colors.accent],
  });

  return (
    <View style={fieldStyles.fieldWrapper}>
      <Text style={fieldStyles.fieldLabel}>{label}</Text>
      <Animated.View style={[fieldStyles.inputShell, { borderColor }]}>
        <TextInput
          style={fieldStyles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={secure && !showSecure}
          onFocus={onFocus}
          onBlur={onBlur}
          editable={editable}
        />
        {showToggle && (
          <Pressable
            onPress={onToggleSecure}
            style={fieldStyles.eyeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {showSecure ? (
              <EyeOffIcon color={focused ? colors.accent : colors.muted} />
            ) : (
              <EyeIcon color={focused ? colors.accent : colors.muted} />
            )}
          </Pressable>
        )}
      </Animated.View>
      {error ? <Text style={fieldStyles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: colors.background },
        scroll: { flexGrow: 1, paddingHorizontal: 22 },
        blobContainer: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 240,
          overflow: "hidden",
        },
        blobA: {
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: 140,
          backgroundColor: colors.cardAlt,
          top: -70,
          left: -30,
          opacity: 0.9,
        },
        blobB: {
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: colors.surface,
          top: -18,
          right: -32,
          opacity: 0.9,
        },
        blobC: {
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: colors.hero,
          top: 90,
          left: 35,
          opacity: 0.6,
        },
        logoRow: {
          flexDirection: "row",
          alignItems: "center",
          marginTop: 58,
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
        headBlock: { marginTop: 32, marginBottom: 28 },
        pill: {
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          backgroundColor: colors.cardAlt,
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 20,
          marginBottom: 14,
          borderWidth: 1,
          borderColor: colors.border,
        },
        pillDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.accent,
          marginRight: 8,
        },
        pillText: {
          fontSize: 11,
          fontWeight: "800",
          color: colors.textSecondary,
          letterSpacing: 1.2,
        },
        headline: { fontSize: 42, fontWeight: "900", color: colors.textPrimary, lineHeight: 48, letterSpacing: -1, marginBottom: 10 },
        subline: { fontSize: 15, color: colors.textSecondary, fontWeight: "500", lineHeight: 22 },
        card: {
          backgroundColor: colors.panel,
          borderRadius: 24,
          paddingHorizontal: 20,
          paddingTop: 28,
          paddingBottom: 28,
          shadowColor: colors.textPrimary,
          shadowOpacity: 0.08,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
          borderWidth: 1,
          borderColor: colors.border,
        },
        generalError: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.danger + "1A",
          borderWidth: 1,
          borderColor: colors.danger + "66",
          borderRadius: 10,
          padding: 12,
          marginBottom: 16,
        },
        generalErrorText: { flex: 1, fontSize: 13, color: colors.danger, fontWeight: "600" },
        fieldWrapper: { marginBottom: 16 },
        fieldLabel: { fontSize: 12, fontWeight: "700", color: colors.textSecondary, marginBottom: 7, letterSpacing: 0.3 },
        inputShell: {
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1.5,
          borderRadius: 12,
          backgroundColor: colors.surface,
          paddingHorizontal: 14,
          height: 48,
        },
        input: { flex: 1, fontSize: 14, color: colors.textPrimary, fontWeight: "500" },
        eyeBtn: { paddingLeft: 8, paddingVertical: 4 },
        errorText: { color: colors.danger, fontSize: 11, fontWeight: "600", marginTop: 4 },
        forgotBtn: { alignSelf: "flex-end", marginTop: -8, marginBottom: 8, paddingVertical: 4 },
        forgotText: { fontSize: 13, fontWeight: "700", color: colors.accent, textDecorationLine: "underline" },
        goldBtn: {
          height: 54,
          backgroundColor: colors.accent,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 4,
          marginBottom: 20,
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 6,
        },
        goldBtnText: { fontSize: 15, fontWeight: "800", color: colors.card, letterSpacing: 0.2 },
        btnInner: { flexDirection: "row", alignItems: "center" },
        divider: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
        divLine: { flex: 1, height: 1, backgroundColor: colors.border },
        divText: { fontSize: 12, color: colors.muted, fontWeight: "500", marginHorizontal: 10 },

        gCircle: {
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: colors.surface,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
        },
        footer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
        footerText: { fontSize: 14, color: colors.textSecondary },
        footerLink: { fontSize: 14, fontWeight: "800", color: colors.accent, textDecorationLine: "underline" },
      }),
    [colors]
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Min. 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const clearErr = (field: string) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const resp = await login({ email, password });
      const token = resp?.data?.accessToken ?? (resp as any)?.accessToken ?? (resp as any)?.token;
      const refreshToken = resp?.data?.refreshToken ?? (resp as any)?.refreshToken;
      const user = resp?.data?.user ?? (resp as any)?.user ?? null;

      console.log("[auth] login response received", {
        hasToken: Boolean(token),
        hasRefreshToken: Boolean(refreshToken),
        userEmail: user?.email ?? "unknown",
      });

      await saveAuthSession({ token: token ?? "", refreshToken, user: user ?? null });

      try {
        const profile = await getProfile(token);
        const profileUser = profile?.data?.user ?? profile?.user ?? user;
        if (profileUser) {
          await saveAuthSession({ token: token ?? "", refreshToken, user: profileUser });
        }
      } catch (err) {
        console.warn("[auth] profile fetch failed after login:", err);
      }

      router.replace("/(tabs)/home");
    } catch (err: any) {
      const msg = err?.message || "";
      const isUnverified = msg.toLowerCase().includes("not been verified");

      if (isUnverified) {
        router.push({ pathname: "/(auth)/verify-customer", params: { email } });
        return;
      }

      setErrors({
        general: msg.includes("401") || msg.includes("Unauthorized")
          ? "Incorrect email or password. Try again."
          : msg || "Unable to sign in. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.root}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.topBarBg} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <View style={styles.blobContainer} pointerEvents="none">
          <View style={styles.blobA} />
          <View style={styles.blobB} />
          <View style={styles.blobC} />
        </View>

        <View style={styles.logoRow}>
          <Text style={styles.logoFix}>EIV</Text>
          <Text style={styles.logoGlobal}>VER</Text>
        </View>

        <View style={styles.headBlock}>
          <View style={styles.pill}>
            <View style={styles.pillDot} />
            <Text style={styles.pillText}>WELCOME BACK</Text>
          </View>
          <Text style={styles.headline}>Sign{"\n"}Back In</Text>
          <Text style={styles.subline}>Your trusted fixers are waiting.</Text>
        </View>

        <View style={styles.card}>
          {errors.general ? (
            <View style={styles.generalError}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} style={{ marginRight: 8 }} />
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          ) : null}

          <Field
            label="Email Address"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              clearErr("email");
              clearErr("general");
            }}
            placeholder="you@example.com"
            keyboardType="email-address"
            error={errors.email}
            editable={!loading}
          />

          <View>
            <Field
              label="Password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                clearErr("password");
                clearErr("general");
              }}
              placeholder="Enter your password"
              secure
              showToggle
              showSecure={showPw}
              onToggleSecure={() => setShowPw((value) => !value)}
              error={errors.password}
              editable={!loading}
            />

            <Pressable onPress={() => router.push("/(auth)/verify-customer")} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Verify My Account?</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/(auth)/forgot-password")} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>

          <Pressable style={({ pressed }) => [styles.goldBtn, (pressed || loading) && { opacity: 0.82 }]} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={colors.card} />
            ) : (
              <View style={styles.btnInner}>
                <Text style={styles.goldBtnText}>Sign In</Text>
                <Ionicons name="arrow-forward-circle" size={20} color={colors.card} style={{ marginLeft: 6 }} />
              </View>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>or </Text>
            <View style={styles.divLine} />
          </View>



          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <Pressable onPress={() => router.push("/(auth)/signup")}>
              <Text style={styles.footerLink}> Sign up</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

