import React from "react";
import { Text, View } from "react-native";
import Field from "./SignupField";
import SignupActions from "./SignupActions";
import PhoneField from "./PhoneField";
import { styles } from "./signupStyles";

interface SignupFormCardProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirm: string;
  showPw: boolean;
  showCpw: boolean;
  errors: Record<string, string>;
  generalError?: string;
  loading: boolean;

  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  onTogglePassword: () => void;
  onToggleConfirm: () => void;
  onSubmit: () => void;
}

export default function SignupFormCard({
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
  confirm,
  showPw,
  showCpw,
  errors,
  generalError,
  loading,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onConfirmChange,
  onTogglePassword,
  onToggleConfirm,
  onSubmit,
}: SignupFormCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRule}>
        <View style={styles.cardTopRuleAccent} />
        <Text style={styles.cardEyebrow}>ACCOUNT DETAILS</Text>
        <View style={styles.cardTopRuleLine} />
      </View>

      {generalError ? (
        <View
          accessibilityRole="alert"
          style={styles.generalError}
        >
          <IoniconError />
          <Text style={styles.generalErrorText}>{generalError}</Text>
        </View>
      ) : null}

      <Field
        label="First Name"
        value={firstName}
        onChangeText={onFirstNameChange}
        placeholder="John"
        autoCapitalize="words"
        error={errors.firstName}
        editable={!loading}
      />

      <Field
        label="Last Name"
        value={lastName}
        onChangeText={onLastNameChange}
        placeholder="Doe"
        autoCapitalize="words"
        error={errors.lastName}
        editable={!loading}
      />

      <PhoneField
        label="Phone Number"
        value={phoneNumber}
        onChangeText={onPhoneChange}
        error={errors.phoneNumber}
        editable={!loading}
      />

      <Field
        label="Email Address"
        value={email}
        onChangeText={onEmailChange}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.email}
        editable={!loading}
      />

      <Field
        label="Password"
        value={password}
        onChangeText={onPasswordChange}
        placeholder="Min. 8 characters"
        secure
        showToggle
        showSecure={showPw}
        onToggleSecure={onTogglePassword}
        error={errors.password}
        editable={!loading}
      />

      <Field
        label="Confirm Password"
        value={confirm}
        onChangeText={onConfirmChange}
        placeholder="Re-enter password"
        secure
        showToggle
        showSecure={showCpw}
        onToggleSecure={onToggleConfirm}
        error={errors.confirm}
        editable={!loading}
      />

      <SignupActions loading={loading} onSubmit={onSubmit} />
    </View>
  );
}

function IoniconError() {
  return (
    <Text style={styles.generalErrorIcon} accessibilityElementsHidden>
      !
    </Text>
  );
}