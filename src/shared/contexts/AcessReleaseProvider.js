import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { createContext, useContext, useEffect, useState } from "react";

const AccessReleaseContext = createContext();

export const AccessReleaseProvider = ({ children }) => {
  const [access, setAccess] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAccess = async () => {
      const lastScan = await AsyncStorage.getItem("lastScan");
      const qrValue = await AsyncStorage.getItem("qrValue");
      const now = Date.now();

      if (lastScan && qrValue && now - lastScan >= 12 * 60 * 60 * 1000) {
        await AsyncStorage.removeItem("lastScan");
        await AsyncStorage.removeItem("qrValue");
        navigation.navigate("Login");
      } else {
        setAccess(true);
      }
    };

    checkAccess();
  }, []);

  return (
    <AccessReleaseContext.Provider value={{ access }}>
      {children}
    </AccessReleaseContext.Provider>
  );
};

export const useAccessRelease = () => {
  const context = useContext(AccessReleaseContext);
  if (!context) {
    throw new Error(
      "useAccessRelease must be used within an AccessReleaseProvider"
    );
  }
  return context;
};