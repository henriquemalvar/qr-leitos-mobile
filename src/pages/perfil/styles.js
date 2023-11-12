import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  containerPerfil: {
    paddingTop: 10,
    flex: 1,
    color: "#ffffff",
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingTop: 10,
  },

  user: {
    fontSize: 32,
    paddingLeft: 50,
    color: "blue",
  },

  title: {
    fontSize: 24,
    paddingTop: 10,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 20,
  },

  iconButton: {
    position: "absolute",
    right: 0,
    top: 0,
    marginRight: 10,
    marginTop: 10,
  },

  containerCargo: {
    marginTop: 15,
    paddingLeft: 15,
    backgroundColor: "#dcdcdc",
    width: "97%",
    flexDirection: "column",
    borderRadius: 15,
    paddingBottom: 15,
    alignSelf: "center",
  },

  logout: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    backgroundColor: "red",
    borderRadius: 50,
    padding: 7,
    width: "50%",
    marginTop: 20,
  },

  icon: {
    fontSize: 80,
    color: "grey",
  },
});

export default styles;
