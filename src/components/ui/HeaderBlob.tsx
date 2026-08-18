import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export function HeaderBlob() {
    return (
        <View style={styles.blobContainer} pointerEvents="none">
            <View style={styles.blobA} />
            <View style={styles.blobB} />
            <View style={styles.blobC} />
        </View>
    );
}

const styles = StyleSheet.create({
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
        width: width * 0.75,
        height: width * 0.75,
        borderRadius: width * 0.375,
        backgroundColor: "#DDEAFD",
        top: -width * 0.3,
        right: -width * 0.1,
    },
    blobB: {
        position: "absolute",
        width: width * 0.45,
        height: width * 0.45,
        borderRadius: width * 0.225,
        backgroundColor: "#FFF3C4",
        top: -width * 0.05,
        left: -width * 0.1,
        opacity: 0.7,
    },
    blobC: {
        position: "absolute",
        width: width * 0.3,
        height: width * 0.3,
        borderRadius: width * 0.15,
        backgroundColor: "#C5D8FB",
        top: width * 0.2,
        right: width * 0.05,
        opacity: 0.5,
    },
});