import globalStyles from "@styles/globalStyles";
import { translatePermission } from "@utils/translationUtils";
import { useState } from "react";
import { Card, IconButton, Paragraph, Title } from "react-native-paper";
import { ModalPermissions } from "../ModalPermissions/ModalPermissions";
import { styles } from "./styles";

export const PermissionInfoCard = ({ user }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleModal = () => setModalVisible(!modalVisible);

  return (
    <Card style={globalStyles.card}>
      <Card.Content>
        <Title style={globalStyles.title}>Cargo</Title>
        <IconButton
          icon="information"
          size={20}
          color="grey"
          onPress={handleModal}
          style={styles.iconButton}
        />
        <ModalPermissions
          visible={modalVisible}
          onClose={handleModal}
          user={user}
        />
        <Paragraph style={globalStyles.paragraph}>
          {translatePermission(user.permission)}
        </Paragraph>
      </Card.Content>
    </Card>
  );
};
