// import React, { createContext, useContext, useMemo, useState } from "react";

// export type ThemeMode = "light" | "dark";
// export type AppLanguage = "English" | "Français" | "Español" | "Hausa";

// interface ThemeColors {
//   background: string;
//   panel: string;
//   surface: string;
//   card: string;
//   cardAlt: string;
//   textPrimary: string;
//   textSecondary: string;
//   accent: string;
//   border: string;
//   topBarBg: string;
//   navBg: string;
//   navBorder: string;
//   icon: string;
//   hero: string;
//   muted: string;
//   success: string;
//   danger: string;
//   statusBarStyle: "light-content" | "dark-content";
// }

// interface ThemeContextValue {
//   themeMode: ThemeMode;
//   setThemeMode: (value: ThemeMode) => void;
//   isDarkMode: boolean;
//   language: AppLanguage;
//   setLanguage: (value: AppLanguage) => void;
//   colors: ThemeColors;
//   languages: AppLanguage[];
// }

// const lightColors: ThemeColors = {
//   background: "#F8F5EF",
//   panel: "#FFFFFF",
//   surface: "#F7F3EA",
//   card: "#FFFFFF",
//   cardAlt: "#FAF3DF",
//   textPrimary: "#1F334F",
//   textSecondary: "#5A6C8A",
//   accent: "#D4A92C",
//   border: "#E5DCCF",
//   topBarBg: "#FFFFFF",
//   navBg: "#FFFFFF",
//   navBorder: "#E5EBF7",
//   icon: "#1E3A70",
//   hero: "#FEF4DA",
//   muted: "#7B8CA5",
//   success: "#1F9A5D",
//   danger: "#DC3144",
//   statusBarStyle: "dark-content",
// };

// const darkColors: ThemeColors = {
//   background: "#050916",
//   panel: "#0D1B34",
//   surface: "#122047",
//   card: "#172B52",
//   cardAlt: "#0F1B37",
//   textPrimary: "#F7F9FD",
//   textSecondary: "#A0B1D4",
//   accent: "#F4C539",
//   border: "#1E3151",
//   topBarBg: "#071426",
//   navBg: "#061121",
//   navBorder: "#172F57",
//   icon: "#E6EBFA",
//   hero: "#1E355F",
//   muted: "#8EA1C7",
//   success: "#23C66A",
//   danger: "#F36F79",
//   statusBarStyle: "light-content",
// };

// const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// const AVAILABLE_LANGUAGES: AppLanguage[] = ["English", "Français", "Español", "Hausa"];

// export function AppThemeProvider({ children }: { children: React.ReactNode }) {
//   const [themeMode, setThemeMode] = useState<ThemeMode>("light");
//   const [language, setLanguage] = useState<AppLanguage>("English");

//   const isDarkMode = themeMode === "dark";
//   const colors = useMemo(() => (isDarkMode ? darkColors : lightColors), [isDarkMode]);

//   const value = useMemo(
//     () => ({
//       themeMode,
//       setThemeMode,
//       isDarkMode,
//       language,
//       setLanguage,
//       colors,
//       languages: AVAILABLE_LANGUAGES,
//     }),
//     [themeMode, isDarkMode, language, colors]
//   );

//   return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
// }

// export default function useTheme() {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error("useTheme must be used inside AppThemeProvider");
//   }
//   return context;
// }


import React, { createContext, useContext, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";
export type AppLanguage = "English" | "Français" | "Español" | "Hausa";

interface ThemeColors {
  background: string;
  panel: string;
  surface: string;
  card: string;
  cardAlt: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  border: string;
  topBarBg: string;
  navBg: string;
  navBorder: string;
  icon: string;
  hero: string;
  muted: string;
  success: string;
  danger: string;
  statusBarStyle: "light-content" | "dark-content";
}

interface ThemeContextValue {
  themeMode: ThemeMode;
  setThemeMode: (value: ThemeMode) => void;
  isDarkMode: boolean;
  language: AppLanguage;
  setLanguage: (value: AppLanguage) => void;
  colors: ThemeColors;
  languages: AppLanguage[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Palette matched to the onboarding "service ticket" system: warm paper
// ground, ink text, amber as the primary brand accent, forest as the
// success/trust color (payment protection), and a terracotta danger tone
// that stays in the same warm family instead of a stock red.
// ─────────────────────────────────────────────────────────────────────────────
const lightColors: ThemeColors = {
  background: "#F7F4EC", // paper
  panel: "#FFFDF8", // paperCard
  surface: "#F2EEE1", // slightly deeper paper for sunken sections
  card: "#FFFDF8", // paperCard
  cardAlt: "#FBEEDD", // warm amber-tinted card
  textPrimary: "#14181C", // ink
  textSecondary: "#3A4048", // inkSoft
  accent: "#FF7A1A", // amber
  border: "#DCD6C6", // line
  topBarBg: "#F7F4EC", // paper
  navBg: "#FFFDF8", // paperCard
  navBorder: "#DCD6C6", // line
  icon: "#14181C", // ink
  hero: "#FBEEDD", // soft amber tint
  muted: "#7A828C", // steel
  success: "#1F6F4F", // forest
  danger: "#C1432E", // terracotta, stays in the ticket/stamp warm family
  statusBarStyle: "dark-content",
};

const darkColors: ThemeColors = {
  background: "#0E1114", // deep ink
  panel: "#171B20", // raised ink surface
  surface: "#14181C", // ink
  card: "#1C2126", // card ink
  cardAlt: "#241C14", // amber-tinted dark card
  textPrimary: "#F7F4EC", // paper
  textSecondary: "#A9AFB6", // light steel
  accent: "#FF8F3D", // amber, brightened for contrast on dark
  border: "#2A2F35", // dark line
  topBarBg: "#0E1114", // deep ink
  navBg: "#14181C", // ink
  navBorder: "#262B31", // dark line
  icon: "#F7F4EC", // paper
  hero: "#2E2013", // dark amber tint
  muted: "#7A828C", // steel
  success: "#2FAE7A", // forest, brightened for dark bg
  danger: "#E2604A", // terracotta, brightened for dark bg
  statusBarStyle: "light-content",
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const AVAILABLE_LANGUAGES: AppLanguage[] = ["English", "Français", "Español", "Hausa"];

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [language, setLanguage] = useState<AppLanguage>("English");

  const isDarkMode = themeMode === "dark";
  const colors = useMemo(() => (isDarkMode ? darkColors : lightColors), [isDarkMode]);

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      isDarkMode,
      language,
      setLanguage,
      colors,
      languages: AVAILABLE_LANGUAGES,
    }),
    [themeMode, isDarkMode, language, colors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside AppThemeProvider");
  }
  return context;
}