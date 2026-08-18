// ─── app/(auth)/signup.tsx ────────────────────────────────────────────────────
// Customer signup screen with app theme styling and working validation flow.

import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import useTheme from "@/src/context/ThemeContext";
import { registerCustomer } from "@/src/features/auth/api";
import SignupFormCard from "./components/SignupFormCard";

export default function SignupScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+234");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [registeredUserId, setRegisteredUserId] = useState("");

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scroll: {
          flexGrow: 1,
          paddingHorizontal: 22,
          paddingTop: Platform.OS === "ios" ? 18 : 28,
          paddingBottom: 28,
        },
        brandWrap: {
          marginTop: 12,
          marginBottom: 12,
        },
        logoRow: {
          flexDirection: "row",
          alignItems: "center",
          marginTop: 8,
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
        headerSpacer: {
          height: 12,
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
        bottomSpacer: {
          height: 24,
        },
        modalOverlay: {
          flex: 1,
          backgroundColor: "rgba(15, 18, 22, 0.48)",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        },
        modalCard: {
          width: "100%",
          maxWidth: 360,
          backgroundColor: colors.panel,
          borderRadius: 22,
          padding: 24,
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.border,
        },
        modalIcon: {
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.success + "22",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
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

        modalIconText: {
          color: colors.success,
          fontSize: 30,
          fontWeight: "800",
        },
        modalTitle: {
          color: colors.textPrimary,
          fontSize: 22,
          fontWeight: "800",
          marginBottom: 8,
        },
        modalText: {
          color: colors.textSecondary,
          fontSize: 14,
          lineHeight: 20,
          textAlign: "center",
          marginBottom: 20,
        },
        modalButton: {
          width: "100%",
          minHeight: 52,
          borderRadius: 12,
          backgroundColor: colors.accent,
          alignItems: "center",
          justifyContent: "center",
        },
        modalButtonText: {
          color: colors.card,
          fontSize: 15,
          fontWeight: "700",
        },
      }),
    [colors]
  );

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!firstName.trim()) nextErrors.firstName = "Required";
    if (!lastName.trim()) nextErrors.lastName = "Required";
    if (!email.trim()) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Invalid email";
    if (!phoneNumber.trim()) nextErrors.phoneNumber = "Phone number is required";
    else if (!/^\+?[1-9]\d{9,14}$/.test(phoneNumber)) nextErrors.phoneNumber = "Invalid phone number";
    if (!password) nextErrors.password = "Password is required";
    else if (password.length < 8) nextErrors.password = "Min. 8 characters";
    if (!confirm) nextErrors.confirm = "Please confirm password";
    else if (confirm !== password) nextErrors.confirm = "Passwords don't match";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const clearErr = (field: string) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const payload = { firstName, lastName, email, phoneNumber, password };

    try {
      const response = await registerCustomer(payload);
      const userId = response?.data?.user?.id ?? "";

      setRegisteredUserId(userId);
      setSuccessMessage(
        response?.message || "Account created. Please verify your code to continue."
      );
      setSuccessModalVisible(true);
    } catch (err: any) {
      setErrors({
        general: err?.message ?? "We could not create your account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onFirstNameChange = (value: string) => {
    setFirstName(value);
    clearErr("firstName");
  };

  const onLastNameChange = (value: string) => {
    setLastName(value);
    clearErr("lastName");
  };

  const onEmailChange = (value: string) => {
    setEmail(value);
    clearErr("email");
  };

  const onPhoneChange = (value: string) => {
    setPhoneNumber(value);
    clearErr("phoneNumber");
  };

  const onPasswordChange = (value: string) => {
    setPassword(value);
    clearErr("password");
  };

  const onConfirmChange = (value: string) => {
    setConfirm(value);
    clearErr("confirm");
  };

  const handleContinueToVerification = () => {
    setSuccessModalVisible(false);
    router.replace({
      pathname: "/(auth)/verify-customer",
      params: { userId: registeredUserId, email, phoneNumber },
    });
  };

  return (
    <View style={dynamicStyles.root}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.topBarBg} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={dynamicStyles.scroll}
        >
          <View style={dynamicStyles.brandWrap}>
            <View style={dynamicStyles.logoRow}>
              <Text style={dynamicStyles.logoFix}>EIV</Text>
              <Text style={dynamicStyles.logoGlobal}>VER</Text>
            </View>
          </View>

          <View style={dynamicStyles.headBlock}>
            <View style={dynamicStyles.pill}>
              <View style={dynamicStyles.pillDot} />
              <Text style={dynamicStyles.pillText}>WELCOME TO EIVVER</Text>
            </View>
            <Text style={dynamicStyles.headline}>Join{"\n"}Us Now</Text>
            <Text style={dynamicStyles.subline}>Your trusted fixers are waiting.</Text>
          </View>

          <SignupFormCard
            firstName={firstName}
            lastName={lastName}
            email={email}
            phoneNumber={phoneNumber}
            password={password}
            confirm={confirm}
            showPw={showPw}
            showCpw={showCpw}
            errors={errors}
            generalError={errors.general}
            loading={loading}
            onFirstNameChange={onFirstNameChange}
            onLastNameChange={onLastNameChange}
            onEmailChange={onEmailChange}
            onPhoneChange={onPhoneChange}
            onPasswordChange={onPasswordChange}
            onConfirmChange={onConfirmChange}
            onTogglePassword={() => setShowPw((value) => !value)}
            onToggleConfirm={() => setShowCpw((value) => !value)}
            onSubmit={handleSignup}
          />

          <View style={dynamicStyles.footer}>
            <Text style={dynamicStyles.footerText}>Already have an account?</Text>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text style={dynamicStyles.footerLink}>Sign in</Text>
            </Pressable>
          </View>

          <View style={dynamicStyles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalCard}>
            <View style={dynamicStyles.modalIcon}>
              <Text style={dynamicStyles.modalIconText}>✓</Text>
            </View>
            <Text style={dynamicStyles.modalTitle}>Account created</Text>
            <Text style={dynamicStyles.modalText}>{successMessage}</Text>
            <Pressable style={dynamicStyles.modalButton} onPress={handleContinueToVerification}>
              {loading ? (
                <ActivityIndicator color={colors.panel} />
              ) : (
                <Text style={dynamicStyles.modalButtonText}>Continue to verification</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
