// app/profile/saved_addresses.tsx
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
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

// ── Types ─────────────────────────────────────────────────────────────────────
type AddressType = "home" | "work" | "other";

interface SavedAddress {
  id: string;
  label: string;
  type: AddressType;
  address: string;
  landmark?: string;
  isDefault: boolean;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const INITIAL_ADDRESSES: SavedAddress[] = [
  {
    id: "1",
    label: "Home",
    type: "home",
    address: "12 Bodija Estate, Ibadan, Oyo State",
    landmark: "Near Bodija Market",
    isDefault: true,
  },
  {
    id: "2",
    label: "Work",
    type: "work",
    address: "Plot 5, Ring Road, Ibadan, Oyo State",
    landmark: "Opposite IITA Gate",
    isDefault: false,
  },
  {
    id: "3",
    label: "Mum's Place",
    type: "other",
    address: "Orita-Mefa, Challenge, Ibadan, Oyo State",
    isDefault: false,
  },
];

// ── Type config ───────────────────────────────────────────────────────────────
const TYPE_META: Record<AddressType, { icon: string; label: string }> = {
  home: { icon: "home-outline", label: "Home" },
  work: { icon: "briefcase-outline", label: "Work" },
  other: { icon: "location-outline", label: "Other" },
};

const BLANK: { label: string; type: AddressType; address: string; landmark: string } = {
  label: "", type: "home", address: "", landmark: "",
};

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function SavedAddressesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [addresses, setAddresses] = useState<SavedAddress[]>(INITIAL_ADDRESSES);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(BLANK);

  const openAdd = () => {
    setEditingId(null);
    setForm(BLANK);
    setModalVisible(true);
  };

  const openEdit = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setForm({ label: addr.label, type: addr.type, address: addr.address, landmark: addr.landmark ?? "" });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!form.label.trim() || !form.address.trim()) {
      Alert.alert("Missing info", "Please fill in the label and full address.");
      return;
    }
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => a.id === editingId ? { ...a, ...form, landmark: form.landmark || undefined } : a)
      );
    } else {
      setAddresses((prev) => [
        ...prev,
        { id: Date.now().toString(), ...form, landmark: form.landmark || undefined, isDefault: prev.length === 0 },
      ]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Remove Address", "Are you sure you want to remove this address?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => setAddresses((prev) => prev.filter((a) => a.id !== id)) },
    ]);
  };

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={["top"]}>

      {/* ── TopBar ─────────────────────────────────────────────── */}
      <TopBar
        location="Saved Addresses"
        notificationCount={0}
        initials="JD"
        onNotificationPress={() => router.push("/(tabs)/notifications")}
        onLocationPress={() => router.push("/(tabs)/settings")}
        onAvatarPress={() => router.push("/(tabs)/profile")}
      />

      {/* ── Page header row ────────────────────────────────────── */}
      <View style={[styles.pageHeader, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="arrow-back" size={20} color={colors.icon} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Saved Addresses</Text>
        <Pressable onPress={openAdd} style={[styles.addBtn, { backgroundColor: colors.icon }]}>
          <Ionicons name="add" size={20} color={colors.card} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Hero strip ─────────────────────────────────────────── */}
        <View style={[styles.heroBanner, { backgroundColor: colors.hero }]}>
          <View style={[styles.heroBlob, { backgroundColor: colors.accent + "18" }]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>Your Locations</Text>
            <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
              Saved spots for faster booking — pros come to you.
            </Text>
          </View>
          <View style={[styles.heroPill, { backgroundColor: colors.accent + "22", borderColor: colors.accent + "44" }]}>
            <View style={[styles.heroDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.heroPillText, { color: colors.accent }]}>{addresses.length} Saved</Text>
          </View>
        </View>

        {/* ── Address cards ──────────────────────────────────────── */}
        {addresses.length === 0 ? (
          <EmptyState onAdd={openAdd} />
        ) : (
          <>
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                addr={addr}
                onEdit={() => openEdit(addr)}
                onDelete={() => handleDelete(addr.id)}
                onSetDefault={() => setDefault(addr.id)}
              />
            ))}

            {/* Ghost add card */}
            <Pressable
              style={[styles.ghostCard, { borderColor: colors.icon + "55" }]}
              onPress={openAdd}
            >
              <View style={[styles.ghostIcon, { backgroundColor: colors.surface }]}>
                <Ionicons name="add" size={22} color={colors.icon} />
              </View>
              <Text style={[styles.ghostText, { color: colors.icon }]}>Add New Address</Text>
            </Pressable>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Add / Edit Modal ──────────────────────────────────────── */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <AddressForm
            form={form}
            setForm={setForm}
            editingId={editingId}
            onSave={handleSave}
            onClose={() => setModalVisible(false)}
          />
        </KeyboardAvoidingView>
      </Modal>

      <Navbar />
    </SafeAreaView>
  );
}

