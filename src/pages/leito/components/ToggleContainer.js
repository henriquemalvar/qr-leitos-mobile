import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Switch } from "react-native-paper";

export const ToggleContainer = ({ label, value, onValueChange }) => {
  return (
    <View style={styles.toggleContainer}>
      <Text style={styles.checkboxLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} color="blue" />
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 18,
  },
});
