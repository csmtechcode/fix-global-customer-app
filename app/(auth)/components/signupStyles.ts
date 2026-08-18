import { Platform, StyleSheet } from "react-native";

export const COLORS = {
  ink: "#14181C",
  inkSoft: "#3A4048",
  steel: "#7A828C",
  paper: "#F7F4EC",
  paperCard: "#FFFDF8",
  line: "#DCD6C6",
  amber: "#FF7A1A",
  signal: "#2B4C7E",
  forest: "#1F6F4F",
  blue: "#2B4C7E",
  border: "#DCD6C6",
  placeholder: "#7A828C",
  error: "#C1432E",
} as const;

const FONT = {
  mono: Platform.select({
    ios: "Courier New",
    android: "monospace",
    default: "monospace",
  }),
} as const;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.paper,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 28,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    fontFamily: FONT.mono,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.ink,
    letterSpacing: 3,
  },

  logoStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  logoStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.forest,
  },

  logoStatusText: {
    fontFamily: FONT.mono,
    fontSize: 9,
    color: COLORS.steel,
    letterSpacing: 1.5,
  },

  headerRule: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  headerRuleAccent: {
    width: 42,
    height: 2,
    backgroundColor: COLORS.amber,
  },

  headerRuleLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.line,
    marginLeft: 8,
  },

  headBlock: {
    paddingTop: 28,
    paddingBottom: 20,
  },

  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  eyebrowIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.paperCard,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  eyebrow: {
    fontFamily: FONT.mono,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.signal,
    letterSpacing: 1.6,
  },

  headline: {
    color: COLORS.ink,
    fontSize: 42,
    lineHeight: 42,
    fontWeight: "900",
    letterSpacing: -1.6,
  },

  headlineAccent: {
    color: COLORS.ink,
  },

  subline: {
    marginTop: 12,
    color: COLORS.inkSoft,
    fontSize: 15,
    lineHeight: 22,
  },

  card: {
    marginHorizontal: 0,
    marginBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
    backgroundColor: COLORS.paperCard,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 24,
    shadowColor: COLORS.ink,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  cardTopRule: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  cardTopRuleAccent: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.amber,
    marginRight: 8,
  },

  cardEyebrow: {
    fontFamily: FONT.mono,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.steel,
    letterSpacing: 1.3,
  },

  cardTopRuleLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.line,
    marginLeft: 10,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  halfField: {
    flex: 1,
    minWidth: 0,
  },

  fieldGap: {
    width: 10,
  },

  fieldWrapper: {
    marginBottom: 16,
  },

  fieldLabel: {
    color: COLORS.inkSoft,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 7,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#F4F0E6",
    borderColor: COLORS.line,
  },

  input: {
    flex: 1,
    minHeight: 52,
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 14,
  },

  eyeBtn: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  generalError: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.amber,
    backgroundColor: "#FFF3E8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },

  generalErrorIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 20,
    backgroundColor: COLORS.amber,
    color: COLORS.paper,
    fontWeight: "800",
    marginRight: 9,
  },

  generalErrorText: {
    flex: 1,
    color: COLORS.inkSoft,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },

  actions: {
    marginTop: 8,
  },

  primaryButton: {
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: COLORS.ink,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  primaryButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  primaryButtonDisabled: {
    opacity: 0.68,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: COLORS.paper,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.1,
  },

  buttonIcon: {
    marginLeft: 9,
  },

  actionNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  actionNoteText: {
    color: COLORS.steel,
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: 0.35,
    marginLeft: 6,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 12,
  },

  footerText: {
    color: COLORS.inkSoft,
    fontSize: 14,
  },

  footerLink: {
    color: COLORS.signal,
    fontSize: 14,
    fontWeight: "700",
  },

  bottomSpacer: {
    height: 30,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 21, 28, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.paperCard,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
  },

  modalIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#E6F7EF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  modalIconText: {
    color: COLORS.forest,
    fontSize: 28,
    fontWeight: "800",
  },

  modalTitle: {
    color: COLORS.ink,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },

  modalText: {
    color: COLORS.inkSoft,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },

  modalButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: COLORS.ink,
    alignItems: "center",
    justifyContent: "center",
  },

  modalButtonText: {
    color: COLORS.paper,
    fontSize: 15,
    fontWeight: "700",
  },
});