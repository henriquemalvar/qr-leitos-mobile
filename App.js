import { UpdateProvider } from "@contexts/UpdateProvider";
import { NavigationContainer } from "@react-navigation/native";
import { theme } from "@styles/theme";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import StackRoutes from "./StackRoutes";

export default function App() {
  SystemUI.setBackgroundColorAsync("#fff", true);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <UpdateProvider>
          <StatusBar style="auto" />
          <NavigationContainer>
            <StackRoutes />
          </NavigationContainer>
          <Toast />
        </UpdateProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
