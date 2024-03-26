import { useNetInfo } from "@react-native-community/netinfo";
import showMessage from "@utils/messageUtils";
import { createContext, useContext, useEffect } from "react";

const NetInfoContext = createContext();

export const NetInfoProvider = ({ children }) => {
  const netInfo = useNetInfo();

  useEffect(() => {
    if (netInfo.isConnected) {
      showMessage({
        type: "success",
        text1: "Conectado à internet",
        position: "top",
        autoHide: true,
      });
    } else {
      showMessage({
        type: "error",
        text1: "Sem conexão à internet",
        position: "top",
        autoHide: false,
      });
    }
  }, [netInfo.isConnected]);

  return (
    <NetInfoContext.Provider value={netInfo}>
      {children}
    </NetInfoContext.Provider>
  );
};

export const useNetInfoStatus = () => useContext(NetInfoContext);
