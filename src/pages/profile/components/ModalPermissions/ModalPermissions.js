import {
  _getPermissions,
  translateStatus,
} from "@utils/translationUtils";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

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
