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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { stringify, parse } from "flatted";
import db from "../../database/database";
import moment from "moment";
import { permissions } from "../../shared/util/constants";
import Toast from "react-native-toast-message";

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
      let message;
      if (messageError !== "") {
        message = messageError;
      } else {
        switch (error.code) {
          case "auth/invalid-email":
            message = "Email ou senha incorretos";
            break;
          case "auth/user-disabled":
            message = "Usuário desabilitado";
            break;
          case "auth/user-not-found":
            message = "Usuário não encontrado";
            break;
          case "auth/wrong-password":
            message = "Email ou senha incorretos";
            break;
          default:
            message = "Erro ao fazer login";
            break;
        }
      }
      setMessageError(message);
      Toast.show({
        type: "error",
        text1: "Erro ao fazer login",
        text2: message,
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
        position: "bottom",
      });
      setErrorLogin(true);
      console.log(error);
    }
  };

  const saveUserToAsyncStorage = async (_user) => {
    _user.stsTokenManager.expirationTime = moment(
      _user.stsTokenManager.expirationTime
    ).add(1, "week");
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
      const options = Array.isArray(permissions[permission])
        ? permissions[permission]
        : [];

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
          const expirationTime = moment(
            parsedUser.stsTokenManager.expirationTime
          ).add(1, "week");
          const currentTime = moment();

          if (
            moment(expirationTime).isBefore(currentTime) &&
            parsedConfig &&
            parsedOptions
          ) {
            navigation.navigate("Menu", { idUser: parsedUser.uid });
          }
          // else {
          //   navigation.navigate("Menu", { idUser: parsedUser.uid });
          // }
        }
      });
    };

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
        <Text style={styles.error}>{messageError}</Text>
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