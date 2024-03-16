import { FontAwesome } from "@expo/vector-icons";
import { stringify } from "flatted";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";

export default function SectorCard({
  sector,
  number,
  color,
  navigation,
  disabled = false,
}) {
  if (typeof color !== "string") {
    color = "black";
  }

  return (
    <View>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          navigation.navigate("Homepage", {
            sector: stringify(sector || ""),
          });
        }}
      >
        <View style={styles.container}>
          <View style={styles.lives}>
            <View style={[styles.head, styles.centerAlign]}>
              <FontAwesome name="building" color={color} style={styles.icon} />
              <Text style={styles.title}>
                {sector} - {number}
              </Text>
            </View>
            <Text style={styles.shortDescription}>
              Existem {number} leitos nesse setor
            </Text>
            <Text style={[styles.text, styles.paddingBottom]}>
              {disabled ? "Ação desabilitada" : "Clique para ver mais"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
