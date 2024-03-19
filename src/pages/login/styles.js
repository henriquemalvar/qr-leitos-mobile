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
  buttonRecovery: {
    alignSelf: "center",
    marginTop: 15,
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
  passwordContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  inputIcon: {
    paddingTop: 15,
    position: "absolute",
    right: 8,
  },
  textButton: {
    color: theme.colors.background,
  },
  textButtonRecovery: {
    color: theme.colors.primary,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
    paddingTop: 20,
  },
});

export default styles;
