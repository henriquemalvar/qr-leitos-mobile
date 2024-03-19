import { StyleSheet } from "react-native";
import { theme } from "@styles/theme";
const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: theme.colors.error,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "center",
    padding: 8,
    width: "40%",
  },
  buttonContainer: {
    marginTop: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 7,
  },
  
  versionContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  appInfo: {
    fontSize: 14,
    color: "#888",
  },
});

export default styles;
