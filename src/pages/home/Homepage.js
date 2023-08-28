import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { stringify } from "flatted";

import db from "../../database/database";

export default function ListStatus({ navigation }) {
  const [livre, setLivres] = useState([]);
  const [ocupados, setOcupados] = useState([]);
  const [aLimp, setALimp] = useState([]);
  const [aFor, setAFor] = useState([]);
  const [ocupacao, setOcupacao] = useState(0);

  useEffect(() => {
    db.collection("beds")
      .where("active", "==", true)
      .onSnapshot((response) => {
        let arr = [];
        let availableArr = [];
        let occupiedArr = [];
        let cleaningArr = [];
        let beddingArr = [];

        response.docs.forEach((doc) => {
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

        setLivres(availableArr);
        setOcupados(occupiedArr);
        setALimp(cleaningArr);
        setAFor(beddingArr);

        setOcupacao(() => {
          return (occupiedArr.length * 100) / arr.length;
        });
      });
  }, []);

  return (
    <View>
      <View>
        <View style={[styless.container]}>
          <View style={styless.ocupacao}>
            <Text style={styless.textOc}>
              Taxa de Ocupação: {ocupacao.toFixed(2)}%
            </Text>
          </View>
        </View>

        {livre.length != 0 && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Lista", {
                leitos: stringify(livre),
                cor: "green",
              });
            }}
          >
            <View style={[styless.container]}>
              <View style={[styless.lives]}>
                <View style={[styless.head]}>
                  <FontAwesome name="circle" style={styless.livre} />
                  <Text style={[styless.title]}>
                    {" "}
                    LEITOS LIVRES - {livre.length}
                  </Text>
                </View>
                <Text style={styless.shortdescription}>
                  NO MOMENTO EXISTEM {livre.length} LEITOS LIVRES
                </Text>
                <Text style={styless.text}>TOQUE MAIS INFORMAÇÕES!</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        <View>
          {ocupados.length != 0 && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Lista", {
                  leitos: stringify(ocupados),
                  cor: "red",
                });
              }}
            >
              <View style={[styless.container]}>
                <View style={[styless.lives]}>
                  <View style={[styless.head]}>
                    <FontAwesome name="circle" style={styless.ocupado} />
                    <Text style={[styless.title]}>
                      {" "}
                      LEITOS OCUPADOS - {ocupados.length}
                    </Text>
                  </View>
                  <Text style={styless.shortdescription}>
                    NO MOMENTO EXISTEM {ocupados.length} LEITOS OCUPADOS
                  </Text>
                  <Text style={styless.text}>TOQUE MAIS INFORMAÇÕES!</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {aLimp.length != 0 && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Lista", {
              leitos: stringify(aLimp),
              cor: "blue",
            });
          }}
        >
          <View style={[styless.container]}>
            <View style={[styless.lives]}>
              <View style={[styless.head]}>
                <FontAwesome name="circle" style={styless.limpeza} />
                <Text style={[styless.title]}>
                  {" "}
                  LEITOS HIGIENIZAÇÃO - {aLimp.length}
                </Text>
              </View>
              <Text style={styless.longdescription}>
                NO MOMENTO EXISTEM {aLimp.length} LEITOS AGUARDANDO HIGIENIZAÇÃO
              </Text>
              <Text style={styless.text}>TOQUE MAIS INFORMAÇÕES!</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      <View>
        {aFor.length != 0 && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Lista", {
                leitos: stringify(aFor),
                cor: "yellow",
              });
            }}
          >
            <View style={[styless.container]}>
              <View style={[styless.lives]}>
                <View style={[styless.head]}>
                  <FontAwesome name="circle" style={styless.forragem} />
                  <Text style={[styless.title]}>
                    {" "}
                    LEITOS FORRAGEM - {aFor.length}
                  </Text>
                </View>
                <Text style={styless.longdescription}>
                  NO MOMENTO EXISTEM {aFor.length} LEITOS AGUARDANDO FORRAGEM
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
