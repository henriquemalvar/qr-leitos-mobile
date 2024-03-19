import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { styles } from "./styles";

export const LoadingIndicator = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} size="large" />
    </View>
  );
};
