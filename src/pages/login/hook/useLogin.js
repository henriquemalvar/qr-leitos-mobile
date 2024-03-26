import AsyncStorage from "@react-native-async-storage/async-storage";
import showMessage from "@utils/messageUtils";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { parse, stringify } from "flatted";
import { useEffect, useState } from "react";
import db from "../../../database/database";

export const useLogin = (navigation) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    if (!email.trim() || !password.trim()) {
      showMessage({
        type: "error",
        text1: "Erro ao fazer login",
        text2: "Preencha todos os campos.",
      });
      setLoading(false);
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
    setLoading(false);
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
    showMessage({
      type: "error",
      text1: "Erro ao fazer login",
      text2: message,
    });
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
      const user = await AsyncStorage.getItem("user").then((user) =>
        user ? parse(user) : null
      );
      const config = await AsyncStorage.getItem("userConfig").then((config) =>
        config ? parse(config) : null
      );

      if (user && config) {
        const currentTime = new Date().getTime();

        const expirationTime = user.stsTokenManager.expirationTime;

        if (expirationTime > currentTime) {
          showMessage({
            type: "success",
            text1: "Bem vindo de volta",
            text2: config?.name || "",
          });
          navigation.navigate("Menu", { idUser: user.uid });
        } else {
          showMessage({
            type: "error",
            text1: "Sessão expirada",
            text2: "Faça login novamente para continuar.",
          });
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
    loading,
  };
};
