import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import styles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { stringify, parse } from "flatted";
import db from "../../database/database";
import moment from "moment";
import { permissions } from "../../shared/util/constants";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const [messageError, setMessageError] = useState("");

  const loginFirebase = async () => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const user = await saveUserToAsyncStorage(userCredential.user);
      const userConfig = await saveUserConfigToAsyncStorage(email);
      await saveOptionsToAsyncStorage(userConfig.permission);

      navigation.navigate("Menu", { idUser: user.uid });
    } catch (error) {
      if(messageError !== "") 
        return setErrorLogin(true);

      switch (error.code) {
        case "auth/invalid-email":
          setMessageError("Email inválido");
          break;
        case "auth/user-disabled":
          setMessageError("Usuário desabilitado");
          break;
        case "auth/user-not-found":
          setMessageError("Usuário não encontrado");
          break;
        case "auth/wrong-password":
          setMessageError("Senha incorreta");
          break;
        default:
          setMessageError("Erro ao fazer login");
          break;
      }
      setErrorLogin(true);
    }
  };

  const saveUserToAsyncStorage = async (_user) => {
    _user.stsTokenManager.expirationTime = moment(_user.stsTokenManager.expirationTime).add(1, 'week');
    await AsyncStorage.setItem("user", stringify(_user));
    return _user;
  };

  const saveUserConfigToAsyncStorage = async (email) => {
    try {
      const querySnapshot = await db
        .collection("users_config")
        .doc(email)
        .get();

      if (querySnapshot.empty) {
        throw new Error("User config not found");
      }

      let userConfig = querySnapshot.data();
      await AsyncStorage.setItem("userConfig", stringify(userConfig));
      return userConfig;
    } catch (error) {
      setMessageError(error.message);
      return { error: error.message };
    }
  };

  const saveOptionsToAsyncStorage = async (permission = "") => {
    try {
      const options = Array.isArray(permissions[permission]) ? permissions[permission] : [];

      await AsyncStorage.setItem("options", stringify(options));
    } catch (error) {
      setMessageError(error.message);
      return { error: error.message };
    }
  };

  useEffect(() => {
    const getUser = async () => {
      await AsyncStorage.getItem("user").then(async (user) => {
        if (user) {
          const parsedConfig = await AsyncStorage.getItem("userConfig");
          const parsedOptions = await AsyncStorage.getItem("options");
          const parsedUser = parse(user);

          // const expirationTime = parsedUser.stsTokenManager.expirationTime;
          const expirationTime = moment(parsedUser.stsTokenManager.expirationTime).add(1, 'week');
          const currentTime = moment();

          if (moment(expirationTime).isBefore(currentTime) && parsedConfig && parsedOptions) {
            navigation.navigate("Menu", { idUser: parsedUser.uid });
          } 
          // else {
          //   navigation.navigate("Menu", { idUser: parsedUser.uid });
          // }
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
      {errorLogin === true ? (
        <View style={styles.contentAlert}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={24}
            color="#bdbdbd"
          />
          <Text style={styles.warningAlert}>{messageError}</Text>
        </View>
      ) : (
        <View />
      )}
      {email === "" || senha === "" ? (
        <TouchableOpacity disabled style={styles.buttonLogin}>
          <Text style={styles.textButtonLogin}>Entrar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.buttonLogin} onPress={loginFirebase}>
          <Text style={styles.textButtonLogin}>Entrar</Text>
        </TouchableOpacity>
      )}
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
}