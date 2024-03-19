import { MaterialCommunityIcons } from "@expo/vector-icons";
import globalStyles from "@styles/globalStyles";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useLogin } from "./hook/useLogin";
import styles from "./styles";

export default function Login({ navigation }) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    handleLogin,
  } = useLogin(navigation);
  const theme = useTheme();
  return (
    <View style={globalStyles.page}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={globalStyles.centeredContainer}
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
            style={styles.input}
            secureTextEntry={!showPassword}
            placeholder="Digite a senha:"
            type="email"
            onChangeText={(text) => setPassword(text)}
            value={password}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.inputIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#bdbdbd"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
          <Button
            mode="contained"
            style={[styles.button]}
            disabled={!email || !password}
          >
            Entrar
          </Button>
        </TouchableOpacity>
        <Button
          style={styles.buttonRecovery}
          onPress={() => navigation.navigate("PasswordRecovery")}
        >
          Esqueceu a senha?
        </Button>
      </KeyboardAvoidingView>
    </View>
  );
}
