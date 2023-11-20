import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  bedContainer: {
    paddingTop: 10,
    flex: 1,
    width: "100%",
  },

  bed: {
    alignItems: "center",
    alignSelf: "center",
    paddingLeft: 10,
    backgroundColor: "#dcdcdc",
    width: "95%",
    flexDirection: "row",
    height: 75,
    borderRadius: 15,
    marginBottom: 10,
  },

  titleText: {
    fontSize: 20,
    paddingLeft: 10,
    fontWeight: "bold",
  },

  available: {
    fontSize: 20,
  },
});

export default styles;