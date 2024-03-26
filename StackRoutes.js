import Menu from "@components/Menu";
import UserChip from "@components/UserChip";
import BedPage from "@pages/bed/BedPage";
import BedStatusPage from "@pages/home/BedStatusPage";
import BedListPage from "@pages/home/components/BedListPage";
import LoginPage from "@pages/login/LoginPage";
import PasswordRecoveryPage from "@pages/passwordRecovery/PasswordRecoveryPage";
import ProfilePage from "@pages/profile/ProfilePage";
import SearchPage from "@pages/search/SearchPage";
import SectorListPage from "@pages/sectors/SectorListPage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import { parse } from "flatted";
import * as React from "react";

const Stack = createStackNavigator();

export default function StackRoutes() {
  const [parsedUser, setParsedUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    AsyncStorage.getItem("userConfig")
      .then((user) => {
        setParsedUser(parse(user));
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return (
    <Stack.Navigator lazy>
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PasswordRecovery"
        component={PasswordRecoveryPage}
        options={{ title: "Recuperação de senha" }}
      />
      <Stack.Screen
        name="Menu"
        component={Menu}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Homepage"
        component={BedStatusPage}
        options={{
          title: "Leitos",
          headerRight: () => parsedUser && <UserChip parsedUser={parsedUser} />,
        }}
      />
      <Stack.Screen name="Setores" component={SectorListPage} />
      <Stack.Screen
        name="Perfil"
        component={ProfilePage}
        getId={({ params }) => params.id}
      />
      <Stack.Screen
        name="Leito"
        component={BedPage}
        getId={({ params }) => params.id}
        options={{
          headerRight: () => parsedUser && <UserChip parsedUser={parsedUser} />,
        }}
      />
      <Stack.Screen
        name="Lista"
        component={BedListPage}
        getId={({ params }) => params.id}
        options={{
          headerRight: () => parsedUser && <UserChip parsedUser={parsedUser} />,
        }}
      />
      <Stack.Screen name="Pesquisa" component={SearchPage} />
    </Stack.Navigator>
  );
}
