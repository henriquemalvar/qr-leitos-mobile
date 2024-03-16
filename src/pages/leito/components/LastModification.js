import moment from "moment";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { convertTimestamp } from "../../../shared/util/dateUtils";

export const LastModification = ({ bed, lastLog }) => {
  const lastModification =
    convertTimestamp(bed.updated_at).format("DD/MM/YYYY HH:mm:ss") || "N/A";
  const lastModificationLabel = bed.updated_at
    ? "Última Modificação"
    : "Criado em";
  const hours = moment().diff(
    moment(lastModification, "DD/MM/YYYY HH:mm:ss"),
    "hours"
  );
  const diff =
    hours > 24
      ? `${moment().diff(
          moment(lastModification, "DD/MM/YYYY HH:mm:ss"),
          "days"
        )} dias`
      : `${hours} horas`;
  return (
    <View style={styles.containerDesc}>
      <View style={{ paddingBottom: 10 }}>
        <Text style={styles.detailsFont}>{lastModificationLabel} </Text>
        <Text style={styles.detailsEnd}>
          {lastModification} - {diff} atrás
        </Text>
        {lastLog?.userName && (
          <Text style={styles.detailsEnd}>
            Modificado por: {lastLog.userName}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerDesc: {
    backgroundColor: "#E7E6E1",
    width: "97%",
    flexDirection: "column",
    borderRadius: 15,
    marginBottom: 10,
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
