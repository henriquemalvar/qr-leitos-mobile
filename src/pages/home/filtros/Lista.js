import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { parse, stringify } from "flatted";
import styles from "./style";

export default function Lista({ route, navigation }) {
  const { leitos, cor } = route.params;
  const beds = parse(leitos);

  return (
    <View style={[styles.containerLeitos]}>
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
