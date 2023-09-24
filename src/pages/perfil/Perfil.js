import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "./styles";
import { parse } from "flatted";
import { permissionsToLabel } from "../../shared/util/constants";

export default function Perfil({ navigation, route }) {
  const [user, setUser] = useState("");

  useEffect(() => {
    async function userData() {
      await AsyncStorage.getItem("userConfig").then((user) => {
        setUser(parse(user));
      });
    }
    userData();
  }, []);

  const logout = async () => {
    await signOut(getAuth()).then(() => {
      AsyncStorage.multiRemove(["token", "user", "userConfig", "options"]);
      navigation.navigate("Login");
    });
  };

  return (
    <View style={styles.containerPerfil}>
      <View style={styles.head}>
        <View>
          <FontAwesome name="circle" style={styles.icon} />
        </View>
        <View>
          <Text style={styles.user}>{user.name}</Text>
        </View>
      </View>
      <View style={styles.containerCargo}>
        <Text style={styles.cargo}>Cargo</Text>
        <Text style={styles.cargo2}>
          {translatePermission(user.permission)}
        </Text>
      </View>
      <View style={styles.containerCargo}>
        <Text style={styles.cargo}>Email cadastrado:</Text>
        <Text style={styles.cargo2}>{user.email}</Text>
      </View>
      <View>
        <TouchableOpacity
          style={styles.logout}
          onPress={async () => {
            await logout();
          }}
        >
          <Text style={{ fontSize: 24, color: "white", fontWeight: "bold" }}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const translatePermission = (permission) => {
  return permissionsToLabel[permission] || "Não definido";
};