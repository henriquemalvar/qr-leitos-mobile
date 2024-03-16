import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const BedDetails = ({ bed }) => {
  return (
    <>
      <View style={styles.title}>
        <Text style={styles.titleFont}>{bed.name}</Text>
      </View>
      <View style={styles.containerDesc}>
        <View style={{ paddingBottom: 10 }}>
          <Text style={styles.detailsFont}>Endereço </Text>
          <Text style={styles.detailsEnd}>
            {Array.isArray(bed.location)
              ? bed.location.map((field) => {
                  return <Text key={field}>{field} </Text>;
                })
              : null}
          </Text>
        </View>
      </View>
      <View style={styles.containerDesc}>
        <View style={{ paddingBottom: 10 }}>
          <Text style={styles.detailsFont}>Tipo </Text>
          <Text style={styles.detailsEnd}>
            {Array.isArray(bed.type)
              ? bed.type.map((field) => {
                  return <Text key={field}>{field} </Text>;
                })
              : null}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: "#dcdcdc",
    width: "97%",
    flexDirection: "row",
    height: 75,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  containerDesc: {
    backgroundColor: "#E7E6E1",
    width: "97%",
    flexDirection: "column",
    borderRadius: 15,
    marginBottom: 10,
  },
  titleFont: {
    fontSize: 32,
    paddingLeft: 10,
    fontWeight: "bold",
    color: "#198CFF",
  },
  detailsFont: {
    fontSize: 24,
    paddingLeft: 10,
    fontWeight: "bold",
    paddingBottom: 5,
    paddingTop: 10,
  },
  detailsEnd: {
    fontSize: 20,
    paddingLeft: 10,
    paddingTop: 1,
  },
});