// ── AddressCard ───────────────────────────────────────────────────────────────
function AddressCard({
  addr, onEdit, onDelete, onSetDefault,
}: {
  addr: SavedAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  const { colors } = useTheme();
  const meta = TYPE_META[addr.type];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Default ribbon */}
      {addr.isDefault && (
        <View style={[styles.defaultRibbon, { backgroundColor: colors.accent }]}>
          <Text style={[styles.defaultRibbonText, { color: colors.card }]}>Default</Text>
        </View>
      )}

      <View style={styles.cardTop}>
        {/* Icon */}
        <View style={[styles.cardIconBox, { backgroundColor: colors.surface }]}>
          <Ionicons name={meta.icon as any} size={22} color={colors.icon} />
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardLabel, { color: colors.textPrimary }]}>{addr.label}</Text>
          <Text style={[styles.cardTypeBadgeText, { color: colors.accent }]}>{meta.label}</Text>
          <Text style={[styles.cardAddress, { color: colors.textSecondary }]}>{addr.address}</Text>
          {addr.landmark ? (
            <Text style={[styles.cardLandmark, { color: colors.muted }]}>📍 {addr.landmark}</Text>
          ) : null}
        </View>
      </View>

      {/* Actions */}
      <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
        {!addr.isDefault && (
          <Pressable style={[styles.actionChip, { backgroundColor: colors.cardAlt }]} onPress={onSetDefault}>
            <Ionicons name="star-outline" size={14} color={colors.accent} />
            <Text style={[styles.actionChipText, { color: colors.accent }]}>Set Default</Text>
          </Pressable>
        )}
        <View style={styles.actionIconRow}>
          <Pressable style={[styles.actionIconBtn, { backgroundColor: colors.surface }]} onPress={onEdit}>
            <Ionicons name="pencil-outline" size={17} color={colors.icon} />
          </Pressable>
          <Pressable style={[styles.actionIconBtn, { backgroundColor: colors.surface }]} onPress={onDelete}>
            <Ionicons name="trash-outline" size={17} color={colors.danger} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ── AddressForm (modal sheet) ─────────────────────────────────────────────────
