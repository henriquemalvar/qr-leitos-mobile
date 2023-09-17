import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { stringify } from "flatted";

import db from "../../database/database";
import { statusToColor } from "../../shared/util/constants";

export default function ListStatus({ navigation }) {
  const [arrAvailable, setArrAvailable] = useState([]);
  const [arrOccupied, setArrOccupied] = useState([]);
  const [arrCleaning, setArrCleaning] = useState([]);
  const [arrBedding, setArrBedding] = useState([]);
  const [percentage, setPercentage] = useState(0);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await db.collection("beds").get();
        let arr = [];
        let availableArr = [];
        let occupiedArr = [];
        let cleaningArr = [];
        let beddingArr = [];

        response.docs.forEach((doc) => {
          if (doc.data().active === false) return;
          switch (doc.data().status) {
            case "available":
              availableArr.push(doc.data());
              break;
            case "occupied":
            case "discharge":
              occupiedArr.push(doc.data());
              break;
            case "awaiting_for_cleaning":
            case "cleaning_in_progress":
              cleaningArr.push(doc.data());
              break;
            case "awaiting_for_bedding":
            case "bedding_in_progress":
              beddingArr.push(doc.data());
              break;
          }
          arr.push(doc.data());
        });

        setArrAvailable(availableArr);
        setArrOccupied(occupiedArr);
        setArrCleaning(cleaningArr);
        setArrBedding(beddingArr);

        setPercentage(() => {
          return (occupiedArr.length * 100) / arr.length;
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const _getColor = (status) => {
    return statusToColor[status] || "black";
  }

  return (
    <View>
      <View>
        <View style={[styless.container]}>
          <View style={styless.ocupacao}>
            <Text style={styless.textOc}>
              Taxa de Ocupação: {percentage.toFixed(2)}%
            </Text>
          </View>
        </View>

        {arrAvailable.length != 0 && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Lista", {
                leitos: stringify(arrAvailable),
                cor: _getColor('available'),
              });
            }}
          >
            <View style={[styless.container]}>
              <View style={[styless.lives]}>
                <View style={[styless.head]}>
                  <FontAwesome name="bed" style={styless.livre} />
                  <Text style={[styless.title]}>
                    {" "}
                    LEITOS LIVRES - {arrAvailable.length}
                  </Text>
                </View>
                <Text style={styless.shortdescription}>
                  NO MOMENTO EXISTEM {arrAvailable.length} LEITOS LIVRES
                </Text>
                <Text style={styless.text}>TOQUE MAIS INFORMAÇÕES!</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        <View>
          {arrOccupied.length != 0 && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Lista", {
                  leitos: stringify(arrOccupied),
                  cor: _getColor('occupied'),
                });
              }}
            >
              <View style={[styless.container]}>
                <View style={[styless.lives]}>
                  <View style={[styless.head]}>
                    <FontAwesome name="bed" style={styless.ocupado} />
                    <Text style={[styless.title]}>
                      {" "}
                      LEITOS OCUPADOS - {arrOccupied.length}
                    </Text>
                  </View>
                  <Text style={styless.shortdescription}>
                    NO MOMENTO EXISTEM {arrOccupied.length} LEITOS OCUPADOS
                  </Text>
                  <Text style={styless.text}>TOQUE MAIS INFORMAÇÕES!</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {arrCleaning.length != 0 && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Lista", {
              leitos: stringify(arrCleaning),
              cor: _getColor('awaiting_for_cleaning'),
            });
          }}
        >
          <View style={[styless.container]}>
            <View style={[styless.lives]}>
              <View style={[styless.head]}>
                <FontAwesome name="bed" style={styless.limpeza} />
                <Text style={[styless.title]}>
                  {" "}
                  LEITOS HIGIENIZAÇÃO - {arrCleaning.length}
                </Text>
              </View>
              <Text style={styless.longdescription}>
                NO MOMENTO EXISTEM {arrCleaning.length} LEITOS AGUARDANDO HIGIENIZAÇÃO
              </Text>
              <Text style={styless.text}>TOQUE MAIS INFORMAÇÕES!</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      <View>
        {arrBedding.length != 0 && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Lista", {
                leitos: stringify(arrBedding),
                cor: _getColor('awaiting_for_bedding'),
              });
            }}
          >
            <View style={[styless.container]}>
              <View style={[styless.lives]}>
                <View style={[styless.head]}>
                  <FontAwesome name="bed" style={styless.forragem} />
                  <Text style={[styless.title]}>
                    {" "}
                    LEITOS FORRAGEM - {arrBedding.length}
                  </Text>
                </View>
                <Text style={styless.longdescription}>
                  NO MOMENTO EXISTEM {arrBedding.length} LEITOS AGUARDANDO FORRAGEM
                </Text>
                <Text style={styless.text}>TOQUE MAIS INFORMAÇÕES!</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styless = StyleSheet.create({
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
