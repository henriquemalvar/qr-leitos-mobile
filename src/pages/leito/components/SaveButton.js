import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const SaveButton = ({ bed, selectedOption, disabled, updateLeito }) => {
  const onPress = useCallback(() => {
    updateLeito();
  }, [bed.status, selectedOption, updateLeito]);

  return (
    <TouchableOpacity
      style={[
        styles.floatingButton,
        disabled ? styles.disabledButtonLabel : styles.buttonLabel,
      ]}
      onPress={onPress}
      disabled={disabled || false}
    >
      <View>
        <Text style={styles.buttonText}>Salvar</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    backgroundColor: "green",
    width: "25%",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: "5%",
    left: "68%",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  disabledButtonLabel: {
    backgroundColor: "#808080",
    width: "25%",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: "5%",
    left: "68%",
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
  buttonText: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    color: "white",
  },
});
