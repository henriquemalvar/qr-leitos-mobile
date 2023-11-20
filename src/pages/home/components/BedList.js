import { FontAwesome } from "@expo/vector-icons";
import { stringify } from "flatted";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function BedList({ title, beds, color, navigation, disabled = false }) {
  if (typeof color !== "string") {
    color = "black";
  }

  return (
    <View>
      {beds.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            if (!disabled) {
              navigation.navigate("Lista", {
                leitos: stringify(beds),
                cor: color,
              });
            }
          }}
        >
          <View style={[styles.container]}>
            <View style={[styles.lives]}>
              <View style={[styles.head, { alignItems: "center" }]}>
                <FontAwesome
                  name="bed"
                  color={color}
                  style={{ fontSize: 24 }}
                />
                <Text style={[styles.title]}>
                  {" "}
                  {title} - {beds.length}
                </Text>
              </View>
              <Text style={styles.shortDescription}>
                Existem {beds.length} {title.toLowerCase()}
              </Text>
              <Text style={[styles.text, { paddingBottom: 10 }]}>
                {disabled ? "Ação desabilitada" : "Clique para ver mais"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  lives: {
    flexDirection: "column",
    backgroundColor: "#dcdcdc",
    width: "94%",
    height: 130,
    paddingTop: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  head: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 10,
  },
  shortDescription: {
    fontSize: 16,
    paddingTop: 25,
    alignSelf: "center",
  },
  longDescription: {
    fontSize: 12,
    paddingTop: 25,
    alignSelf: "center",
  },
  text: {
    color: "#6495ED",
    paddingTop: 12,
    fontSize: 12,
    alignSelf: "center",
  },
  occupation: {
    backgroundColor: "#dcdcdc",
    width: "94%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textOc: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
