import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../context/ThemeContext";
import { getCategories, ServiceCategory } from "@/src/features/auth/api";

const { width } = Dimensions.get("window");

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
    wrench: "water-outline",
    zap: "flash-outline",
    brush: "color-palette-outline",
    sparkles: "sparkles-outline",
    hammer: "hammer-outline",
    snowflake: "snow-outline",
    shield: "shield-outline",
};

interface Props {
    onSelectCategory: (category: ServiceCategory) => void;
    onBookNow?: () => void;
}

function isServiceCategory(value: unknown): value is ServiceCategory {
    if (!value || typeof value !== "object") return false;

    const category = value as Partial<ServiceCategory>;

    return (
        typeof category.id === "string" &&
        typeof category.name === "string"
    );
}

function extractCategories(response: unknown): ServiceCategory[] {
    if (Array.isArray(response)) {
        return response.filter(isServiceCategory);
    }

    if (!response || typeof response !== "object") {
        return [];
    }

    const payload = response as {
        categories?: unknown;
        data?: unknown;
    };

    if (Array.isArray(payload.categories)) {
        return payload.categories.filter(isServiceCategory);
    }

    if (Array.isArray(payload.data)) {
        return payload.data.filter(isServiceCategory);
    }

    if (payload.data && typeof payload.data === "object") {
        const nested = payload.data as {
            categories?: unknown;
        };

        if (Array.isArray(nested.categories)) {
            return nested.categories.filter(isServiceCategory);
        }
    }

    return [];
}

export default function ServicesGrid({ onSelectCategory }: Props) {
    const { colors } = useTheme();

    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const loadCategories = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getCategories();
                const nextCategories = extractCategories(response);

                if (!mounted) return;

                setCategories(nextCategories);

                if (nextCategories.length === 0) {
                    setError("No services are available right now.");
                }
            } catch (err: unknown) {
                if (!mounted) return;

                setCategories([]);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Could not load services"
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        void loadCategories();

        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <ActivityIndicator
                accessibilityLabel="Loading services"
                color={colors.accent}
                style={styles.loader}
            />
        );
    }

    if (error) {
        return (
            <View style={styles.emptyState}>
                <Text
                    style={[
                        styles.error,
                        { color: colors.textSecondary },
                    ]}
                >
                    {error}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.grid}>
            {categories.map((category) => {
                const iconName =
                    ICON_MAP[category.icon] ?? "construct-outline";

                return (
                    <Pressable
                        key={category.id}
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${category.name}`}
                        style={({ pressed }) => [
                            styles.chip,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                            pressed && styles.chipPressed,
                        ]}
                        onPress={() => onSelectCategory(category)}
                    >
                        <View
                            style={[
                                styles.iconBox,
                                {
                                    backgroundColor:
                                        colors.surface,
                                },
                            ]}
                        >
                            <Ionicons
                                name={iconName}
                                size={22}
                                color={colors.accent}
                            />
                        </View>

                        <Text
                            numberOfLines={1}
                            style={[
                                styles.label,
                                {
                                    color: colors.textPrimary,
                                },
                            ]}
                        >
                            {category.name}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    loader: {
        marginVertical: 24,
    },

    emptyState: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 16,
        gap: 8,
    },

    chip: {
        width: (width - 56) / 4,
        alignItems: "center",
        gap: 8,
        paddingVertical: 10,
        borderRadius: 18,
        borderWidth: 1,
    },

    chipPressed: {
        opacity: 0.82,
        transform: [{ scale: 0.98 }],
    },

    iconBox: {
        width: 54,
        height: 54,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },

    label: {
        fontSize: 11,
        fontWeight: "700",
        textAlign: "center",
    },

    error: {
        fontSize: 13,
        lineHeight: 18,
    },
});