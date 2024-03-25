import { NavigationContainer } from "@react-navigation/native";
import { theme } from "@styles/theme";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import StackRoutes from "./StackRoutes";
import { UpdateProvider } from "@contexts/UpdateProvider";

export default function App() {
  SystemUI.setBackgroundColorAsync("#fff", true);

  return (
    <UpdateProvider>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar style="auto" />
          <NavigationContainer>
            <StackRoutes />
          </NavigationContainer>
          <Toast />
        </PaperProvider>
      </SafeAreaProvider>
    </UpdateProvider>
  );
}
