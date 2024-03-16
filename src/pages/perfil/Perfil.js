import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signOut } from "firebase/auth";
import { parse } from "flatted";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { translatePermission } from "../../shared/util/translationUtils";

import { IconButton } from "react-native-paper";
import showMessage from "../../shared/util/messageUtils";
import { ModalPermissions } from "./components/ModalPermissions";
import styles from "./styles";

const UserHead = ({ user }) => {
  return (
    <View style={styles.head}>
      <View>
        <FontAwesome name="circle" style={styles.icon} />
      </View>
      <View>
        <Text style={styles.user}>{user.name}</Text>
      </View>
    </View>
  );
};

const UserPermission = ({ user }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleModal = () => setModalVisible(!modalVisible);

  return (
    <View style={styles.containerCargo}>
      <Text style={styles.title}>Cargo</Text>
      <IconButton
        icon="information"
        iconColor="grey"
        onPress={handleModal}
        style={styles.iconButton}
      />
      <ModalPermissions
        visible={modalVisible}
        onClose={handleModal}
        user={user}
      />
      <Text style={styles.subtitle}>
        {translatePermission(user.permission)}
      </Text>
    </View>
  );
};

const UserEmail = ({ user }) => {
  return (
    <View style={styles.containerCargo}>
      <Text style={styles.title}>Email cadastrado:</Text>
      <Text style={styles.subtitle}>{user.email}</Text>
    </View>
  );
};

const LogoutButton = ({ onPress }) => {
  return (
    <View>
      <TouchableOpacity style={styles.logout} onPress={onPress}>
        <Text style={{ fontSize: 24, color: "white", fontWeight: "bold" }}>
          Sair
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const Perfil = ({ navigation, route }) => {
  const [user, setUser] = useState("");

  useEffect(() => {
    async function fetchUserConfig() {
      try {
        const userConfig = await AsyncStorage.getItem("userConfig");
        if (userConfig) {
          setUser(parse(userConfig));
        }
      } catch (error) {
        console.error("Error fetching userConfig:", error);
      }
    }

    fetchUserConfig();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      await AsyncStorage.multiRemove(["token", "user", "userConfig"]);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during logout:", error);
      showMessage("error", "Erro ao fazer logout", error.message);
    }
  };

  return (
    <View style={styles.containerPerfil}>
      <UserHead user={user} />
      <UserPermission user={user} />
      <UserEmail user={user} />
      <LogoutButton onPress={handleLogout} />
    </View>
  );
};

export default Perfil;
