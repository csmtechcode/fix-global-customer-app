import React, { useState } from "react";
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

const BLUE = "#1A3C6E";
const WHITE = "#FFFFFF";
const LIGHT = "#F4F7FD";
const GREY = "#64748B";
const BORDER = "#EAF0FB";

const INITIAL_MESSAGES = [
  { id: "1", from: "support", text: "Hi there! How can we help you today?" },
  { id: "2", from: "user", text: "I need help with a booking change." },
  { id: "3", from: "support", text: "Sure — we can help with that. Tell us which booking you want to update." },
];

export default function LiveChatScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

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
    }, 900);
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={BLUE} />
        </Pressable>
        <Text style={styles.title}>Chat with Us</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.agentsCard}>
        <Text style={styles.agentLabel}>Support is online</Text>
        <Text style={styles.agentTitle}>FixGlobal Customer Care</Text>
        <Text style={styles.agentSubtitle}>
          Ask anything about your booking, payment, or provider.
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((item) => (
            <View
              key={item.id}
              style={[
                styles.messageBubble,
                item.from === "user" ? styles.userBubble : styles.supportBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.from === "user" ? styles.userText : styles.supportText,
                ]}
              >
                {item.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type your message"
            placeholderTextColor={GREY}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <Pressable style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={22} color={WHITE} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFD" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 18, fontWeight: "800", color: BLUE },
  headerSpacer: { width: 40 },
  agentsCard: {
    margin: 20,
    padding: 22,
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
  },
  agentLabel: { fontSize: 12, color: GREY, marginBottom: 6, fontWeight: "700" },
  agentTitle: { fontSize: 20, fontWeight: "900", color: BLUE, marginBottom: 4 },
  agentSubtitle: { fontSize: 14, color: GREY, lineHeight: 20 },
  chatArea: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
  messagesScroll: { flex: 1 },
  messagesContainer: { paddingVertical: 10 },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 18,
    padding: 14,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: BLUE,
  },
  supportBubble: {
    alignSelf: "flex-start",
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  messageText: { fontSize: 14, lineHeight: 20 },
  userText: { color: WHITE },
  supportText: { color: BLUE },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  input: {
    flex: 1,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: BLUE,
    minHeight: 48,
  },
  sendBtn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
});