import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  searchButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 10,
  },
  clearButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 10,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    margin: 5,
    padding: 10,
  },
  emptyList: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
