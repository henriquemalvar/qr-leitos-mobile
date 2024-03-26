import { useNetInfo } from "@react-native-community/netinfo";
import showMessage from "@utils/messageUtils";
import { createContext, useContext, useEffect, useState } from "react";

const NetInfoContext = createContext();

export const NetInfoProvider = ({ children }) => {
  const netInfo = useNetInfo();
  const [wasConnected, setWasConnected] = useState(netInfo.isConnected);

  useEffect(() => {
    if (netInfo.isConnected && !wasConnected) {
      showMessage({
        type: "success",
        text1: "Conectado à internet",
        position: "top",
        autoHide: true,
      });
    } else if (!netInfo.isConnected) {
      showMessage({
        type: "error",
        text1: "Sem conexão à internet",
        position: "top",
        autoHide: false,
      });
    }

    setWasConnected(netInfo.isConnected);
  }, [netInfo.isConnected, wasConnected]);

  return (
    <NetInfoContext.Provider value={netInfo}>
      {children}
    </NetInfoContext.Provider>
  );
};

export const useNetInfoStatus = () => useContext(NetInfoContext);
