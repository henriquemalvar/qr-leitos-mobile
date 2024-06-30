import AsyncStorage from "@react-native-async-storage/async-storage";
import { permissionsIcons } from "@utils/constantsUtils";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import { styles } from "./styles";

export const ProfileHeader = ({ user }) => {
  const { colors } = useTheme();
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const loadSelectedProfile = async () => {
      const profile = await AsyncStorage.getItem("selectedProfile");
      if (profile) {
        setSelectedProfile(profile);
      }
    };

    loadSelectedProfile();
  }, []);

  const icon = permissionsIcons[user.permission] || "account";

  return (
    <View style={styles.container}>
      <Avatar.Icon
        size={80}
        icon={icon}
        style={{ backgroundColor: colors.primary }}
      />
      <View>
        <Text
          style={{
            ...styles.text,
            color: colors.primary,
          }}
        >
          {selectedProfile || user.name}
        </Text>
      </View>
    </View>
  );
};
