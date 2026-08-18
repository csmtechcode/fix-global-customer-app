import {
  Ionicons
} from "@expo/vector-icons";

import {
  useRouter
} from "expo-router";

import React,
{
  useCallback, useRef, useState
} from "react";

import {

  Platform,

  Pressable,

  StatusBar,

  StyleSheet,

  Text,

  View,

  useWindowDimensions,

  type ListRenderItemInfo,
} from "react-native";

import Animated,
{

  Extrapolate,

  interpolate,

  interpolateColor,

  runOnJS,

  useAnimatedScrollHandler,

  useAnimatedStyle,

  useSharedValue,

  withSpring,


  type SharedValue,
} from "react-native-reanimated";

import {
  SafeAreaView, useSafeAreaInsets
} from "react-native-safe-area-context";



// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — "service ticket" system for a home-services marketplace.
// Paper ground instead of clinical white; ink instead of corporate blue;
// three rotating job-accents instead of one repeated brand color.
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {

  ink: "#14181C", // primary text, logo, outlines

  inkSoft: "#3A4048", // secondary text on paper

  steel: "#7A828C", // captions, muted labels

  paper: "#F7F4EC", // app background

  paperCard: "#FFFDF8", // ticket surface, slightly lighter than bg

  line: "#DCD6C6", // hairline / dashed rule color

  amber: "#FF7A1A", // slide 1 — discovery

  signal: "#2B4C7E", // slide 2 — booking

  forest: "#1F6F4F", // slide 3 — payment protection
} as const;



const FONT = {

  mono: Platform.select({
    ios: "Courier New", android: "monospace", default: "monospace"
  }),
} as const;



const SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32
} as const;

const RADIUS = {
  sm: 10, md: 16, lg: 22, pill: 999
} as const;



// ─── Data Models ─────────────────────────────────────────────────────────────

export interface LineItem {

  readonly label: string;

  readonly value: string;
}



export interface SlideData {

  readonly id: string;

  readonly ticketNo: string; // e.g. "01 / 03"

  readonly stamp: string; // e.g. "VERIFIED"

  readonly icon: keyof typeof Ionicons.glyphMap;

  readonly accent: string;

  readonly title: string;

  readonly desc: string;

  readonly items: readonly LineItem[];
}



const SLIDES: readonly SlideData[] = [
  {

    id: "1",

    ticketNo: "01 / 03",

    stamp: "VERIFIED",

    icon: "search-outline",

    accent: COLORS.amber,

    title: "Every pro,\nbackground-checked.",

    desc: "Browse licensed plumbers, electricians, and painters near you. Real reviews from real neighbors — not stars bought in bulk.",

    items: [
      {
        label: "Active pros nearby", value: "500+"
      },
      {
        label: "Average rating", value: "4.9"
      },
      {
        label: "Typical reply time", value: "< 2 min"
      },
    ],
  },
  {

    id: "2",

    ticketNo: "02 / 03",

    stamp: "INSTANT",

    icon: "calendar-outline",

    accent: COLORS.signal,

    title: "Book it.\nNo phone tag.",

    desc: "Pick a time, describe the job, and you're on the calendar. No hold music, no back-and-forth quotes.",

    items: [
      {
        label: "Booking takes", value: "12 min"
      },
      {
        label: "Slots open", value: "24/7"
      },
      {
        label: "Phone calls needed", value: "Zero"
      },
    ],
  },
  {

    id: "3",

    ticketNo: "03 / 03",

    stamp: "PROTECTED",

    icon: "shield-checkmark-outline",

    accent: COLORS.forest,

    title: "Pay only when\nit's done right.",

    desc: "Your payment sits in escrow until you approve the work. If something's off, we hold it until it's fixed.",

    items: [
      {
        label: "Funds released on", value: "Your approval"
      },
      {
        label: "Jobs insured", value: "100%"
      },
      {
        label: "Disputes handled", value: "In-app"
      },
    ],
  },
] as const;



type AnimatedFlatListRef = React.ElementRef<typeof Animated.FlatList<SlideData>>;



// ─── Scale-feedback Pressable ────────────────────────────────────────────────

interface ScalePressableProps {

  onPress: () => void;

  disabled?: boolean;

  style?: object;

  children: React.ReactNode;
}



function ScalePressable({ onPress, disabled, style, children
}: ScalePressableProps) {

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value
      }
    ]
  }));



  return (

    <Animated.View style={animatedStyle
    }>

      <Pressable

        onPress={onPress
        }

        disabled={disabled
        }

        onPressIn={() => {

          scale.value = withSpring(0.96,
            {
              damping: 14, stiffness: 260
            });
        }
        }

        onPressOut={() => {

          scale.value = withSpring(1,
            {
              damping: 14, stiffness: 260
            });
        }
        }

        style={style
        }

      >

        {children
        }

      </Pressable>

    </Animated.View>

  );
}
// ─── Perforation row (ticket-stub edge) ──────────────────────────────────────

