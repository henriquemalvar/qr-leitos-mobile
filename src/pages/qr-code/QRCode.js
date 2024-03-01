import { useIsFocused } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { stringify } from "flatted";
import React, { useEffect, useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import BedsService from "../../shared/services/BedsServices";
import showMessage from "../../shared/util/messageUtils";
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
      return false;
    }
  }

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    // checkConnection();

    if (isFocused) {
      setScanned(false);
      setCode("");
    }
  }, [isFocused]);

  const handleBarCodeScanned = ({ data }) => {
    searchLeito(data)
      .then((result) => {
        if (result === false) {
          showMessage("error", "Erro ao buscar leito", "Leito não encontrado");
        } else {
          setScanned(true);
          setCode(data);
        }
      })
      .catch((error) => {
        console.error(error);
        showMessage("error", "Erro ao buscar leito", error.message);
      });
  };

  const clearData = async () => {
    setScanned(false);
    setCode("");
    setLeito(null);
  };

  if (hasPermission === null) {
    return (
      <Text style={styles.text}>Aguardando permissão de acesso a câmera!</Text>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sem acesso a câmera</Text>
        <TouchableOpacity onPress={handleOpenSettings}>
          <Text style={styles.configButton}>Abrir configurações</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused ? (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}
        />
      ) : (
        <></>
      )}
      <View>
        <Text style={styles.text}>{code}</Text>
      </View>
      {true && (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              clearData();
              navigation.navigate("Leito", {
                leito: stringify(leito),
                scanned: true,
              });
            }}
          >
            <Text style={styles.textButton}>ACESSAR LEITO</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearData}>
            <Icon
              name="refresh"
              size={30}
              color="#fff"
              style={styles.refreshButton}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
