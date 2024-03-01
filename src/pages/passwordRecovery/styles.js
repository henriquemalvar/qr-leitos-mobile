import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 0 : 50,
    backgroundColor: "#F5F5F5",
  },
  input: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
    padding: 10,
    width: "90%",
    height: 50,
    borderBottomColor: "#198CFF",
    borderBottomWidth: 1,
  },
  button: {
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#198CFF",
    borderRadius: 50,
    marginTop: 30,
  },
  textButton: {
    color: "white",
  },
  label: {
    fontSize: 18,
    color: "#198CFF",
    marginBottom: 5,
  },
  explanation: {
    fontSize: 14,
    color: "#808080",
    marginBottom: 10,
    textAlign: "center",
    width: "80%",
  },
});

export default styles;
