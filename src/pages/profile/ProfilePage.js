import { useUpdate } from "@contexts/UpdateProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import globalStyles from "@styles/globalStyles";
import showMessage from "@utils/messageUtils";
import Constants from "expo-constants";
import { getAuth, signOut } from "firebase/auth";
import { parse } from "flatted";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button, List, Text, useTheme } from "react-native-paper";
import { PermissionInfoCard } from "./components/PermissionInfoCard/PermissionInfoCard";
import { ProfileHeader } from "./components/ProfileHeader/ProfileHeader";
import { EmailCard } from "./components/UserEmail/UserEmail";
import styles from "./styles";

const ProfilePage = ({ navigation }) => {
  const [user, setUser] = useState("");
  const { colors } = useTheme();
  const { fetchUpdateLink, handleNewUpdateLink, handleError, compareVersions } =
    useUpdate();

  useEffect(() => {
    async function fetchUserConfig() {
      try {
        const userConfig = await AsyncStorage.getItem("userConfig");
        if (userConfig) {
          setUser(parse(userConfig));
        }
      } catch (error) {
        console.error("Error fetching userConfig:", error);
      }
    }

    fetchUserConfig();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      await AsyncStorage.multiRemove(["token", "user", "userConfig"]);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro durante o logout:", error);
      showMessage("error", "Erro ao fazer logout", error.message);
    }
  };

  const handleCheckUpdates = async () => {
    try {
      const { link, version } = await fetchUpdateLink();
      const currentVersion = Constants.expoConfig.version;

      if (version && compareVersions(version, currentVersion) > 0) {
        await handleNewUpdateLink(link, version);
      } else {
        showMessage(
          "info",
          "Atualizações",
          "Você já está na versão mais recente."
        );
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <View style={globalStyles.page}>
      <ProfileHeader user={user} />
      <PermissionInfoCard user={user} />
      <EmailCard user={user} />
      <List.Item
        title="Verificar atualizações"
        style={globalStyles.card}
        onPress={handleCheckUpdates}
        right={() => <List.Icon icon="update" />}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogout}>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Sair
          </Button>
        </TouchableOpacity>
      </View>
      <View style={styles.versionContainer}>
        <Text style={styles.appInfo}>
          App Version: {Constants.expoConfig.version}
        </Text>
      </View>
    </View>
  );
};

export default ProfilePage;
