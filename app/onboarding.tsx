import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// ─── Tokens ──────────────────────────────────────────────────────────────────
const BLUE = "#1A3C6E";
const GOLD = "#FFC300";

// ─── Slides ──────────────────────────────────────────────────────────────────
const slides = [
  {
    id: "1",
    label: "PROFESSIONALS",
    title: "Find Trusted\nFixers",
    desc: "Connect with verified, background-checked professionals near you — from plumbers to painters.",
    icon: "search" as const,
    iconColor: BLUE,
    stats: [
      { value: "500+", caption: "Pros nearby" },
      { value: "4.9★", caption: "Avg rating" },
      { value: "2 min", caption: "Response" },
    ],
    shapeA: "#DDEAFD",
    shapeB: "#C5D8FB",
    cardBg: "#EEF4FD",
    labelBg: "#DDEAFD",
    labelColor: BLUE,
    dotColor: BLUE,
  },
  {
    id: "2",
    label: "BOOKING",
    title: "Book in\nSeconds",
    desc: "Pick a time slot, choose your pro and confirm your home service is locked in.",
    icon: "calendar" as const,
    iconColor: "#B8860B",
    stats: [
      { value: "12 min", caption: "Avg booking" },
      { value: "24/7", caption: "Available" },
      { value: "0 calls", caption: "Needed" },
    ],
    shapeA: "#FDF3D0",
    shapeB: "#FAE9A0",
    cardBg: "#FDF6DC",
    labelBg: "#FDF3D0",
    labelColor: "#8B6914",
    dotColor: GOLD,
  },
  {
    id: "3",
    label: "PAYMENTS",
    title: "Pay Safe,\nStay Protected",
    desc: "Money is only released after you confirm the job is done. Zero risk, full peace of mind.",
    icon: "shield-checkmark" as const,
    iconColor: "#1A9E6A",
    stats: [
      { value: "100%", caption: "Secure" },
      { value: "0 leaks", caption: "Data safe" },
      { value: "Insured", caption: "Every job" },
    ],
    shapeA: "#D6F0E8",
    shapeB: "#B4E3D2",
    cardBg: "#E5F5EE",
    labelBg: "#D6F0E8",
    labelColor: "#0E5C3A",
    dotColor: "#1A9E6A",
  },
];

