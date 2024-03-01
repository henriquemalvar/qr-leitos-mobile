import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { parse, stringify } from "flatted";
import styles from "./style";
import BedsService from "../../../shared/services/BedsServices";

export default function Lista({ route, navigation }) {
  const { cor, status, sector } = route.params;
  const [beds, setBeds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const statusList = parse(status);
      const bedsPromises = statusList ? statusList.map((status) =>
        sector ? BedsService.getByStatusAndSection(status, sector) : BedsService.getByStatus(status)
      ) : [];
      const bedsArrays = await Promise.all(bedsPromises);
      const combinedBeds = bedsArrays.flat();
      combinedBeds.sort((a, b) => sortBeds(a.name, b.name));
      setBeds(combinedBeds);
    };
    fetchData();
  }, []);

  function sortBeds(a, b) {
    const partsA = splitAlphaNum(a);
    const partsB = splitAlphaNum(b);

    for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
      const partA = partsA[i];
      const partB = partsB[i];

      if (!isNaN(partA) && !isNaN(partB)) {
        const diff = parseInt(partA, 10) - parseInt(partB, 10);
        if (diff !== 0) return diff;
      } else if (partA !== partB) {
        return partA.localeCompare(partB);
      }
    }
    return partsA.length - partsB.length;
  }

  function splitAlphaNum(str) {
    return str.match(/[A-Za-z]+|\d+/g) || [];
  }

  return (
    <View style={[styles.bedContainer]}>
      {beds && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={beds}
          renderItem={({ item: bed }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Leito", {
                    leito: stringify(bed),
                  });
                }}
              >
                <View style={styles.bed}>
                  <FontAwesome
                    name="bed"
                    color={cor}
                    style={styles.available}
                  />
                  <Text style={styles.titleText}>{bed.name}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}
