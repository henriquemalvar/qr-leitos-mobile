import { AUTH_DOMAIN, AUTH_SECRET } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import globalStyles from "@styles/globalStyles";
import showMessage from "@utils/messageUtils";
import CryptoJS from "crypto-js";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, AUTH_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export default function StartShift({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    const decryptedData = decryptData(data);
    const lastScan = await AsyncStorage.getItem("lastScan");
    const now = Date.now();
    const restTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (lastScan && now - parseInt(lastScan) < restTime) {
      showMessage(
        "error",
        "Acesso não concedido",
        "Você já realizou uma leitura recentemente."
      );
      return;
    }

    if (decryptedData === AUTH_DOMAIN) {
      setScanned(true);
      await AsyncStorage.setItem("lastScan", now.toString());
      showMessage(
        "success",
        "Acesso concedido",
        "QR Code autorizado com sucesso"
      );
      navigation.navigate("Menu", { idUser: route.params.idUser });
    } else {
      setScanned(false);
      showMessage("error", "Acesso não concedido", "QR Code inválido.");
    }
  };

  if (hasPermission === null) {
    return (
      <View style={{ ...globalStyles.page, ...globalStyles.centeredContainer }}>
        <Text
          style={{
            ...globalStyles.title,
            fontSize: 30,
            textAlign: "center",
          }}
        >
          Aguardando permissão de acesso a câmera!
        </Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={{ ...globalStyles.page, ...globalStyles.centeredContainer }}>
        <Text
          style={{
            ...globalStyles.title,
            fontSize: 30,
          }}
        >
          Sem acesso a câmera
        </Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.page}>
      <View style={globalStyles.centeredContainer}>
        {isFocused ? (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{
              borderRadius: 20,
              height: 300,
              overflow: "hidden",
              width: 300,
              marginBottom: 20,
            }}
          />
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}