function Perforation() {

  const holes = Array.from({
    length: 14
  });

  return (

    <View style={styles.perfRow
    }>

      {holes.map((_, i) => (

        <View key={i
        } style={styles.perfHole
        } />

      ))
      }

    </View>

  );
}
// ─── Line item (receipt-style stat row with dotted leader) ──────────────────

function TicketLine({ label, value, accent
}: LineItem & {
  accent: string
}) {

  return (

    <View style={styles.lineRow
    }>

      <Text style={styles.lineLabel
      }>{label
        }</Text>

      <View style={styles.lineLeader
      } />

      <Text style={
        [styles.lineValue,
        {
          color: accent
        }
        ]
      }>{value
        }</Text>

    </View>

  );
}
// ─── Slide Item ──────────────────────────────────────────────────────────────

interface SlideItemProps {

  slide: SlideData;

  index: number;


  scrollX: SharedValue<number>;

  screenWidth: number;
}



function SlideItem({ slide, index, scrollX, screenWidth
}: SlideItemProps) {

  const inputRange = [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth
  ];



  const cardStyle = useAnimatedStyle(() => {

    const scale = interpolate(scrollX.value, inputRange,
      [
        0.93,
        1,
        0.93
      ], Extrapolate.CLAMP);

    const opacity = interpolate(scrollX.value, inputRange,
      [
        0.5,
        1,
        0.5
      ], Extrapolate.CLAMP);

    return {
      transform: [
        {
          scale
        }
      ], opacity
    };
  });



  const stampStyle = useAnimatedStyle(() => {

    const rotate = interpolate(scrollX.value, inputRange,
      [
        -2,
        -8,
        -2
      ], Extrapolate.CLAMP);

    const scale = interpolate(scrollX.value, inputRange,
      [
        0.85,
        1,
        0.85
      ], Extrapolate.CLAMP);

    return {
      transform: [
        {
          rotate: `${rotate
            }deg`
        },
        {
          scale
        }
      ]
    };
  });



  return (

    <View style={
      [styles.slide,
      {
        width: screenWidth
      }
      ]
    }>

      <Animated.View style={
        [styles.card, cardStyle
        ]
      }>

        <Perforation />



        <View style={styles.cardBody
        }>

          { /* Ticket header */}

          <View style={styles.ticketHeader
          }>

            <Text style={styles.ticketNo
            }>TICKET NO. {slide.ticketNo
              }</Text>

            <Animated.View

              style={
                [styles.stamp, stampStyle,
                {
                  borderColor: slide.accent
                }
                ]
              }

            >

              <Text style={
                [styles.stampText,
                {
                  color: slide.accent
                }
                ]
              }>{slide.stamp
                }</Text>

            </Animated.View>

          </View>



          { /* Icon roundel */}

          <View style={
            [styles.roundel,
            {
              borderColor: slide.accent
            }
            ]
          }>

            <Ionicons name={slide.icon
            } size={
              34
            } color={slide.accent
            } />

          </View>



          { /* Headline + body */}

          <Text style={styles.title
          }>{slide.title
            }</Text>

          <Text style={styles.desc
          }>{slide.desc
            }</Text>



          { /* Divider */}

          <View style={styles.divider
          } />



          { /* Line items */}

          <View style={styles.lineItems
          }>

            {slide.items.map((item) => (

              <TicketLine key={item.label
              } {...item
                } accent={slide.accent
                } />

            ))
            }

          </View>

        </View>



        <Perforation />

      </Animated.View>

    </View>

  );
}
// ─── Pagination Dots ─────────────────────────────────────────────────────────

interface DotProps {

  index: number;

  scrollX: SharedValue<number>;

  screenWidth: number;

  accent: string;

  onPress: () => void;
}



function Dot({ index, scrollX, screenWidth, accent, onPress
}: DotProps) {

  const inputRange = [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth
  ];



  const dotStyle = useAnimatedStyle(() => {

    const w = interpolate(scrollX.value, inputRange,
      [
        7,
        26,
        7
      ], Extrapolate.CLAMP);

    const backgroundColor = interpolateColor(scrollX.value, inputRange,
      [COLORS.line, accent, COLORS.line
      ]);

    return {
      width: w, backgroundColor
    };
  });



  return (

    <Pressable
      onPress={onPress
      }
      hitSlop={
        10
      }
      accessibilityRole="button"
      accessibilityLabel={`Go to onboarding slide ${index + 1
        }`
      }
    >

      <Animated.View style={
        [styles.dot, dotStyle
        ]
      } />

    </Pressable>

  );
}



