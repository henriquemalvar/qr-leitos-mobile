import AsyncStorage from "@react-native-async-storage/async-storage";
import showMessage from "@utils/messageUtils";
import { createContext, useContext, useEffect } from "react";
import { Linking } from "react-native";

export const UpdateContext = createContext();

export const useUpdate = () => useContext(UpdateContext);

export const UpdateProvider = ({ children }) => {
  const fetchUpdateLink = async () => {
    const response = await fetch(
      "https://qr-leitos.vercel.app/api/app/check-update"
    );
    const data = await response.json();
    return data.link;
  };

  const handleNewUpdateLink = async (link) => {
    const storedUpdateLink = await AsyncStorage.getItem("updateLink");
    if (link && link !== storedUpdateLink) {
      await AsyncStorage.setItem("updateLink", link);

      showMessage(
        "info",
        "Atualizações",
        "Há uma atualização disponível. Abrindo link..."
      );
      Linking.openURL(link);
    } else {
      showMessage(
        "info",
        "Atualizações",
        "Você já está na versão mais recente."
      );
    }
  };

  const handleError = (error) => {
    const message =
      error.message === "Network request failed"
        ? "Não foi possível verificar as atualizações porque você está offline. Por favor, verifique sua conexão com a internet e tente novamente."
        : "Não conseguimos verificar se há atualizações disponíveis no momento. Por favor, tente novamente mais tarde.";

    showMessage(
      "error",
      error.message === "Network request failed"
        ? "Erro de Conexão"
        : "Ops, algo deu errado",
      message
    );
  };

  const fetchUpdates = async () => {
    try {
      const link = await fetchUpdateLink();
      await handleNewUpdateLink(link);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  return (
    <UpdateContext.Provider
      value={{
        fetchUpdates,
        fetchUpdateLink,
        handleNewUpdateLink,
        handleError,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
};
