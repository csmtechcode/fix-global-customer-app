import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, styles } from "./signupStyles";

export default function SignupHeader() {
    return (
        <View style={styles.header}>
            <View style={styles.logoRow}>
                <Text style={styles.logo}>EIVVER</Text>
                <View style={styles.logoStatus}>
                    <View style={styles.logoStatusDot} />
                    <Text style={styles.logoStatusText}>HOME SERVICES</Text>
                </View>
            </View>

            <View style={styles.headerRule}>
                <View style={styles.headerRuleAccent} />
                <View style={styles.headerRuleLine} />
            </View>

            <View style={styles.headBlock}>
                <View style={styles.eyebrowRow}>
                    <View style={styles.eyebrowIcon}>
                        <Ionicons
                            name="person-add-outline"
                            size={14}
                            color={COLORS.signal}
                        />
                    </View>
                    <Text style={styles.eyebrow}>NEW ACCOUNT</Text>
                </View>

                <Text style={styles.headline}>
                    Join{"\n"}
                    <Text style={styles.headlineAccent}>EIVVER.</Text>
                </Text>

                <Text style={styles.subline}>
                    Trusted fixers, one tap away.
                </Text>
            </View>
        </View>
    );
}