interface PaginationDotsProps {

  slides: readonly SlideData[];

  scrollX: SharedValue<number>;

  screenWidth: number;

  onDotPress: (index: number) => void;
}



function PaginationDots({ slides, scrollX, screenWidth, onDotPress
}: PaginationDotsProps) {

  return (

    <View style={styles.dotsRow
    }>

      {slides.map((slide, i) => (

        <Dot

          key={slide.id
          }

          index={i
          }

          scrollX={scrollX
          }

          screenWidth={screenWidth
          }

          accent={slide.accent
          }

          onPress={() => onDotPress(i)
          }

        />

      ))
      }

    </View>

  );
}
// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function OnboardingScreen() {

  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { width: screenWidth
  } = useWindowDimensions();



  const listRef = useRef<AnimatedFlatListRef>(null);

  const scrollX = useSharedValue(0);

  const [currentIndex, setCurrentIndex
  ] = useState<number>(0);



  const scrollHandler = useAnimatedScrollHandler({

    onScroll: (event) => {

      scrollX.value = event.contentOffset.x;
    },

    onMomentumEnd: (event) => {

      const rawIndex = Math.round(event.contentOffset.x / screenWidth);
      const newIndex = Math.min(Math.max(rawIndex,
        0), SLIDES.length - 1);

      runOnJS(setCurrentIndex)(newIndex);
    },
  });




  const isLast = currentIndex === SLIDES.length - 1;




  const navigateTo = useCallback(

    (index: number) => {

      if (index < 0 || index >= SLIDES.length) return;

      listRef.current?.scrollToOffset({
        offset: index * screenWidth, animated: true
      });

      setCurrentIndex(index);
    },
    [screenWidth
    ]

  );



  const skip = useCallback(() => router.replace("/(auth)/signup"),
    [router
    ]);

  const goToSignup = useCallback(() => router.replace("/(auth)/signup"),
    [router
    ]);



  const renderItem = useCallback(

    ({ item, index
    }: ListRenderItemInfo<SlideData>) => (

      <SlideItem

        slide={item
        }

        index={index
        }


        scrollX={scrollX
        }

        screenWidth={screenWidth
        }


      />

    ),
    [scrollX, screenWidth
    ]

  );



  const keyExtractor = useCallback((item: SlideData) => item.id,
    []);



  return (


    <SafeAreaView style={styles.root
    } edges={
      [
        "top",
        "bottom"
      ]
    }>

      <StatusBar barStyle="dark-content" backgroundColor={COLORS.paper
      } />



      { /* Top bar */}

      <View style={styles.topBar
      }>

        <View>

          <Text style={styles.logo
          }>EIVVER</Text>

          <Text style={styles.logoTag
          }>HOME SERVICES</Text>

        </View>

        {!isLast && (

          <Pressable
            style={styles.skipBtn
            }
            onPress={skip
            }
            hitSlop={
              8
            }
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
          >

            <Text style={styles.skipText
            }>Skip intro</Text>

          </Pressable>

        )
        }

      </View>



      { /* Swipeable ticket deck */}

      <Animated.FlatList<SlideData>

        ref={listRef
        }

        data={SLIDES as SlideData[]
        }

        horizontal

        pagingEnabled

        bounces={
          false
        }

        showsHorizontalScrollIndicator={
          false
        }
        alwaysBounceHorizontal={
          false
        }
        directionalLockEnabled
        scrollsToTop={
          false
        }

        keyExtractor={keyExtractor
        }

        renderItem={renderItem
        }

        onScroll={scrollHandler
        }

        scrollEventThrottle={
          16
        }

        decelerationRate="fast"
        overScrollMode="never"

        getItemLayout={(_data, index) => ({

          length: screenWidth,

          offset: screenWidth * index,

          index,
        })
        }

        style={styles.list
        }

      />



      <PaginationDots slides={SLIDES
      } scrollX={scrollX
      } screenWidth={screenWidth
      } onDotPress={navigateTo
      } />



      { /* Final action: navigation between slides is swipe-only. */}
      {isLast && (
        <View style={
          [styles.finalNavRow,
          {
            paddingBottom: Math.max(insets.bottom, SPACING.lg)
          }
          ]
        }>
          <ScalePressable onPress={goToSignup
          } style={styles.finalCta
          }>
            <Text style={styles.finalCtaLabel
            }>Let&apos;s Get to Work</Text>
            <Ionicons
              name="arrow-forward"
              size={
                17
              }
              color={COLORS.paper
              }
              style={styles.navIconSpacing
              }
            />
          </ScalePressable>
        </View>
      )
      }

    </SafeAreaView>


  );
}
// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({


  root: {
    flex: 1, backgroundColor: COLORS.paper
  },



  topBar: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "flex-start",

    paddingHorizontal: SPACING.xl,

    paddingBottom: SPACING.sm,
  },

  logo: {

    fontFamily: FONT.mono,

    fontSize: 20,

    fontWeight: "700",

    color: COLORS.ink,

    letterSpacing: 3,
  },

  logoTag: {

    fontFamily: FONT.mono,

    fontSize: 10,

    color: COLORS.steel,

    letterSpacing: 2,

    marginTop: 2,
  },

  skipBtn: {
    paddingVertical: SPACING.xs, paddingHorizontal: SPACING.sm
  },

  skipText: {

    fontFamily: FONT.mono,

    fontSize: 12.5,

    color: COLORS.inkSoft,

    letterSpacing: 0.5,

    textDecorationLine: "underline",
  },
  // Deck — MUST be flex: 1, not flexGrow: 0, or a horizontal FlatList has
  // no cross-axis height to lay content out in and its content clips.

  list: {
    flex: 1
  },

  slide: {

    flex: 1,

    justifyContent: "center",

    paddingHorizontal: SPACING.xl,

    paddingVertical: SPACING.md,
  },
  // Ticket card — no absolute positioning, no fixed heights. It sizes to
  // its own content, so copy of any length is always fully visible.

  card: {

    backgroundColor: COLORS.paperCard,

    borderRadius: RADIUS.lg,

    borderWidth: 1,

    borderColor: COLORS.line,

    shadowColor: COLORS.ink,

    shadowOpacity: 0.08,

    shadowRadius: 18,

    shadowOffset: {
      width: 0, height: 10
    },

    elevation: 6,

    overflow: "hidden",
  },

  cardBody: {
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.lg
  },



  perfRow: {

    flexDirection: "row",

    justifyContent: "space-between",

    paddingHorizontal: SPACING.md,
  },

  perfHole: {

    width: 8,

    height: 8,

    borderRadius: 4,

    backgroundColor: COLORS.paper,

    marginVertical: -4,
  },



  ticketHeader: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "flex-start",

    marginTop: SPACING.sm,
  },

  ticketNo: {

    fontFamily: FONT.mono,

    fontSize: 11,

    color: COLORS.steel,

    letterSpacing: 1,
  },

  stamp: {

    borderWidth: 2,

    borderRadius: RADIUS.sm,

    paddingHorizontal: SPACING.sm,

    paddingVertical: 3,
  },

  stampText: {

    fontFamily: FONT.mono,

    fontSize: 11,

    fontWeight: "700",

    letterSpacing: 1.5,
  },



  roundel: {

    width: 64,

    height: 64,

    borderRadius: 32,

    borderWidth: 1.5,

    borderStyle: "dashed",

    alignItems: "center",

    justifyContent: "center",

    marginTop: SPACING.lg,

    marginBottom: SPACING.lg,
  },



  title: {

    fontSize: 30,

    fontWeight: "800",

    color: COLORS.ink,

    lineHeight: 34,

    letterSpacing: -0.5,

    marginBottom: SPACING.sm + 2,
  },

  desc: {

    fontSize: 15,

    lineHeight: 22,

    color: COLORS.inkSoft,
  },



  divider: {

    borderTopWidth: 1,

    borderStyle: "dashed",

    borderColor: COLORS.line,

    marginVertical: SPACING.lg,
  },



  lineItems: {
    gap: SPACING.sm + 2
  },

  lineRow: {
    flexDirection: "row", alignItems: "flex-end"
  },

  lineLabel: {

    fontFamily: FONT.mono,

    fontSize: 12,

    color: COLORS.steel,
  },

  lineLeader: {

    flex: 1,

    marginHorizontal: SPACING.sm,

    borderBottomWidth: 1,

    borderStyle: "dotted",

    borderColor: COLORS.line,

    marginBottom: 4,
  },

  lineValue: {

    fontFamily: FONT.mono,

    fontSize: 13,

    fontWeight: "700",
  },
  // Dots

  dotsRow: {

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    gap: SPACING.sm,

    paddingTop: SPACING.lg,
  },

  dot: {
    height: 7, borderRadius: RADIUS.pill
  },



  navIconSpacing: {
    marginLeft: SPACING.sm - 2
  },
  // Final slide — single centered sign-up CTA

  finalNavRow: {

    alignItems: "center",

    paddingHorizontal: SPACING.xl,

    paddingTop: SPACING.lg,
  },

  finalCta: {

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: COLORS.ink,

    borderRadius: RADIUS.sm,

    height: 56,

    paddingHorizontal: SPACING.xxl,

    width: "100%",
  },

  finalCtaLabel: {

    color: COLORS.paper,

    fontSize: 16,

    fontWeight: "700",
  },
});