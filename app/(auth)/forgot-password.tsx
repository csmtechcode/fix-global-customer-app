// ─── app/(auth)/forgot-password.tsx ──────────────────────────────────────────
// FixGlobal — Forgot Password Screen
// Same visual DNA: white bg, blue/gold blobs, gold CTA
// Flow: enter email → simulated send → redirect to (tabs)/home

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
import Svg, { Path, Circle, Polyline } from "react-native-svg";

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
const SUCCESS = "#1A9E6A";

// ─── Mail SVG icon ────────────────────────────────────────────────────────────
function MailIcon({
  color = BLUE,
  size = 48,
}: {
  color?: string;
  size?: number;
}) {
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

// ─── Check circle icon ────────────────────────────────────────────────────────
function CheckIcon({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={SUCCESS} strokeWidth={1.8} />
      <Path
        d="M8 12l3 3 5-5"
        stroke={SUCCESS}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Decorative blobs ─────────────────────────────────────────────────────────
function HeaderBlob() {
  return (
    <View style={styles.blobContainer} pointerEvents="none">
      {/* Green-tinted blob this time — unique per screen */}
      <View style={styles.blobA} />
      <View style={styles.blobB} />
      <View style={styles.blobC} />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Success card fade-in
  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.92)).current;

  // Animated border on email field
  const borderAnim = useRef(new Animated.Value(0)).current;

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
    outputRange: [error ? ERROR : BORDER, error ? ERROR : BLUE],
  });

  // ── Validate ────────────────────────────────────────────────────────────────
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

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // TODO: wire real password-reset API
      await new Promise((res) => setTimeout(res, 1200)); // simulate network
      setSent(true);
      // Animate success card in
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
    } catch (_) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        <HeaderBlob />

        {/* ── Logo ─────────────────────────────────────────────────── */}
        <View style={styles.logoRow}>
          <Text style={styles.logoFix}>Fix</Text>
          <Text style={styles.logoGlobal}>Global</Text>
        </View>

        {/* ── Back button ──────────────────────────────────────────── */}
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={18} color={BLUE} />
          <Text style={styles.backText}>Back to Sign In</Text>
        </Pressable>

        {/* ── Headline ─────────────────────────────────────────────── */}
        <View style={styles.headBlock}>
          <View style={styles.pill}>
            <View style={styles.pillDot} />
            <Text style={styles.pillText}>ACCOUNT RECOVERY</Text>
          </View>
          <Text style={styles.headline}>Reset{"\n"}Password</Text>
          <Text style={styles.subline}>
            Enter your email and we&apos;ll send you{"\n"}a link to get back in.
          </Text>
        </View>

        {/* ── Card ─────────────────────────────────────────────────── */}
        <View style={styles.card}>
          {!sent ? (
            <>
              {/* Mail icon visual */}
              <View style={styles.iconArea}>
                <View style={styles.iconRing}>
                  <View style={styles.iconCircle}>
                    <MailIcon color={BLUE} size={40} />
                  </View>
                </View>
              </View>

              {/* Email field */}
              <Text style={styles.fieldLabel}>Email Address</Text>
              <Animated.View style={[styles.inputShell, { borderColor }]}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  placeholderTextColor={PLACEHOLDER}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  editable={!loading}
                />
              </Animated.View>
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : (
                <Text style={styles.hintText}>
                  We&apos;ll send a reset link to this address.
                </Text>
              )}

              {/* Send button */}
              <Pressable
                style={({ pressed }) => [
                  styles.goldBtn,
                  (pressed || loading) && { opacity: 0.82 },
                ]}
                onPress={handleSend}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={BLUE} />
                ) : (
                  <View style={styles.btnInner}>
                    <Text style={styles.goldBtnText}>Send Reset Link</Text>
                    <Ionicons
                      name="send"
                      size={17}
                      color={BLUE}
                      style={{ marginLeft: 8 }}
                    />
                  </View>
                )}
              </Pressable>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Remembered it? </Text>
                <Pressable onPress={() => router.push("/(auth)/login")}>
                  <Text style={styles.footerLink}>Sign in</Text>
                </Pressable>
              </View>
            </>
          ) : (
            /* ── Success state ─────────────────────────────────────── */
            <Animated.View
              style={[
                styles.successBox,
                {
                  opacity: successOpacity,
                  transform: [{ scale: successScale }],
                },
              ]}
            >
              {/* Check circle */}
              <View style={styles.successIconWrap}>
                <CheckIcon size={72} />
              </View>

              <Text style={styles.successTitle}>Check your inbox!</Text>
              <Text style={styles.successDesc}>
                We sent a password reset link to{"\n"}
                <Text style={styles.successEmail}>{email}</Text>
              </Text>

              {/* Small note */}
              <View style={styles.successNote}>
                <Ionicons
                  name="information-circle-outline"
                  size={15}
                  color={PLACEHOLDER}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.successNoteText}>
                  Didn&apos;t get it? Check your spam folder.
                </Text>
              </View>

              {/* Continue to app */}
              <Pressable
                style={({ pressed }) => [
                  styles.goldBtn,
                  { marginTop: 28 },
                  pressed && { opacity: 0.82 },
                ]}
                onPress={() => router.replace("/(tabs)/home")}
              >
                <View style={styles.btnInner}>
                  <Text style={styles.goldBtnText}>Continue to App</Text>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={20}
                    color={BLUE}
                    style={{ marginLeft: 6 }}
                  />
                </View>
              </Pressable>

              {/* Resend */}
              <Pressable
                style={styles.resendBtn}
                onPress={() => {
                  setSent(false);
                  setEmail("");
                }}
              >
                <Text style={styles.resendText}>
                  Resend with different email
                </Text>
              </Pressable>
            </Animated.View>
          )}
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

  // ── Blobs — green tint this time, unique per screen ──
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
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: "#D6F0E8", // green tint — unique to this screen
    top: -width * 0.25,
    right: -width * 0.08,
  },
  blobB: {
    position: "absolute",
    width: width * 0.48,
    height: width * 0.48,
    borderRadius: width * 0.24,
    backgroundColor: "#DDEAFD", // blue tint
    top: -width * 0.05,
    left: -width * 0.1,
    opacity: 0.7,
  },
  blobC: {
    position: "absolute",
    width: width * 0.26,
    height: width * 0.26,
    borderRadius: width * 0.13,
    backgroundColor: "#FFF3C4", // gold tint
    top: width * 0.24,
    right: width * 0.1,
    opacity: 0.6,
  },

  // ── Logo ──
  logoRow: { flexDirection: "row", alignItems: "center", marginTop: 58 },
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

  // ── Back button ──
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    alignSelf: "flex-start",
    paddingVertical: 4,
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: BLUE,
    marginLeft: 2,
  },

  // ── Headline ──
  headBlock: { marginTop: 20, marginBottom: 28 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#D6F0E8", // green pill — unique
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 14,
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: SUCCESS,
    marginRight: 7,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0E5C3A",
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

  // ── Mail icon visual ──
  iconArea: { alignItems: "center", marginBottom: 24 },
  iconRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EEF4FD",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#D6E4F7",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Field ──
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
    marginBottom: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: BLUE,
    fontWeight: "500",
  },
  errorText: {
    color: ERROR,
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 16,
  },
  hintText: {
    color: PLACEHOLDER,
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 20,
  },

  // ── Gold button ──
  goldBtn: {
    height: 54,
    backgroundColor: GOLD,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
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

  // ── Footer ──
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: { fontSize: 14, color: PLACEHOLDER },
  footerLink: {
    fontSize: 14,
    fontWeight: "800",
    color: BLUE,
    textDecorationLine: "underline",
  },

  // ── Success state ──
  successBox: { alignItems: "center", paddingTop: 8 },
  successIconWrap: {
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5F5EE",
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: BLUE,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  successDesc: {
    fontSize: 15,
    color: PLACEHOLDER,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
    marginBottom: 16,
  },
  successEmail: {
    color: BLUE,
    fontWeight: "800",
  },
  successNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  successNoteText: {
    fontSize: 12,
    color: PLACEHOLDER,
    fontWeight: "500",
    flex: 1,
  },
  resendBtn: {
    marginTop: 16,
    paddingVertical: 8,
  },
  resendText: {
    fontSize: 13,
    fontWeight: "700",
    color: PLACEHOLDER,
    textDecorationLine: "underline",
  },
});
