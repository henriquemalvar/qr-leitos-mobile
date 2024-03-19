import Menu from "@components/Menu";
import UserChip from "@components/UserChip";
import Bed from "@pages/bed/Bed";
import BedStatusPage from "@pages/home/BedStatusPage";
import BedListPage from "@pages/home/components/BedListPage";
// import BedListPage from "@pages/bedList/BedListPage";
import Login from "@pages/login/Login";
import PasswordRecovery from "@pages/passwordRecovery/PasswordRecovery";
import ProfilePage from "@pages/profile/ProfilePage";
import SearchPage from "@pages/search/SearchPage";
import SectorListPage from "@pages/sectors/SectorListPage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import { parse } from "flatted";
import * as React from "react";

const Stack = createStackNavigator();

export default function StackRoutes() {
  const [parsedUser, setParsedUser] = React.useState(null);

  React.useEffect(() => {
    AsyncStorage.getItem("userConfig")
      .then((user) => {
        setParsedUser(parse(user));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Stack.Navigator lazy>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PasswordRecovery"
        component={PasswordRecovery}
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
          headerRight: () =>
            parsedUser && (
              <UserChip parsedUser={parsedUser} onPress={() => { }} />
            ),
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
        component={Bed}
        getId={({ params }) => params.id}
      />
      <Stack.Screen
        name="Lista"
        component={BedListPage}
        getId={({ params }) => params.id}
      />
      <Stack.Screen name="Pesquisa" component={SearchPage} />
    </Stack.Navigator>
  );
}
