import AsyncStorage from "@react-native-async-storage/async-storage";
import BedsService from "@services/BedsServices";
import LogService from "@services/LogService";
import showMessage from "@utils/messageUtils";
import { parse, stringify } from "flatted";
import { createContext, useContext, useEffect } from "react";
import { useNetInfoStatus } from "./NetInfoProvider";

const PendingChangesSyncContext = createContext();

export const PendingChangesSyncProvider = ({ children }) => {
  const netInfo = useNetInfoStatus();

  useEffect(() => {
    const syncPendingChanges = async () => {
      try {
        const pendingChanges = await AsyncStorage.getItem(
          "pendingChanges"
        ).then((pendingChanges) => parse(pendingChanges));

        const userConfig = await AsyncStorage.getItem("userConfig").then(
          (userConfig) => parse(userConfig)
        );
        const user = await AsyncStorage.getItem("user").then((user) =>
          parse(user)
        );

        for (const bedId in pendingChanges) {
          if (!netInfo.isConnected) {
            await AsyncStorage.setItem(
              "pendingChanges",
              stringify(pendingChanges)
            );
            showMessage({
              type: "warning",
              text1: "Conexão perdida",
              text2:
                "As alterações pendentes serão sincronizadas quando a conexão for restabelecida.",
            });
            break;
          }

          const changes = pendingChanges[bedId];
          const bed = await BedsService.getById(bedId);

          // Check if the user has permission to make the changes
          const userPermissions = permissions[userConfig.permission];
          const isAllowed = userPermissions.some(
            (permission) =>
              permission.from === bed.status && permission.to === changes.status
          );

          if (!isAllowed) {
            console.error(
              `User ${userConfig.name} does not have permission to change status from ${bed.status} to ${changes.status}`
            );
            showMessage({
              type: "error",
              text1: "Erro ao sincronizar mudanças",
              text2: "Você não tem permissão para fazer essa alteração.",
            });

            delete pendingChanges[bedId];
            continue;
          }

          // Check if the maintenance, block or status fields were changed
          if (
            bed.maintenance === changes.maintenance &&
            bed.block === changes.block &&
            bed.status === changes.status
          ) {
            // No changes, remove this bed from pending changes and skip
            delete pendingChanges[bedId];
            continue;
          }

          const updatedBed = { ...bed, ...changes };

          // Create a new log
          const log = {
            bed_id: bed.id,
            after: updatedBed,
            before: bed,
            created_at: new Date(),
            userName: userConfig.name,
            userUid: user.uid,
            userEmail: user.email,
            userPermission: userConfig.permission,
            bed_type: bed.type,
          };
          const createdLog = await LogService.createLog(log);
          updatedBed.lastLogId = createdLog.id;

          await BedsService.updateBed(updatedBed);

          showMessage({
            type: "success",
            text1: "Mudanças sincronizadas",
            text2: `O status do leito ${bed.id} foi atualizado com sucesso.`,
          });

          delete pendingChanges[bedId];
        }

        await AsyncStorage.setItem("pendingChanges", stringify(pendingChanges));
      } catch (error) {
        console.error("Error syncing pending changes:", error);
        showMessage({
          type: "error",
          text1: "Erro ao sincronizar mudanças",
          text2:
            "Ocorreu um erro ao tentar sincronizar as alterações pendentes.",
        });
      }
    };

    if (netInfo.isConnected) {
      syncPendingChanges();
    }
  }, [netInfo.isConnected]);

  return (
    <PendingChangesSyncContext.Provider value={null}>
      {children}
    </PendingChangesSyncContext.Provider>
  );
};

export const usePendingChangesSync = () =>
  useContext(PendingChangesSyncContext);
