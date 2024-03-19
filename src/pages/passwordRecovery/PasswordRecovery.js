import globalStyles from "@styles/globalStyles";
import showMessage from "@utils/messageUtils";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import styles from "./styles";

export default function PasswordRecovery() {
  const [email, setEmail] = useState("");
  const theme = useTheme();
  const auth = getAuth();

  const handlePasswordRecovery = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      showMessage(
        "success",
        "Recuperação de senha",
        "Email de recuperação de senha enviado. Por favor, verifique sua caixa de entrada."
      );
    } catch (error) {
      showMessage(
        "error",
        "Recuperação de senha",
        "Erro ao enviar email de recuperação de senha. Por favor, tente novamente."
      );
      console.error(error);
    }
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
          <Button mode="contained" style={styles.button}>
            Recuperar senha
          </Button>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}
