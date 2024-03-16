import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { ToggleContainer } from "./ToggleContainer";

export const ToggleCard = ({
  label1,
  value1,
  onValueChange1,
  label2,
  value2,
  onValueChange2,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Configurações</Text>
      </View>
      <View style={styles.cardContent}>
        <ToggleContainer
          label={label1}
          value={value1}
          onValueChange={onValueChange1}
        />
        <ToggleContainer
          label={label2}
          value={value2}
          onValueChange={onValueChange2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
