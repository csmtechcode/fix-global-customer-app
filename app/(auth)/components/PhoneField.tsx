import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    Modal,
    FlatList,
    StyleSheet,
} from "react-native";

const BLUE = "#1A3C6E";
const LIGHT = "#F4F7FD";
const BORDER = "#DDE4F0";
const PLACEHOLDER = "#8FA0B8";
const ERROR = "#E84040";

const COUNTRIES = [
    { name: "Nigeria", code: "NG", dial: "+234", flag: "🇳🇬" },
    { name: "Ghana", code: "GH", dial: "+233", flag: "🇬🇭" },
    { name: "Kenya", code: "KE", dial: "+254", flag: "🇰🇪" },
    { name: "South Africa", code: "ZA", dial: "+27", flag: "🇿🇦" },
    { name: "Cameroon", code: "CM", dial: "+237", flag: "🇨🇲" },
    { name: "Ivory Coast", code: "CI", dial: "+225", flag: "🇨🇮" },
    { name: "Senegal", code: "SN", dial: "+221", flag: "🇸🇳" },
    { name: "Egypt", code: "EG", dial: "+20", flag: "🇪🇬" },
    { name: "United States", code: "US", dial: "+1", flag: "🇺🇸" },
    { name: "Canada", code: "CA", dial: "+1", flag: "🇨🇦" },
    { name: "United Kingdom", code: "GB", dial: "+44", flag: "🇬🇧" },
    { name: "Germany", code: "DE", dial: "+49", flag: "🇩🇪" },
    { name: "France", code: "FR", dial: "+33", flag: "🇫🇷" },
    { name: "India", code: "IN", dial: "+91", flag: "🇮🇳" },
    { name: "United Arab Emirates", code: "AE", dial: "+971", flag: "🇦🇪" },
];

interface PhoneFieldProps {
    label?: string;
    /** Full E.164 value, e.g. "+2348012345678" */
    value: string;
    onChangeText: (fullNumber: string) => void;
    error?: string;
    editable?: boolean;
}

export default function PhoneField({
    label = "Phone Number",
    value,
    onChangeText,
    error,
    editable = true,
}: PhoneFieldProps) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const [search, setSearch] = useState("");

    const activeCountry = useMemo(() => {
        return (
            COUNTRIES.find((c) => value.startsWith(c.dial)) ?? COUNTRIES[0]
        );
    }, [value]);

    const localDigits = value.startsWith(activeCountry.dial)
        ? value.slice(activeCountry.dial.length)
        : value.replace(/^0+/, "");

    const filtered = COUNTRIES.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.dial.includes(search),
    );

    const handleLocalChange = (text: string) => {
        // strip a leading 0 too, since people type "08012345678" out of habit
        const digits = text.replace(/[^0-9]/g, "").replace(/^0+/, "");
        onChangeText(`${activeCountry.dial}${digits}`);
    };

    const handleSelectCountry = (dial: string) => {
        const country = COUNTRIES.find((c) => c.dial === dial) ?? COUNTRIES[0];
        setPickerOpen(false);
        setSearch("");
        onChangeText(`${country.dial}${localDigits}`);
    };

    return (
        <View style={styles.wrap}>
            {label ? <Text style={styles.label}>{label}</Text> : null}

            <View style={[styles.row, error && styles.rowError]}>
                <Pressable
                    style={styles.dialBtn}
                    onPress={() => editable && setPickerOpen(true)}
                    disabled={!editable}
                >
                    <Text style={styles.dialText}>
                        {activeCountry.flag} {activeCountry.dial}
                    </Text>
                    <Text style={styles.chevron}>▾</Text>
                </Pressable>

                <View style={styles.divider} />

                <TextInput
                    style={styles.input}
                    value={localDigits}
                    onChangeText={handleLocalChange}
                    placeholder="8012345678"
                    placeholderTextColor={PLACEHOLDER}
                    keyboardType="number-pad"
                    editable={editable}
                />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Modal
                visible={pickerOpen}
                transparent
                animationType="slide"
                onRequestClose={() => setPickerOpen(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setPickerOpen(false)}>
                    <Pressable style={styles.sheet} onPress={() => { }}>
                        <Text style={styles.sheetTitle}>Select country code</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search country or code"
                            placeholderTextColor={PLACEHOLDER}
                            value={search}
                            onChangeText={setSearch}
                        />
                        <FlatList
                            data={filtered}
                            keyExtractor={(item) => item.code}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.countryRow}
                                    onPress={() => handleSelectCountry(item.dial)}
                                >
                                    <Text style={styles.countryFlag}>{item.flag}</Text>
                                    <Text style={styles.countryName}>{item.name}</Text>
                                    <Text style={styles.countryDial}>{item.dial}</Text>
                                </Pressable>
                            )}
                            style={{ maxHeight: 340 }}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { marginBottom: 16 },
    label: { fontSize: 12, fontWeight: "700", color: BLUE, marginBottom: 7, letterSpacing: 0.3, textTransform: "uppercase" },
    row: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 52,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: BORDER,
        backgroundColor: LIGHT,
        paddingHorizontal: 12,
    },
    rowError: { borderColor: ERROR },
    dialBtn: { flexDirection: "row", alignItems: "center", paddingRight: 8 },
    dialText: { fontSize: 15, fontWeight: "700", color: BLUE },
    chevron: { fontSize: 10, color: PLACEHOLDER, marginLeft: 4 },
    divider: { width: 1, height: 24, backgroundColor: BORDER, marginHorizontal: 8 },
    input: { flex: 1, fontSize: 15, fontWeight: "600", color: BLUE, minHeight: 52, paddingVertical: 14 },
    errorText: { color: ERROR, fontSize: 12, fontWeight: "600", marginTop: 4 },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
    sheet: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 32,
    },
    sheetTitle: { fontSize: 16, fontWeight: "800", color: BLUE, marginBottom: 12 },
    searchInput: {
        height: 44,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: BORDER,
        backgroundColor: LIGHT,
        paddingHorizontal: 12,
        fontSize: 14,
        color: BLUE,
        marginBottom: 10,
    },
    countryRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
    },
    countryFlag: { fontSize: 20, marginRight: 10 },
    countryName: { flex: 1, fontSize: 14, fontWeight: "600", color: BLUE },
    countryDial: { fontSize: 14, fontWeight: "700", color: PLACEHOLDER },
});