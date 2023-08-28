import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

import db from "../../database/database";

import styles from "./styles";
import { parse } from "flatted";

export default function Perfil({ navigation, route }) {
  const userId = route.params.idUser;
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
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
      AsyncStorage.removeItem('userConfig');
      AsyncStorage.removeItem('options');
      navigation.navigate("Login");
    });
  }

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
        <Text style={styles.cargo2}>{translatePermission(user.permission)}</Text>
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
  switch (permission) {
    case "admin":
      return "Administrador";
    case "limpeza":
      return "Limpeza";
    case "camareira":
      return "Camareira";
    case "enfermeira":
      return "Enfermeira";
    case "médico":
      return "Médico";
    default:
      return "Usuário";
  }
}