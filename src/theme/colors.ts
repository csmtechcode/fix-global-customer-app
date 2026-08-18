import { Dimensions } from "react-native";

export const COLORS = {
  BLUE: "#1A3C6E",
  GOLD: "#ffc300",
  WHITE: "#FFFFFF",
  LIGHT: "#F4F7FD",
  BORDER: "#DDE4F0",
  PLACEHOLDER: "#8FA0B8",
  ERROR: "#E84040",
  LABEL: "#3A4E6A",
} as const;

export const { width } = Dimensions.get("window");