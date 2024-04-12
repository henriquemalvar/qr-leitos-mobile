import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import globalStyles from "@styles/globalStyles";
import showMessage from "@utils/messageUtils";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function StartShift({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [checked, setChecked] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const lastScan = await AsyncStorage.getItem("lastScan");
      const qrValue = await AsyncStorage.getItem("qrValue");

      if (lastScan && qrValue) {
        const now = Date.now();
        const lastScanValue = parseInt(lastScan);
        const qrValueInt = parseInt(qrValue);

        if (now > qrValueInt || now < lastScanValue) {
          setScanned(false);
          await AsyncStorage.removeItem("lastScan");
          await AsyncStorage.removeItem("qrValue");
          showMessage(
            "error",
            "Acesso não concedido",
            "Por favor, escaneie outro QR Code."
          );
        } else {
          setScanned(true);
          showMessage("success", "Acesso concedido", "QR Code escaneado com sucesso");
          navigation.navigate("Menu", { idUser: route.params.idUser });
        }
      }
      setChecked(true);
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    const now = Date.now();
    const qrValue = parseInt(data);

    if (now > qrValue) {
      setScanned(false);
      showMessage(
        "error",
        "Acesso não concedido",
        "Por favor, escaneie outro QR Code."
      );
      return;
    }

    setScanned(true);
    await AsyncStorage.setItem("lastScan", now.toString());
    await AsyncStorage.setItem("qrValue", data);
    showMessage("success", "Acesso concedido", "QR Code escaneado com sucesso");

    navigation.navigate("Menu", { idUser: route.params.idUser });
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
        {isFocused && checked ? (
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
