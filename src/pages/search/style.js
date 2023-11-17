import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  containerLeitos: {
    paddingTop: 10,
    flex: 1,
    width: "100%",
  },
  leito: {
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
  title: {
    fontSize: 20,
    paddingLeft: 10,
    fontWeight: "bold",
  },
  livre: {
    fontSize: 20,
  },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  searchText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default styles;
