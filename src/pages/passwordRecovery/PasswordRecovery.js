import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import showMessage from "../../shared/util/messageUtils";
import styles from "./styles";

export default function PasswordRecovery() {
  const [email, setEmail] = useState("");
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
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.explanation}>
        Digite o email associado à sua conta para receber um link de recuperação
        de senha.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o email:"
        type="text"
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordRecovery}>
        <Text style={styles.textButton}>Recuperar senha</Text>
      </TouchableOpacity>
    </View>
  );
}
