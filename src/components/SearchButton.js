import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const SearchButton = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("Pesquisa")}
    >
      <Icon name="search" size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchButton;
