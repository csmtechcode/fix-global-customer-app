import React, { useState, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../src/context/ThemeContext";
import TopBar from "../../src/components/layout/TopBar";
import Navbar from "../../src/components/layout/Navbar";

const INITIAL_MESSAGES = [
  { id: "1", from: "support", text: "Hi there! How can we help you today?" },
  { id: "2", from: "user", text: "I need help with a booking change." },
  { id: "3", from: "support", text: "Sure — we can help with that. Tell us which booking you want to update." },
];

export default function LiveChatScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), from: "user", text: message.trim() },
    ]);
    setMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-reply`,
          from: "support",
          text: "Thanks! A customer care specialist will get back to you shortly.",
        },
      ]);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 900);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={["top"]}>

      {/* ── TopBar ─────────────────────────────────────────────── */}
      <TopBar
        location="Live Chat"
        notificationCount={0}
        initials="JD"
        onNotificationPress={() => router.push("/(tabs)/notifications")}
        onLocationPress={() => router.push("/(tabs)/settings")}
        onAvatarPress={() => router.push("/(tabs)/profile")}
      />

      {/* ── Back + page title row ──────────────────────────────── */}
      <View style={[styles.pageHeader, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.icon} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Chat with Us</Text>
        {/* Online indicator */}
        <View style={[styles.onlinePill, { backgroundColor: colors.success + "22" }]}>
          <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.onlineText, { color: colors.success }]}>Online</Text>
        </View>
      </View>

      {/* ── Support card ──────────────────────────────────────── */}
      <View style={[styles.agentsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.agentLabel, { color: colors.textSecondary }]}>Support is online</Text>
        <Text style={[styles.agentTitle, { color: colors.textPrimary }]}>FixGlobal Customer Care</Text>
        <Text style={[styles.agentSubtitle, { color: colors.textSecondary }]}>
          Ask anything about your booking, payment, or provider.
        </Text>
      </View>

      {/* ── Chat area ─────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((item) => (
            <View
              key={item.id}
              style={[
                styles.messageBubble,
                item.from === "user"
                  ? [styles.userBubble, { backgroundColor: colors.icon }]
                  : [styles.supportBubble, { backgroundColor: colors.card, borderColor: colors.border }],
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.from === "user"
                    ? { color: colors.card }
                    : { color: colors.textPrimary },
                ]}
              >
                {item.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* ── Input row ─────────────────────────────────────────── */}
        <View style={[styles.inputRow, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textPrimary }]}
            placeholder="Type your message..."
            placeholderTextColor={colors.muted}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <Pressable
            style={[styles.sendBtn, { backgroundColor: colors.icon, opacity: message.trim() ? 1 : 0.5 }]}
            onPress={handleSend}
          >
            <Ionicons name="send" size={20} color={colors.card} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* ── Navbar ────────────────────────────────────────────── */}
      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Page header row ──
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  onlinePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  onlineText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // ── Support card ──
  agentsCard: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  agentLabel: { fontSize: 12, marginBottom: 4, fontWeight: "700" },
  agentTitle: { fontSize: 18, fontWeight: "900", marginBottom: 4, letterSpacing: -0.3 },
  agentSubtitle: { fontSize: 13, lineHeight: 20, fontWeight: "500" },

  // ── Chat ──
  chatArea: { flex: 1, paddingHorizontal: 20 },
  messagesScroll: { flex: 1 },
  messagesContainer: { paddingVertical: 14, gap: 10 },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 18,
    padding: 14,
  },
  userBubble: { alignSelf: "flex-end" },
  supportBubble: { alignSelf: "flex-start", borderWidth: 1 },
  messageText: { fontSize: 14, lineHeight: 20, fontWeight: "500" },

  // ── Input ──
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "500",
    minHeight: 48,
    maxHeight: 120,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});