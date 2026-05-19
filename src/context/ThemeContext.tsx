import React, { createContext, useContext, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";
export type AppLanguage = "English" | "Français" | "Español" | "Hausa";

interface ThemeColors {
  background: string;
  panel: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  border: string;
  topBarBg: string;
  navBg: string;
  navBorder: string;
  icon: string;
  card: string;
  cardAlt: string;
  muted: string;
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

const lightColors: ThemeColors = {
  background: "#F8FAFD",
  panel: "#FFFFFF",
  surface: "#F4F7FD",
  textPrimary: "#1A3C6E",
  textSecondary: "#64748B",
  accent: "#FFC300",
  border: "#EAF0FB",
  topBarBg: "#FFFFFF",
  navBg: "#FFFFFF",
  navBorder: "#EAF0FB",
  icon: "#1A3C6E",
  card: "#FFFFFF",
  cardAlt: "#F9FAFB",
  muted: "#9CA3AF",
  statusBarStyle: "dark-content",
};

// const darkColors: ThemeColors = {
//   background: "#0B1423",
//   panel: "#0F172A",
//   surface: "#111827",
//   textPrimary: "#E2E8F0",
//   textSecondary: "#94A3B8",
//   accent: "#FACC15",
//   border: "#1E293B",
//   topBarBg: "#0F172A",
//   navBg: "#0D1325",
//   navBorder: "#1E293B",
//   icon: "#F9FAFC",
//   card: "#111827",
//   cardAlt: "#111827",
//   muted: "#64748B",
//   statusBarStyle: "light-content",
// };

const darkColors: ThemeColors = {
  background: "#0A0F1C",
  panel: "#121A2B",
  surface: "#1A2338",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  accent: "#FACC15",
  border: "#2A374F",
  topBarBg: "#121A2B",
  navBg: "#0F1626",
  navBorder: "#2A374F",
  icon: "#E2E8F0",
  card: "#1E2A44",
  cardAlt: "#1A253D",
  muted: "#64748B",
  statusBarStyle: "light-content",
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const AVAILABLE_LANGUAGES: AppLanguage[] = [
  "English",
  "Français",
  "Español",
  "Hausa",
];

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [language, setLanguage] = useState<AppLanguage>("English");

  const isDarkMode = themeMode === "dark";
  const colors = useMemo(
    () => (isDarkMode ? darkColors : lightColors),
    [isDarkMode],
  );

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
    [themeMode, isDarkMode, language, colors],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export default function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside AppThemeProvider");
  }

  return context;
}
