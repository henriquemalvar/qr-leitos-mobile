import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  _getPermissions,
  translateStatus,
} from "../../../shared/util/translationUtils";

export const ModalPermissions = ({ visible, onClose, user }) => {
  const userPermissions = _getPermissions(user.permission);

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.container}>
        <View style={styles.view}>
          <Text style={styles.title}>Permissões</Text>
          {userPermissions.map((permission, index) => (
            <View key={index} style={styles.permission}>
              <Text style={styles.permissionText}>
                {translateStatus(permission.from)} →{" "}
                {translateStatus(permission.to)}
              </Text>
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export const styles = new StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  view: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  permission: {
    fontSize: 16,
    marginBottom: 5,
  },
  permissionText: {
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
});
