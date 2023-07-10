import * as React from 'react';
import { NavigationContainer } from "@react-navigation/native"
import { Component } from 'react';
import { createStackNavigator } from "@react-navigation/stack"
import { AsyncStorage } from 'react-native';
import { RNSScreen } from 'react-native-screens';

import Login from "./src/pages/login/Login"
import Homepage from './src/pages/home/Homepage';
import Menu from './src/components/Menu';
import Leito from './src/pages/leito/Leito';
import Lista from './src/pages/home/filtros/Lista';

const Stack = createStackNavigator();

function StackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
      <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
      <Stack.Screen name="Homepage" component={Homepage} />
      <Stack.Screen name="Leito" component={Leito} getId={({ params }) => params.id} />
      <Stack.Screen name="Lista" component={Lista} getId={({ params }) => params.id} />
    </Stack.Navigator>
  );
}

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <StackRoutes />
      </NavigationContainer>
    );
  }
};

