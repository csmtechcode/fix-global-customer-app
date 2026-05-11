// app/profile/saved_addresses.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Brand tokens (same as profile.tsx) ──────────────────────────────────────
const BLUE = "#1A3C6E";
const GOLD = "#FFC300";
const WHITE = "#FFFFFF";
const LIGHT = "#F4F7FD";
const GREY = "#64748B";
const DANGER = "#EF4444";
const BORDER = "#EAF0FB";

// ── Types ────────────────────────────────────────────────────────────────────
type AddressType = "home" | "work" | "other";

interface SavedAddress {
  id: string;
  label: string;
  type: AddressType;
  address: string;
  landmark?: string;
  isDefault: boolean;
}

// ── Mock data (replace with API/store later) ─────────────────────────────────
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

// ── Icon + colour per address type ───────────────────────────────────────────
const TYPE_CONFIG: Record<
  AddressType,
  { icon: string; bg: string; color: string }
> = {
  home: { icon: "home-outline", bg: "#EEF4FD", color: BLUE },
  work: { icon: "briefcase-outline", bg: "#FFF8E1", color: "#B8860B" },
  other: { icon: "location-outline", bg: "#F0FDF4", color: "#16A34A" },
};

// ── Blank form ────────────────────────────────────────────────────────────────
const BLANK_FORM = {
  label: "",
  type: "home" as AddressType,
  address: "",
  landmark: "",
};

