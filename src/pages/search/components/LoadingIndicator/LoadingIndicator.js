import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export const LoadingIndicator = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <ActivityIndicator animating={true} size="large" />
    </View>
  );
};
