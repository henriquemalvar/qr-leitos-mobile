import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { parse, stringify } from "flatted";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import db from "../../database/database";
import showMessage from "../../shared/util/messageUtils";
import styles from "./styles";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      showMessage("error", "Erro ao fazer login", "Preencha todos os campos.");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );
      await saveUserToAsyncStorage(userCredential.user);
      await saveUserConfigToAsyncStorage(email);

      navigation.navigate("Menu", { idUser: userCredential.user.uid });
    } catch (error) {
      handleLoginError(error);
    }
  };

  const handleLoginError = (error) => {
    let message;
    if (!message) {
      switch (error.code) {
        case "auth/invalid-email":
        case "auth/user-not-found":
        case "auth/wrong-password":
          message = "Email ou senha incorretos";
          break;
        case "auth/user-disabled":
          message = "Usuário desabilitado";
          break;
        default:
          message = "Erro ao fazer login";
          break;
      }
    }

    showMessage("error", "Erro ao fazer login", message);
  };

  const saveUserToAsyncStorage = async (_user) => {
    _user.stsTokenManager.expirationTime = moment(
      _user.stsTokenManager.expirationTime
    ).add(1, "week");
    await AsyncStorage.setItem("user", stringify(_user));
  };

  const saveUserConfigToAsyncStorage = async (email) => {
    try {
      const querySnapshot = await db
        .collection("users_config")
        .doc(email)
        .get();

      const userConfig = querySnapshot.data();
      if (!userConfig) {
        throw new Error("User config not found");
      }
      await AsyncStorage.setItem("userConfig", stringify(userConfig));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const getUser = async () => {
      await AsyncStorage.getItem("user").then(async (user) => {
        if (!user) {
          return;
        }
        const parsedUser = parse(user);
        const config = await AsyncStorage.getItem("userConfig");
        if (!config) {
          return;
        }
        const parsedConfig = parse(config);

        const expirationTime = moment(
          parsedUser.stsTokenManager.expirationTime
        ).add(1, "week");
        const currentTime = moment();
        if (moment(expirationTime).isAfter(currentTime) && parsedConfig) {
          navigation.navigate("Menu", { idUser: parsedUser.uid });
        }
      });
    };

    getUser();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o email:"
        type="text"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          placeholder="Digite a senha:"
          type="text"
          onChangeText={(text) => setSenha(text)}
          value={senha}
        />
        <TouchableOpacity
          style={styles.showPasswordButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#bdbdbd"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.buttonLogin,
          {
            backgroundColor: email.trim() && senha.trim() ? "#3498db" : "#ccc",
          },
        ]}
        onPress={handleLogin}
        disabled={!email.trim() || !senha.trim()}
      >
        <Text style={styles.textButtonLogin}>Entrar</Text>
      </TouchableOpacity>
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
}
