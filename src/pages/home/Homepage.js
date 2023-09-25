import { useEffect, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { stringify } from "flatted";
import db from "../../database/database";
import { ScrollView } from "react-native-gesture-handler";
import { _getColor } from "../../shared/util/translationUtils";

function OccupancyRate({ percentage }) {
  return (
    <View style={styles.container}>
      <View style={styles.ocupacao}>
        <Text style={styles.textOc}>
          Taxa de Ocupação: {percentage.toFixed(2)}%
        </Text>
      </View>
    </View>
  );
}

function BedList({ title, beds, color, navigation }) {
  if (typeof color !== "string") {
    color = "black";
  }

  return (
    <View>
      {beds.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Lista", {
              leitos: stringify(beds),
              cor: color,
            });
          }}
        >
          <View style={[styles.container]}>
            <View style={[styles.lives]}>
              <View style={[styles.head]}>
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
              <Text style={styles.shortdescription}>
                NO MOMENTO EXISTEM {beds.length} {title.toUpperCase()}
              </Text>
              <Text style={styles.text}>TOQUE MAIS INFORMAÇÕES!</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function ListStatus({ route, navigation }) {
  const [beds, setBeds] = useState([]);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const unsubscribe = db.collection("beds").onSnapshot((snapshot) => {
      const beds = snapshot.docs
        .filter((doc) => doc.data().active !== false)
        .map((doc) => doc.data());

      setBeds(beds);
    });

    return () => unsubscribe();
  }, []);

  const [arrAvailable, arrOccupied, arrCleaning, arrBedding, arrMaintenance, arrBlocked] = useMemo(() => {
    const availableArr = beds.filter((bed) => bed.status === "available");
    const occupiedArr = beds.filter((bed) => bed.status === "occupied" || bed.status === "discharge");
    const cleaningArr = beds.filter((bed) => bed.status === "awaiting_for_cleaning" || bed.status === "cleaning_in_progress");
    const beddingArr = beds.filter((bed) => bed.status === "awaiting_for_bedding" || bed.status === "bedding_in_progress");
    const arrMaintenance = beds.filter((bed) => bed.isMaintenance);
    const arrBlocked = beds.filter((bed) => bed.isBlocked);

    setPercentage((occupiedArr.length * 100) / beds.length);

    return [availableArr, occupiedArr, cleaningArr, beddingArr, arrMaintenance, arrBlocked, percentage];
  }, [beds]);

  return (
    <ScrollView>
      <OccupancyRate percentage={percentage} />
      <BedList
        title="Leitos Livres"
        beds={arrAvailable}
        color={_getColor("available")}
        navigation={navigation}
      />
      <BedList
        title="Leitos Ocupados"
        beds={arrOccupied}
        color={_getColor("occupied")}
        navigation={navigation}
      />
      <BedList
        title="Leitos Higienização"
        beds={arrCleaning}
        color={_getColor("awaiting_for_cleaning")}
        navigation={navigation}
      />
      <BedList
        title="Leitos Forragem"
        beds={arrBedding}
        color={_getColor("awaiting_for_bedding")}
        navigation={navigation}
      />
      <BedList
        title="Leitos em Manutenção"
        beds={arrMaintenance}
        color={_getColor("maintenance")}
        navigation={navigation}
      />
      <BedList
        title="Leitos Bloqueados"
        beds={arrBlocked}
        color={_getColor("blocked")}
        navigation={navigation}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 10,
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
  livre: {
    fontSize: 26,
    color: "green",
  },
  ocupado: {
    fontSize: 26,
    color: "red",
  },
  limpeza: {
    fontSize: 26,
    color: "blue",
  },
  forragem: {
    fontSize: 26,
    color: "yellow",
  },
  head: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 10,
  },
  shortdescription: {
    fontSize: 16,
    paddingTop: 25,
    alignSelf: "center",
  },
  longdescription: {
    fontSize: 12,
    paddingTop: 25,
    alignSelf: "center",
  },
  text: {
    color: "#6495ED",
    paddingTop: 20,
    fontSize: 12,
    alignSelf: "center",
  },
  ocupacao: {
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