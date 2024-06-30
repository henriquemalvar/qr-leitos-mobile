import { AUTH_DOMAIN, AUTH_SECRET } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import globalStyles from "@styles/globalStyles";
import showMessage from "@utils/messageUtils";
import CryptoJS from "crypto-js";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const ACCESS_TIME = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const REST_TIME = 12 * 60 * 60 * 1000; // 12 hours in milliseconds for rest

const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, AUTH_SECRET);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedData)
      throw new Error("Dados decifrados estão vazios ou corrompidos.");
    return decryptedData;
  } catch (error) {
    console.error("Erro ao decifrar os dados: ", error.message);
    return null;
  }
};

export default function StartShift({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
      if (await checkAccess()) {
        showMessage(
          "success",
          "Acesso ainda válido.",
          "Redirecionando para o menu principal."
        );
        navigation.navigate("Menu", { idUser: route.params.idUser });
      }
    })();
  }, [isFocused]);

  const checkAccess = async () => {
    const lastAccess = await AsyncStorage.getItem("lastAccess");
    const now = Date.now();

    if (lastAccess) {
      const timeSinceLastAccess = now - parseInt(lastAccess);
      if (timeSinceLastAccess < ACCESS_TIME) {
        return true;
      } else if (timeSinceLastAccess < ACCESS_TIME + REST_TIME) {
        showMessage(
          "error",
          "Acesso não concedido",
          "Você deve esperar " +
            ((ACCESS_TIME + REST_TIME - timeSinceLastAccess) / 3600000).toFixed(
              1
            ) +
            " horas antes de escanear novamente."
        );
        return false;
      }
    }
    return false;
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (await checkAccess()) {
      navigation.navigate("Menu", { idUser: route.params.idUser });
      return;
    }

    const decryptedData = decryptData(data);
    if (decryptedData === AUTH_DOMAIN) {
      await AsyncStorage.setItem("lastAccess", Date.now().toString());
      showMessage(
        "success",
        "Acesso concedido",
        "QR Code autorizado com sucesso. Acesso válido por 12 horas."
      );
      navigation.navigate("Menu", { idUser: route.params.idUser });
    } else {
      showMessage("error", "Acesso não concedido", "QR Code inválido.");
    }
  };

  if (hasPermission === null) {
    return (
      <View style={{ ...globalStyles.page, ...globalStyles.centeredContainer }}>
        <Text
          style={{ ...globalStyles.title, fontSize: 30, textAlign: "center" }}
        >
          Aguardando permissão de acesso à câmera!
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={{ ...globalStyles.page, ...globalStyles.centeredContainer }}>
        <Text style={{ ...globalStyles.title, fontSize: 30 }}>
          Sem acesso à câmera
        </Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.page}>
      <View style={globalStyles.centeredContainer}>
        {isFocused && (
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={{
              borderRadius: 20,
              height: 300,
              width: 300,
              marginBottom: 20,
            }}
          />
        )}
      </View>
    </View>
  );
}
