import * as React from 'react';
import { NavigationContainer } from "@react-navigation/native"
import { Component } from 'react';
import { createStackNavigator } from "@react-navigation/stack"
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Login from "./src/pages/login/Login"
import Homepage from './src/pages/home/Homepage';
import Menu from './src/components/Menu';
import Perfil from './src/pages/perfil/Perfil';
import Leito from './src/pages/leito/Leito';
import Lista from './src/pages/home/filtros/Lista';

const Stack = createStackNavigator();

function StackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
      <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
      <Stack.Screen name="Homepage" component={Homepage} />
      <Stack.Screen name="Perfil" component={Perfil} getId={({ params }) => params.id} />
      <Stack.Screen name="Leito" component={Leito} getId={({ params }) => params.id} />
      <Stack.Screen name="Lista" component={Lista} getId={({ params }) => params.id} />
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
      </SafeAreaProvider>
    );
  }
};

