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
      if (userCredential.user.disabled) {
        throw new Error("Usuário desabilitado");
      }
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
      const user = await AsyncStorage.getItem("user");
      const config = await AsyncStorage.getItem("userConfig");

      if (user && config) {
        const parsedUser = parse(user);
        const parsedConfig = parse(config);

        const expirationTime = moment(
          parsedUser.stsTokenManager.expirationTime
        );
        const currentTime = moment();

        if (moment(expirationTime).isAfter(currentTime)) {
          showMessage(
            "success",
            "Bem vindo de volta",
            parsedConfig?.name || ""
          );
          navigation.navigate("Menu", { idUser: parsedUser.uid });
        } else {
          showMessage(
            "error",
            "Sessão expirada",
            "Faça login novamente para continuar."
          );
        }
      }
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
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          placeholder="Digite a senha:"
          type="email"
          onChangeText={(text) => setSenha(text)}
          value={senha}
          autoCapitalize="none"
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
      <TouchableOpacity
        style={styles.buttonRecovery}
        onPress={() => navigation.navigate("PasswordRecovery")}
      >
        <Text style={styles.textButtonRecovery}>Esqueceu a senha?</Text>
      </TouchableOpacity>
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
}
