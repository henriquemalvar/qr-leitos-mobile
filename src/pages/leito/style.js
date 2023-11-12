import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  containerStatus: {
    paddingTop: 10,
    flex: 1,
    color: "#ffffff",
    alignItems: "center",
  },

  title: {
    backgroundColor: "#dcdcdc",
    width: "97%",
    flexDirection: "row",
    height: 75,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  containerDesc: {
    backgroundColor: "#E7E6E1",
    width: "97%",
    flexDirection: "column",
    borderRadius: 15,
    marginBottom: 10,
  },

  titleFont: {
    fontSize: 32,
    paddingLeft: 10,
    fontWeight: "bold",
    color: "#198CFF",
  },

  detailsFont: {
    fontSize: 24,
    paddingLeft: 10,
    fontWeight: "bold",
    paddingBottom: 5,
    paddingTop: 10,
  },

  detailsEnd: {
    fontSize: 20,
    paddingLeft: 10,
    paddingTop: 1,
  },

  buttonLabel: {
    backgroundColor: "green",
    width: "25%",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: "5%",
    left: "68%",
  },

  disabledButtonLabel: {
    backgroundColor: "#E7E6E1",
    width: "25%",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: "5%",
    left: "68%",
  },

  buttonText: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    color: "white",
  },

  modalContainer: {
    backgroundColor: "white",
    width: "82%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    borderRadius: 50,
  },

  containerDropdown: [
    {
      backgroundColor: "#E7E6E1",
      width: "97%",
      borderRadius: 15,
      paddingBottom: 15,
    },
  ],

  dropdown: {
    backgroundColor: "#E7E6E1",
    width: "97%",
    borderRadius: 15,
  },

  dropdownButton: {
    backgroundColor: "#fff",
    width: "97%",
    borderRadius: 15,
    alignSelf: "center",
  },

  dropdownDropdown: {
    backgroundColor: "#fff",
    width: "94%",
    borderRadius: 15,
  },
  card: {
    backgroundColor: "#E7E6E1",
    width: "97%",
    borderRadius: 15,
    marginBottom: 10,
  },
  cardHeader: {
    backgroundColor: "#dcdcdc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 18,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#3498db",
    width: "97%",
    borderRadius: 15,
    alignSelf: "center",
  },
});

export default styles;
