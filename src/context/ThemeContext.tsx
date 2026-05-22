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

const lightColors: ThemeColors = {
  background: "#F8F5EF",
  panel: "#FFFFFF",
  surface: "#F7F3EA",
  card: "#FFFFFF",
  cardAlt: "#FAF3DF",
  textPrimary: "#1F334F",
  textSecondary: "#5A6C8A",
  accent: "#D4A92C",
  border: "#E5DCCF",
  topBarBg: "#FFFFFF",
  navBg: "#FFFFFF",
  navBorder: "#E5EBF7",
  icon: "#1E3A70",
  hero: "#FEF4DA",
  muted: "#7B8CA5",
  success: "#1F9A5D",
  danger: "#DC3144",
  statusBarStyle: "dark-content",
};

const darkColors: ThemeColors = {
  background: "#050916",
  panel: "#0D1B34",
  surface: "#122047",
  card: "#172B52",
  cardAlt: "#0F1B37",
  textPrimary: "#F7F9FD",
  textSecondary: "#A0B1D4",
  accent: "#F4C539",
  border: "#1E3151",
  topBarBg: "#071426",
  navBg: "#061121",
  navBorder: "#172F57",
  icon: "#E6EBFA",
  hero: "#1E355F",
  muted: "#8EA1C7",
  success: "#23C66A",
  danger: "#F36F79",
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