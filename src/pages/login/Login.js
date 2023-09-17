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
  //   onAuthStateChanged,
  //   createUserWithEmailAndPassword,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { stringify, parse } from "flatted";
import db from "../../database/database";
import moment from "moment";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      setErrorLogin(true);
      // console.error("loginFirebase", error.message);
      console.error(error.message);
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
      // console.error("saveUserConfigToAsyncStorage", error.message);
      return { error: error.message };
    }
  };

  const saveOptionsToAsyncStorage = async (permission = "default") => {
    try {
      const optionsDoc = await db
        .collection("options")
        .doc(`bed_options_${permission}`)
        .get();

      const options = optionsDoc.data();
      await AsyncStorage.setItem("options", stringify(options));
    } catch (error) {
      // console.error("saveOptionsToAsyncStorage", error.message);
      console.error(error);
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
          <Text style={styles.warningAlert}>Email ou senha inválidos</Text>
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
      {/* <Text style={styles.registration}>
        Não possui uma conta? Se inscreva
        <Text
          style={styles.linkSubscribe}
          // onPress={navigation.navigate("NewUser")}
        >
          {" "}
          aqui
        </Text>
      </Text> */}
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
}