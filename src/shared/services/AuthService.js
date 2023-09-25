import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { parse, stringify } from "flatted";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import db from "../../database/database";
import showMessage from "../util/messageUtils";

const authService = {
  async handleLogin(email, password) {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await authService.saveUserToAsyncStorage(userCredential.user);
    await authService.saveUserConfigToAsyncStorage(email);

    return userCredential.user.uid;
  },

  handleLoginError(error) {
    let message = error.message;

    if (!message) {
      console.log(error.code);
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
  },

  async saveUserToAsyncStorage(_user) {
    _user.stsTokenManager.expirationTime = moment(
      _user.stsTokenManager.expirationTime
    ).add(1, "week");
    await AsyncStorage.setItem("user", stringify(_user));
  },

  async saveUserConfigToAsyncStorage(email) {
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
  },

  async getUserFromAsyncStorage() {
    try {
      const user = await AsyncStorage.getItem("user");
      return parse(user);
    } catch (error) {
      throw error;
    }
  },

  async getUserConfigFromAsyncStorage() {
    try {
      const userConfig = await AsyncStorage.getItem("userConfig");
      return parse(userConfig);
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await AsyncStorage.multiRemove(["user", "userConfig"]);
    } catch (error) {
      throw error;
    }
  },

  validateToken() {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.getUserFromAsyncStorage();
        const userConfig = await this.getUserConfigFromAsyncStorage();

        if (!user || !userConfig) {
          throw new Error("User not found");
        }

        const expirationTime = moment(user.stsTokenManager.expirationTime).add(
          1,
          "week"
        );
        const currentTime = moment();

        if (moment(expirationTime).isBefore(currentTime)) {
          throw new Error("Token expired");
        }

        resolve({ user, userConfig });
      } catch (error) {
        reject(error);
      }
    });
  },

  validateUser(navigation) {
    this.validateToken()
      .then(({ user, userConfig }) => {
        navigation.navigate("Menu", { idUser: user.uid });
      })
      .catch((error) => {
        navigation.navigate("Login");
      });
  },
};

export default authService;
