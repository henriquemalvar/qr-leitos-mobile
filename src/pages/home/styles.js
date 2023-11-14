import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  lives: {
    flexDirection: "column",
    backgroundColor: "#dcdcdc",
    width: "94%",
    height: 130,
    paddingTop: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  head: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 10,
  },
  shortDescription: {
    fontSize: 16,
    paddingTop: 25,
    alignSelf: "center",
  },
  longDescription: {
    fontSize: 12,
    paddingTop: 25,
    alignSelf: "center",
  },
  text: {
    color: "#6495ED",
    paddingTop: 12,
    fontSize: 12,
    alignSelf: "center",
  },
  occupation: {
    backgroundColor: "#dcdcdc",
    width: "94%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textOc: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
