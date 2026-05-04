// ─── app/(auth)/login.tsx ─────────────────────────────────────────────────────
// FixGlobal — Login Screen
// Same visual DNA as signup: white bg, blue/gold blobs, gold CTA

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Path, Line } from "react-native-svg";

const { width } = Dimensions.get("window");

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const BLUE = "#1A3C6E";
const GOLD = "#ffc300";
const WHITE = "#FFFFFF";
const LIGHT = "#F4F7FD";
const BORDER = "#DDE4F0";
const PLACEHOLDER = "#8FA0B8";
const ERROR = "#E84040";
const LABEL = "#3A4E6A";

// ─── Eye icons ────────────────────────────────────────────────────────────────
function EyeIcon({ color = PLACEHOLDER }: { color?: string }) {
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
function EyeOffIcon({ color = PLACEHOLDER }: { color?: string }) {
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

// ─── Decorative blobs (same family as onboarding + signup) ───────────────────
function HeaderBlob() {
  return (
    <View style={styles.blobContainer} pointerEvents="none">
      {/* Gold-tinted large blob — flipped side vs signup for variety */}
      <View style={styles.blobA} />
      <View style={styles.blobB} />
      <View style={styles.blobC} />
    </View>
  );
}

// ─── Animated field ───────────────────────────────────────────────────────────
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
    outputRange: [error ? ERROR : BORDER, error ? ERROR : BLUE],
  });

  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Animated.View style={[styles.inputShell, { borderColor }]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={PLACEHOLDER}
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
            style={styles.eyeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {showSecure ? (
              <EyeOffIcon color={focused ? BLUE : PLACEHOLDER} />
            ) : (
              <EyeIcon color={focused ? BLUE : PLACEHOLDER} />
            )}
          </Pressable>
        )}
      </Animated.View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Invalid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Min. 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const clearErr = (f: string) =>
    setErrors((prev) => {
      const n = { ...prev };
      delete n[f];
      return n;
    });

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // TODO: wire up real auth API
      console.log("Login →", { email });
      router.replace("/(tabs)/home");
    } catch (err) {
      console.error(err);
      setErrors({ general: "Incorrect email or password. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      // TODO: @react-native-google-signin/google-signin
      console.log("Google sign-in");
    } finally {
      setGLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        {/* ── Blobs ────────────────────────────────────────────────── */}
        <HeaderBlob />

        {/* ── Logo ─────────────────────────────────────────────────── */}
        <View style={styles.logoRow}>
          <Text style={styles.logoFix}>Fix</Text>
          <Text style={styles.logoGlobal}>Global</Text>
        </View>

        {/* ── Headline ─────────────────────────────────────────────── */}
        <View style={styles.headBlock}>
          <View style={styles.pill}>
            <View style={styles.pillDot} />
            <Text style={styles.pillText}>WELCOME BACK</Text>
          </View>
          <Text style={styles.headline}>Sign{"\n"}Back In</Text>
          <Text style={styles.subline}>Your trusted fixers are waiting.</Text>
        </View>

        {/* ── Form card ────────────────────────────────────────────── */}
        <View style={styles.card}>
          {/* General error */}
          {errors.general ? (
            <View style={styles.generalError}>
              <Ionicons
                name="alert-circle"
                size={16}
                color={ERROR}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          ) : null}

          {/* Email */}
          <Field
            label="Email Address"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              clearErr("email");
              clearErr("general");
            }}
            placeholder="you@example.com"
            keyboardType="email-address"
            error={errors.email}
            editable={!loading}
          />

          {/* Password */}
          <View>
            <Field
              label="Password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                clearErr("password");
                clearErr("general");
              }}
              placeholder="Enter your password"
              secure
              showToggle
              showSecure={showPw}
              onToggleSecure={() => setShowPw((v) => !v)}
              error={errors.password}
              editable={!loading}
            />
            {/* Forgot password — sits right under the field */}
            <Pressable
              onPress={() => router.push("/(auth)/forgot-password")}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>

          {/* ── Sign In button (GOLD) ──────────────────────────────── */}
          <Pressable
            style={({ pressed }) => [
              styles.goldBtn,
              (pressed || loading) && { opacity: 0.82 },
            ]}
            onPress={handleLogin}
            disabled={loading || gLoading}
          >
            {loading ? (
              <ActivityIndicator color={BLUE} />
            ) : (
              <View style={styles.btnInner}>
                <Text style={styles.goldBtnText}>Sign In</Text>
                <Ionicons
                  name="arrow-forward-circle"
                  size={20}
                  color={BLUE}
                  style={{ marginLeft: 6 }}
                />
              </View>
            )}
          </Pressable>

          {/* ── Divider ────────────────────────────────────────────── */}
          <View style={styles.divider}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>or continue with</Text>
            <View style={styles.divLine} />
          </View>

          {/* ── Google button ──────────────────────────────────────── */}
          <Pressable
            style={({ pressed }) => [
              styles.googleBtn,
              (pressed || gLoading) && { opacity: 0.78 },
            ]}
            onPress={handleGoogle}
            disabled={loading || gLoading}
          >
            {gLoading ? (
              <ActivityIndicator color={BLUE} />
            ) : (
              <View style={styles.btnInner}>
                <View style={styles.gCircle}>
                  <Text style={styles.gLetter}>G</Text>
                </View>
                <Text style={styles.googleBtnText}>Sign in with Google</Text>
              </View>
            )}
          </Pressable>

          {/* ── Footer ─────────────────────────────────────────────── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <Pressable onPress={() => router.push("/(auth)/signup")}>
              <Text style={styles.footerLink}>Sign up</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: WHITE },
  scroll: { flexGrow: 1, paddingHorizontal: 22 },

  // ── Blobs — gold blob on left this time, blue on right ──
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
    width: width * 0.72,
    height: width * 0.72,
    borderRadius: width * 0.36,
    backgroundColor: "#FFF3C4", // gold tint — swapped vs signup
    top: -width * 0.28,
    left: -width * 0.1,
    opacity: 0.85,
  },
  blobB: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: "#DDEAFD", // blue tint
    top: -width * 0.1,
    right: -width * 0.08,
  },
  blobC: {
    position: "absolute",
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: width * 0.14,
    backgroundColor: "#C5D8FB",
    top: width * 0.22,
    left: width * 0.08,
    opacity: 0.5,
  },

  // ── Logo ──
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 58,
  },
  logoFix: {
    fontSize: 22,
    fontWeight: "900",
    color: BLUE,
    letterSpacing: -0.4,
  },
  logoGlobal: {
    fontSize: 22,
    fontWeight: "900",
    color: GOLD,
    letterSpacing: -0.4,
  },

  // ── Headline ──
  headBlock: { marginTop: 32, marginBottom: 28 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFF3C4",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 14,
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: GOLD,
    marginRight: 7,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8B6914",
    letterSpacing: 1.2,
  },
  headline: {
    fontSize: 42,
    fontWeight: "900",
    color: BLUE,
    lineHeight: 48,
    letterSpacing: -1,
    marginBottom: 10,
  },
  subline: {
    fontSize: 15,
    color: PLACEHOLDER,
    fontWeight: "500",
    lineHeight: 22,
  },

  // ── Card ──
  card: {
    backgroundColor: WHITE,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 28,
    shadowColor: BLUE,
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 1,
    borderColor: "#EAF0FB",
  },

  // ── General error banner ──
  generalError: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    borderWidth: 1,
    borderColor: "#FFCDD2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  generalErrorText: {
    flex: 1,
    fontSize: 13,
    color: ERROR,
    fontWeight: "600",
  },

  // ── Field ──
  fieldWrapper: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: LABEL,
    marginBottom: 7,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: LIGHT,
    paddingHorizontal: 14,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: BLUE,
    fontWeight: "500",
  },
  eyeBtn: { paddingLeft: 8, paddingVertical: 4 },
  errorText: {
    color: ERROR,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },

  // ── Forgot password ──
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: -8,
    marginBottom: 8,
    paddingVertical: 4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "700",
    color: BLUE,
    textDecorationLine: "underline",
  },

  // ── Gold Sign In button ──
  goldBtn: {
    height: 54,
    backgroundColor: GOLD,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 20,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  goldBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: BLUE,
    letterSpacing: 0.2,
  },
  btnInner: { flexDirection: "row", alignItems: "center" },

  // ── Divider ──
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  divLine: { flex: 1, height: 1, backgroundColor: BORDER },
  divText: { fontSize: 12, color: PLACEHOLDER, fontWeight: "500" },

  // ── Google button ──
  googleBtn: {
    height: 52,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
    marginBottom: 24,
  },
  gCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#EAF0FB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  gLetter: { fontSize: 14, fontWeight: "900", color: "#4285F4" },
  googleBtnText: { fontSize: 15, fontWeight: "700", color: BLUE },

  // ── Footer ──
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { fontSize: 14, color: PLACEHOLDER },
  footerLink: {
    fontSize: 14,
    fontWeight: "800",
    color: BLUE,
    textDecorationLine: "underline",
  },
});
