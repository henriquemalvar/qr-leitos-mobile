import { theme } from "@styles/theme";
import { StyleSheet } from "react-native";

export const styles = new StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  view: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  permission: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
  },
  permissionText: {
    marginBottom: 5,
    fontSize: 14,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