function AddressForm({
  form, setForm, editingId, onSave, onClose,
}: {
  form: typeof BLANK;
  setForm: React.Dispatch<React.SetStateAction<typeof BLANK>>;
  editingId: string | null;
  onSave: () => void;
  onClose: () => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.sheet, { backgroundColor: colors.panel }]}>
      <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

      <View style={styles.sheetHeader}>
        <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>
          {editingId ? "Edit Address" : "Add New Address"}
        </Text>
        <Pressable onPress={onClose} style={[styles.sheetCloseBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="close" size={18} color={colors.icon} />
        </Pressable>
      </View>

      {/* Type selector */}
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Type</Text>
      <View style={styles.typeRow}>
        {(["home", "work", "other"] as AddressType[]).map((t) => {
          const active = form.type === t;
          const meta = TYPE_META[t];
          return (
            <Pressable
              key={t}
              style={[
                styles.typeChip,
                { backgroundColor: active ? colors.icon : colors.surface },
              ]}
              onPress={() => setForm((f) => ({ ...f, type: t }))}
            >
              <Ionicons name={meta.icon as any} size={15} color={active ? colors.card : colors.icon} />
              <Text style={[styles.typeChipText, { color: active ? colors.card : colors.icon }]}>
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Label */}
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Label</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
        placeholder="e.g. Mum's Place"
        placeholderTextColor={colors.muted}
        value={form.label}
        onChangeText={(v) => setForm((f) => ({ ...f, label: v }))}
      />

      {/* Full address */}
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Full Address</Text>
      <TextInput
        style={[styles.input, styles.inputTall, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
        placeholder="Street, area, city, state"
        placeholderTextColor={colors.muted}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        value={form.address}
        onChangeText={(v) => setForm((f) => ({ ...f, address: v }))}
      />

      {/* Landmark */}
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Landmark (optional)</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
        placeholder="e.g. Near GTBank, Behind stadium"
        placeholderTextColor={colors.muted}
        value={form.landmark}
        onChangeText={(v) => setForm((f) => ({ ...f, landmark: v }))}
      />

      {/* Save */}
      <Pressable style={[styles.saveBtn, { backgroundColor: colors.icon }]} onPress={onSave}>
        <Ionicons name="checkmark" size={18} color={colors.card} />
        <Text style={[styles.saveBtnText, { color: colors.card }]}>
          {editingId ? "Save Changes" : "Add Address"}
        </Text>
      </Pressable>
    </View>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.emptyBlob, { backgroundColor: colors.surface }]} />
      <View style={[styles.emptyIconBox, { backgroundColor: colors.surface }]}>
        <Ionicons name="location-outline" size={36} color={colors.accent} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Saved Addresses</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Add your home, work, or other locations so pros can find you faster.
      </Text>
      <Pressable style={[styles.emptyBtn, { backgroundColor: colors.icon }]} onPress={onAdd}>
        <Ionicons name="add" size={16} color={colors.card} />
        <Text style={[styles.emptyBtnText, { color: colors.card }]}>Add Your First Address</Text>
      </Pressable>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 24 },

  // Page header
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  // Hero
  heroBanner: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    marginBottom: 20,
    minHeight: 80,
  },
  heroBlob: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    top: -45,
    right: -25,
  },
  heroTitle: { fontSize: 17, fontWeight: "900", letterSpacing: -0.4, marginBottom: 4 },
  heroSub: { fontSize: 13, fontWeight: "500", lineHeight: 18, maxWidth: 200 },
  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  heroDot: { width: 7, height: 7, borderRadius: 4 },
  heroPillText: { fontSize: 12, fontWeight: "800" },

  // Card
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
    overflow: "hidden",
  },
  defaultRibbon: {
    position: "absolute",
    top: 14,
    right: -1,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  defaultRibbonText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.3 },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 14 },
  cardIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: { fontSize: 16, fontWeight: "800", letterSpacing: -0.3, marginBottom: 2 },
  cardTypeBadgeText: { fontSize: 12, fontWeight: "700", marginBottom: 4 },
  cardAddress: { fontSize: 13, lineHeight: 18, fontWeight: "500" },
  cardLandmark: { fontSize: 12, marginTop: 4, fontStyle: "italic" },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  actionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  actionChipText: { fontSize: 12, fontWeight: "700" },
  actionIconRow: { flexDirection: "row", gap: 8 },
  actionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // Ghost add card
  ghostCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: "dashed",
    padding: 18,
    gap: 14,
    marginBottom: 14,
  },
  ghostIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostText: { fontSize: 15, fontWeight: "700" },

  // Empty
  emptyCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 36,
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 14,
  },
  emptyBlob: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -80,
    right: -60,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 17, fontWeight: "800", marginBottom: 8, letterSpacing: -0.3 },
  emptyText: { fontSize: 14, textAlign: "center", lineHeight: 20, fontWeight: "500", marginBottom: 24 },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  emptyBtnText: { fontSize: 14, fontWeight: "800" },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 44,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sheetTitle: { fontSize: 20, fontWeight: "900", letterSpacing: -0.4 },
  sheetCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // Form
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    fontWeight: "500",
    borderWidth: 1,
  },
  inputTall: { minHeight: 82 },
  typeRow: { flexDirection: "row", gap: 10 },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  typeChipText: { fontSize: 13, fontWeight: "700" },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 24,
  },
  saveBtnText: { fontWeight: "800", fontSize: 15 },
});