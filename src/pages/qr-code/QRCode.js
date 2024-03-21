import { useIsFocused } from "@react-navigation/native";
import BedsService from "@services/BedsServices";
import globalStyles from "@styles/globalStyles";
import { theme } from "@styles/theme";
// import { Camera } from 'expo-camera';
import { BarCodeScanner } from "expo-barcode-scanner";
import { stringify } from "flatted";
import { useEffect, useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";
import styles from "./style";

const handleOpenSettings = () => {
  Linking.openSettings();
};

export default function QRCode({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [code, setCode] = useState("");
  const [leito, setLeito] = useState(null);
  const isFocused = useIsFocused();

  async function searchLeito(_id) {
    try {
      const bedData = await BedsService.getById(_id);
      setLeito(bedData);
    } catch (error) {
      console.error("Error searching for bed:", error);
      return false;
    }
  }

  useEffect(() => {
    (async () => {
      try {
        // const { status } = await Camera.requestCameraPermissionsAsync();
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (error) {
        console.error("Error requesting permissions:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setScanned(false);
      setCode("");
    }
  }, [isFocused]);

  const handleBarCodeScanned = ({ data }) => {
    try {
      searchLeito(data).then((result) => {
        if (result !== false) {
          setScanned(true);
          setCode(data);
        }
      });
    } catch (error) {
      console.error("Error handling barcode scan:", error);
    }
  };

  const clearData = async () => {
    setScanned(false);
    setCode("");
    setLeito(null);
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
        <TouchableOpacity onPress={handleOpenSettings}>
          <Text
            style={{
              ...globalStyles.textInPrimaryColor,
              fontSize: 20,
              textAlign: "center",
            }}
          >
            Abrir configurações
          </Text>
        </TouchableOpacity>
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
        <TouchableOpacity onPress={handleOpenSettings}>
          <Text
            style={{
              ...globalStyles.textInPrimaryColor,
              fontSize: 20,
            }}
          >
            Abrir configurações
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.page}>
      <View style={globalStyles.centeredContainer}>
        {isFocused ? (
          // <Camera
          //   onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          //   style={styles.scanner}
          // />
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.scanner}
          />
        ) : (
          <></>
        )}
        {scanned && (
          <>
            <TextInput
              style={{ margin: 10, fontSize: 20, height: 60, width: "93%" }}
              label="Código do leito"
              value={code}
              mode="outlined"
              disabled
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                clearData();
                navigation.navigate("Leito", {
                  leito: stringify(leito),
                  scanned: true,
                });
              }}
            >
              <Button
                mode="contained"
                contentStyle={{ height: 60, width: "100%" }}
                labelStyle={{ fontSize: 20 }}
              >
                ACESSAR LEITO
              </Button>
            </TouchableOpacity>
            <IconButton
              icon="refresh"
              size={50}
              onPress={clearData}
              iconColor={theme.colors.primary}
            />
          </>
        )}
      </View>
    </View>
  );
}
