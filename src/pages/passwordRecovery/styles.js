import { theme } from "@styles/theme";
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 50,
    height: 50,
    justifyContent: "center",
    marginTop: 30,
    width: 200,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
    width: "80%",
    color: theme.colors.text,
  },
  input: {
    borderBottomColor: theme.colors.primary,
    borderBottomWidth: 1,
    height: 50,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
    padding: 10,
    width: "90%",
  },
});

export default styles;