// ─── Visual Component ────────────────────────────────────────────────────────
function SlideVisual({
  slide,
  index,
}: {
  slide: (typeof slides)[0];
  index: number;
}) {
  return (
    <View style={styles.visual}>
      {/* Background Shapes */}
      <View style={[styles.blobA, { backgroundColor: slide.shapeA }]} />
      <View style={[styles.blobB, { backgroundColor: slide.shapeB }]} />

      {/* Label Pill */}
      <View style={[styles.labelPill, { backgroundColor: slide.labelBg }]}>
        <View style={[styles.labelDot, { backgroundColor: slide.dotColor }]} />
        <Text style={[styles.labelText, { color: slide.labelColor }]}>
          {slide.label}
        </Text>
      </View>

      {/* Main Visual */}
      {index === 0 ? (
        <Image
          source={require("../assets/images/customer-fix.jpg")}
          style={styles.mainImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.iconCard, { backgroundColor: slide.cardBg }]}>
          <Ionicons name={slide.icon} size={72} color={slide.iconColor} />
        </View>
      )}

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {slide.stats.map((stat, i) => (
          <View
            key={i}
            style={[styles.statCard, { backgroundColor: "#FFFFFF" }]}
          >
            <Text style={[styles.statValue, { color: slide.dotColor }]}>
              {stat.value}
            </Text>
            <Text style={styles.statCaption}>{stat.caption}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const dotScales = useRef(
    slides.map((_, i) => new Animated.Value(i === 0 ? 1.4 : 1)),
  ).current;

  const slide = slides[currentIndex];

  // Animate on index change
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 380,
      useNativeDriver: true,
    }).start();

    dotScales.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === currentIndex ? 1.4 : 1,
        friction: 7,
        tension: 130,
        useNativeDriver: true,
      }).start();
    });
    // }, [currentIndex]);
  }, [currentIndex, fadeAnim, dotScales]);

  const navigateTo = (index: number) => {
    if (index < 0 || index >= slides.length) return;
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      navigateTo(currentIndex + 1);
    } else {
      router.replace("/(auth)/signup");
    }
  };

  const goPrev = () => currentIndex > 0 && navigateTo(currentIndex - 1);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === slides.length - 1;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.logo}>
          Fix<Text style={styles.logoGold}>Global</Text>
        </Text>
        {!isLast && (
          <Pressable
            style={styles.skipBtn}
            onPress={() => router.replace("/(auth)/signup")}
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}
      </View>

      {/* Visual Section */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <SlideVisual slide={slide} index={currentIndex} />
      </Animated.View>

      {/* Hidden FlatList for Swiping */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          if (newIndex !== currentIndex) setCurrentIndex(newIndex);
        }}
        style={styles.hiddenList}
        renderItem={() => <View style={{ width }} />}
      />

      {/* Title + Description */}
      <Animated.View style={[styles.textBlock, { opacity: fadeAnim }]}>
        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideDesc}>{slide.desc}</Text>
      </Animated.View>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <Pressable key={i} onPress={() => navigateTo(i)}>
            <Animated.View
              style={[
                styles.dot,
                i === currentIndex && {
                  backgroundColor: slides[i].dotColor,
                  width: 32,
                },
                { transform: [{ scale: dotScales[i] }] },
              ]}
            />
          </Pressable>
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navRow}>
        <Pressable
          onPress={goPrev}
          disabled={isFirst}
          style={[
            styles.navBtn,
            styles.prevBtn,
            isFirst && styles.prevDisabled,
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={18}
            color={isFirst ? "#B0BEC5" : BLUE}
          />
          <Text style={[styles.navLabel, isFirst && { color: "#B0BEC5" }]}>
            Previous
          </Text>
        </Pressable>

        <Pressable
          onPress={goNext}
          style={[
            styles.navBtn,
            isLast ? styles.getStartedBtn : styles.nextBtn,
          ]}
        >
          <Text style={styles.nextLabel}>
            {isLast ? "Get Started" : "Next"}
          </Text>
          <Ionicons
            name={isLast ? "rocket-outline" : "chevron-forward"}
            size={18}
            color="#fff"
            style={{ marginLeft: 6 }}
          />
        </Pressable>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 54,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  logo: { fontSize: 22, fontWeight: "900", color: BLUE, letterSpacing: -0.5 },
  logoGold: { color: GOLD },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: GOLD,
  },
  skipText: { color: GOLD, fontWeight: "700", fontSize: 13.5 },

  // Visual
  visual: {
    height: height * 0.42,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginTop: 10,
  },
  blobA: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    top: -20,
    opacity: 0.85,
  },
  blobB: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    top: 60,
    right: 30,
    opacity: 0.7,
  },

  labelPill: {
    position: "absolute",
    top: 26,
    left: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 30,
  },
  labelDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  labelText: { fontSize: 12, fontWeight: "800", letterSpacing: 1 },

  mainImage: {
    width: width - 48,
    height: 255,
    borderRadius: 24,
    marginTop: 20,
  },

  iconCard: {
    width: 138,
    height: 138,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    marginTop: 30,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    position: "absolute",
    bottom: 12,
  },
  statCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: { fontSize: 17, fontWeight: "800" },
  statCaption: { fontSize: 11.5, color: "#64748B", marginTop: 2 },

  // Text Content
  textBlock: { paddingHorizontal: 28, marginTop: 12 },
  slideTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: BLUE,
    lineHeight: 46,
    letterSpacing: -1,
    marginBottom: 12,
  },
  slideDesc: {
    fontSize: 15.5,
    lineHeight: 24,
    color: "#374151",
    fontWeight: "500",
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 9,
    marginTop: 32,
  },
  dot: {
    height: 8,
    borderRadius: 6,
    backgroundColor: "#CBD5E0",
    width: 8,
  },

  // Navigation
  navRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 14,
    marginTop: "auto",
    paddingBottom: 46,
  },
  navBtn: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  prevBtn: {
    borderWidth: 2,
    borderColor: BLUE,
    backgroundColor: "#fff",
  },
  prevDisabled: { borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" },
  nextBtn: {
    backgroundColor: GOLD,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  getStartedBtn: {
    backgroundColor: BLUE,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  navLabel: { fontSize: 15.5, fontWeight: "700", color: BLUE },
  nextLabel: { color: "#fff", fontSize: 15.5, fontWeight: "800" },

  hiddenList: { height: 0, flexGrow: 0 },
});