// ─────────────────────────────────────────────────────────────────────────────
export default function SavedAddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<SavedAddress[]>(INITIAL_ADDRESSES);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(BLANK_FORM);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null);
    setForm(BLANK_FORM);
    setModalVisible(true);
  };

  const openEdit = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label,
      type: addr.type,
      address: addr.address,
      landmark: addr.landmark ?? "",
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!form.label.trim() || !form.address.trim()) {
      Alert.alert("Missing info", "Please fill in the label and full address.");
      return;
    }

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, ...form, landmark: form.landmark || undefined }
            : a,
        ),
      );
    } else {
      const newAddr: SavedAddress = {
        id: Date.now().toString(),
        ...form,
        landmark: form.landmark || undefined,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddr]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Remove Address",
      "Are you sure you want to remove this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            setAddresses((prev) => prev.filter((a) => a.id !== id)),
        },
      ],
    );
  };

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={BLUE} />
        </Pressable>
        <Text style={styles.topBarTitle}>Saved Addresses</Text>
        <Pressable onPress={openAdd} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={WHITE} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
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

            {/* Add new — ghost card */}
            <Pressable style={styles.addGhostCard} onPress={openAdd}>
              <View style={styles.addGhostIcon}>
                <Ionicons name="add" size={24} color={BLUE} />
              </View>
              <Text style={styles.addGhostText}>Add New Address</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      {/* ── Add / Edit Modal ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        />
        <View style={styles.modalSheet}>
          {/* Handle */}
          <View style={styles.modalHandle} />

          <Text style={styles.modalTitle}>
            {editingId ? "Edit Address" : "Add New Address"}
          </Text>

          {/* Type selector */}
          <Text style={styles.fieldLabel}>Address Type</Text>
          <View style={styles.typeRow}>
            {(["home", "work", "other"] as AddressType[]).map((t) => {
              const cfg = TYPE_CONFIG[t];
              const active = form.type === t;
              return (
                <Pressable
                  key={t}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                  onPress={() => setForm((f) => ({ ...f, type: t }))}
                >
                  <Ionicons
                    name={cfg.icon as any}
                    size={16}
                    color={active ? WHITE : BLUE}
                  />
                  <Text
                    style={[
                      styles.typeChipText,
                      active && styles.typeChipTextActive,
                    ]}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Label */}
          <Text style={styles.fieldLabel}>Label</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Mum's Place"
            placeholderTextColor={GREY}
            value={form.label}
            onChangeText={(v) => setForm((f) => ({ ...f, label: v }))}
          />

          {/* Full Address */}
          <Text style={styles.fieldLabel}>Full Address</Text>
          <TextInput
            style={[styles.input, styles.inputTall]}
            placeholder="Street, area, city, state"
            placeholderTextColor={GREY}
            multiline
            numberOfLines={3}
            value={form.address}
            onChangeText={(v) => setForm((f) => ({ ...f, address: v }))}
          />

          {/* Landmark */}
          <Text style={styles.fieldLabel}>Landmark (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Near GTBank, Behind stadium"
            placeholderTextColor={GREY}
            value={form.landmark}
            onChangeText={(v) => setForm((f) => ({ ...f, landmark: v }))}
          />

          {/* Save */}
          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>
              {editingId ? "Save Changes" : "Add Address"}
            </Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function AddressCard({
  addr,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  addr: SavedAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  const cfg = TYPE_CONFIG[addr.type];
  return (
    <View style={styles.card}>
      {/* Icon + text */}
      <View style={styles.cardLeft}>
        <View style={[styles.cardIcon, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon as any} size={22} color={cfg.color} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.cardLabelRow}>
            <Text style={styles.cardLabel}>{addr.label}</Text>
            {addr.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardAddress}>{addr.address}</Text>
          {addr.landmark ? (
            <Text style={styles.cardLandmark}>📍 {addr.landmark}</Text>
          ) : null}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        {!addr.isDefault && (
          <Pressable style={styles.actionBtn} onPress={onSetDefault}>
            <Ionicons name="star-outline" size={18} color={GOLD} />
          </Pressable>
        )}
        <Pressable style={styles.actionBtn} onPress={onEdit}>
          <Ionicons name="pencil-outline" size={18} color={BLUE} />
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={onDelete}>
          <Ionicons name="trash-outline" size={18} color={DANGER} />
        </Pressable>
      </View>
    </View>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="location-outline" size={48} color={BLUE} />
      </View>
      <Text style={styles.emptyTitle}>No Saved Addresses</Text>
      <Text style={styles.emptySubtitle}>
        Add your home, work, or other locations so pros can find you faster.
      </Text>
      <Pressable style={styles.emptyBtn} onPress={onAdd}>
        <Text style={styles.emptyBtnText}>Add Your First Address</Text>
      </Pressable>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFD" },
  scroll: { padding: 20, paddingBottom: 40 },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
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
  topBarTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: BLUE,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },

  // Address card
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: BLUE,
  },
  defaultBadge: {
    backgroundColor: "#EEF4FD",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: BLUE,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: BLUE,
  },
  cardAddress: {
    fontSize: 13,
    color: GREY,
    lineHeight: 18,
  },
  cardLandmark: {
    fontSize: 12,
    color: GREY,
    marginTop: 4,
    fontStyle: "italic",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 10,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },

  // Add ghost card
  addGhostCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: BLUE,
    borderStyle: "dashed",
    padding: 16,
    gap: 12,
    marginBottom: 14,
  },
  addGhostIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EEF4FD",
    alignItems: "center",
    justifyContent: "center",
  },
  addGhostText: {
    fontSize: 15,
    fontWeight: "700",
    color: BLUE,
  },

  // Empty state
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EEF4FD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: BLUE,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: GREY,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  emptyBtn: {
    backgroundColor: BLUE,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  emptyBtnText: {
    color: WHITE,
    fontWeight: "700",
    fontSize: 15,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalSheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: BLUE,
    marginBottom: 20,
  },

  // Form
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: GREY,
    marginBottom: 8,
    marginTop: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: LIGHT,
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: BLUE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  inputTall: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  typeRow: {
    flexDirection: "row",
    gap: 10,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    backgroundColor: "#EEF4FD",
    borderWidth: 1,
    borderColor: BORDER,
  },
  typeChipActive: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: BLUE,
  },
  typeChipTextActive: {
    color: WHITE,
  },

  // Save button
  saveBtn: {
    backgroundColor: BLUE,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  saveBtnText: {
    color: WHITE,
    fontWeight: "800",
    fontSize: 16,
  },
});
