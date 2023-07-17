import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

import db from "../../database/database";

import styles from "./styles";

export default function Perfil({ navigation, route }) {
  const userId = route.params.idUser;
  const [user, setUser] = useState("");

  useEffect(() => {
    async function userData() {
      const userRef = db.collection("users_config").doc(userId);
      const userDoc = await userRef.get();
      const user = userDoc.data();
      setUser(user);
    }
    userData();
  }, []);

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
            await signOut(getAuth()).then(() => {
              // AsyncStorage.removeItem('token');
              navigation.navigate("Login");
            });
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