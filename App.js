import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Login from "./src/pages/login/Login";
import Homepage from "./src/pages/home/Homepage";
import Menu from "./src/components/Menu";
import Perfil from "./src/pages/perfil/Perfil";
import Leito from "./src/pages/leito/Leito";
import Lista from "./src/pages/home/filtros/Lista";
import Toast from "react-native-toast-message";
import SearchScreen from "./src/pages/search/SearchScreen";
import Sectors from "./src/pages/sectors/Sectors";
import UserChip from "./src/components/UserChip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { parse } from "flatted";
import PasswordRecovery from "./src/pages/passwordRecovery/PasswordRecovery";

const Stack = createStackNavigator();

function StackRoutes() {
  const [parsedUser, setParsedUser] = React.useState(null);

  React.useEffect(() => {
    AsyncStorage.getItem("userConfig").then((user) => {
      setParsedUser(parse(user));
    });
  }, []);

  return (
    <Stack.Navigator>
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
        component={Homepage}
        options={{
          title: "Leitos",
          headerRight: () => (
            <UserChip parsedUser={parsedUser} onPress={() => {}} />
          ),
        }}
      />
      <Stack.Screen name="Setores" component={Sectors} />
      <Stack.Screen
        name="Perfil"
        component={Perfil}
        getId={({ params }) => params.id}
      />
      <Stack.Screen
        name="Leito"
        component={Leito}
        getId={({ params }) => params.id}
      />
      <Stack.Screen
        name="Lista"
        component={Lista}
        getId={({ params }) => params.id}
      />
      <Stack.Screen name="Pesquisa" component={SearchScreen} />
    </Stack.Navigator>
  );
}

export default class App extends Component {
  render() {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <StackRoutes />
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    );
  }
}
