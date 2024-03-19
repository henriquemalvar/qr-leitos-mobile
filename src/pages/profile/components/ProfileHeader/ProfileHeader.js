import { permissionsIcons } from "@utils/constantsUtils";
import { Text, View } from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import { styles } from "./styles";

export const ProfileHeader = ({ user }) => {
  const { colors } = useTheme();
  const icon = permissionsIcons[user.permission] || "account";

  return (
    <View style={styles.container}>
      <Avatar.Icon
        size={80}
        icon={icon}
        style={{backgroundColor: colors.primary}}
      />
      <View>
        <Text style={{
          ...styles.text,
          color: colors.primary
        }}>{user.name}</Text>
      </View>
    </View>
  );
};
