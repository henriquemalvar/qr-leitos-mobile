import globalStyles from "@styles/globalStyles";
import showMessage from "@utils/messageUtils";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import styles from "./styles";

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const auth = getAuth();

  const handlePasswordRecovery = async () => {
    setLoading(true);
    await sendPasswordResetEmail(auth, email)
      .then(() => {
        showMessage({
          type: "success",
          text1: "Recuperação de senha",
          text2:
            "Email de recuperação de senha enviado. Por favor, verifique sua caixa de entrada.",
        });
        setEmail("");
      })
      .catch((error) => {
        showMessage({
          type: "error",
          text1: "Erro ao enviar email",
          text2: "Verifique se o email está correto e tente novamente.",
        });
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <View style={globalStyles.page}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={globalStyles.centeredContainer}
      >
        <Text style={[globalStyles.title, { color: theme.colors.primary }]}>
          Recuperação de senha
        </Text>
        <Text style={styles.description}>
          Digite o email associado à sua conta para receber um link de
          recuperação de senha.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o email:"
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoCapitalize="none"
        />
        <TouchableOpacity activeOpacity={0.8} onPress={handlePasswordRecovery}>
          <Button mode="contained" style={styles.button} loading={loading}>
            Recuperar senha
          </Button>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}
