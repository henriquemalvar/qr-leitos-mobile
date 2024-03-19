import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: 10,
    paddingTop: 10,
  },
  head: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 10,
  },
  lives: {
    backgroundColor: "#dcdcdc",
    borderRadius: 20,
    flexDirection: "column",
    height: 130,
    paddingTop: 10,
    width: "94%",
  },
  longDescription: {
    alignSelf: "center",
    fontSize: 12,
    paddingTop: 25,
  },
  occupation: {
    alignItems: "center",
    backgroundColor: "#dcdcdc",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    width: "94%",
  },
  shortDescription: {
    alignSelf: "center",
    fontSize: 16,
    paddingTop: 25,
  },
  text: {
    alignSelf: "center",
    color: "#6495ED",
    fontSize: 12,
    paddingTop: 12,
  },
  textOc: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default styles;