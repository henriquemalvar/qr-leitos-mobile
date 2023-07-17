import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import styles from "./style";
import db from "../../database/database";
import { stringify } from "flatted";

export default function QRCode({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [leito, setLeito] = useState(null);

  async function searchLeito(code) {
    try {
      const leitoRef = db.collection("beds").doc(code);
      const leitoDoc = await leitoRef.get();
      const leitoData = leitoDoc.data();
      setLeito(leitoData);
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

  const handleBarCodeScanned = async ({ data }) => {
    await searchLeito(data).then((result) => {
      if (result == false) {
        setCodigo("Leito não cadastrado");
      } else {
        setScanned(true);
        setCodigo(data);
      }
    });
  };

  const clearData = () => {
    setScanned(false);
    setCodigo("");
  };

  if (hasPermission === null) {
    return (
      <Text style={styles.text}>Aguardando permissão de acesso a câmera!</Text>
    );
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>Sem acesso a câmera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />
      <View>
        <Text style={styles.text}>{codigo}</Text>
      </View>
      {scanned && (
        <><TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("Leito", {
              leito: stringify(leito),
            });
            setScanned(false);
            setCodigo("");
          } }
        >
          <Text style={styles.textButton}>ACESSAR LEITO</Text>
        </TouchableOpacity><TouchableOpacity onPress={clearData}>
            <Text style={
              {
                color: "#fff",
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 20,
                backgroundColor: "red",
                padding: 10,
                borderRadius: 10,
              }
            }>LIMPAR</Text>
          </TouchableOpacity></>
      )}
    </View>
  );
}
