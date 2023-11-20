import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { parse, stringify } from "flatted";
import styles from "./style";

export default function Lista({ route, navigation }) {
  const { leitos, cor } = route.params;
  const beds = parse(leitos);

  const sortedBeds = beds.sort((a, b) => {
    const partsA = splitAlphaNum(a.name);
    const partsB = splitAlphaNum(b.name);

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
  });

  function splitAlphaNum(str) {
    return str.match(/[A-Za-z]+|\d+/g) || [];
  }


  return (
    <View style={[styles.containerLeitos]}>
      {sortedBeds && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={sortedBeds}
          renderItem={({ item: bed }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Leito", {
                    leito: stringify(bed),
                  });
                }}
              >
                <View style={styles.leito}>
                  <FontAwesome name="bed" color={cor} style={styles.livre} />
                  <Text style={styles.title}>{bed.name}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}