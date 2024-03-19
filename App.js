import { NavigationContainer } from "@react-navigation/native";
import { theme } from "@styles/theme";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import StackRoutes from "./StackRoutes";

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <StackRoutes />
        </NavigationContainer>
        <Toast />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
