import AsyncStorage from "@react-native-async-storage/async-storage";
import showMessage from "@utils/messageUtils";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { stringify } from "flatted";
import { useEffect, useState } from "react";
import db from "../../../database/database";

export const useLogin = (navigation) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showMessage("error", "Erro ao fazer login", "Preencha todos os campos.");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
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
    const idTokenResult = await _user.getIdTokenResult();
    _user.expirationTime = idTokenResult.expirationTime;
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
        const parsedUser = JSON.parse(user);
        const parsedConfig = JSON.parse(config);

        const currentTime = new Date().getTime();

        const expirationTime = parsedUser[4].expirationTime;

        if (expirationTime > currentTime) {
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
  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
  };
};
