import { StyleSheet, Text, View } from "react-native";

export function OccupancyRate({ percentage }) {
  return (
    <View style={styles.container}>
      <View style={styles.occupation}>
        <Text style={styles.textOc}>
          Taxa de Ocupação: {percentage.toFixed(2)}%
        </Text>
      </View>
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
