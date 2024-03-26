import showMessage from "@utils/messageUtils";
import Constants from "expo-constants";
import { createContext, useContext, useEffect, useState } from "react";
import { Linking } from "react-native";
import { Button, Dialog, Paragraph } from "react-native-paper";

export const UpdateContext = createContext();

export const useUpdate = () => useContext(UpdateContext);

export const UpdateProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [updateLink, setUpdateLink] = useState(null);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const compareVersions = (v1, v2) => {
    const v1Parts = v1.split(".").map(Number);
    const v2Parts = v2.split(".").map(Number);

    for (let i = 0; i < v1Parts.length; i++) {
      if (v1Parts[i] > v2Parts[i]) {
        return 1;
      } else if (v1Parts[i] < v2Parts[i]) {
        return -1;
      }
    }

    return 0;
  };
  const fetchUpdateLink = async () => {
    const response = await fetch(
      "https://qr-leitos.vercel.app/api/app/check-update"
    );
    const data = await response.json();
    return { link: data.link, version: data.version };
  };

  const handleNewUpdateLink = async (link, version) => {
    const currentVersion = Constants.expoConfig.version;

    if (version && compareVersions(version, currentVersion) > 0) {
      setUpdateLink(link);
      showDialog();
    }
  };

  const handleUpdate = () => {
    hideDialog();
    Linking.openURL(updateLink);
  };

  const fetchUpdates = async () => {
    try {
      const { link, version } = await fetchUpdateLink();
      await handleNewUpdateLink(link, version);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    const message =
      error.message === "Network request failed"
        ? "Não foi possível verificar as atualizações porque você está offline. Por favor, verifique sua conexão com a internet e tente novamente."
        : "Não conseguimos verificar se há atualizações disponíveis no momento. Por favor, tente novamente mais tarde.";

    showMessage({
      type: "error",
      text1:
        error.message === "Network request failed"
          ? "Erro de Conexão"
          : "Ops, algo deu errado",
      text2: message,
    });
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
        compareVersions,
      }}
    >
      {children}
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Atualizações</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            Há uma atualização disponível. Deseja atualizar agora?
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Cancelar</Button>
          <Button onPress={handleUpdate}>Atualizar</Button>
        </Dialog.Actions>
      </Dialog>
    </UpdateContext.Provider>
  );
};
