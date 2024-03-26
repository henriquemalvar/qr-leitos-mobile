import AsyncStorage from "@react-native-async-storage/async-storage";
import BedsService from "@services/BedsServices";
import LogService from "@services/LogService";
import globalStyles from "@styles/globalStyles";
import showMessage from "@utils/messageUtils";
import { _getOptions } from "@utils/translationUtils";
import { parse, stringify } from "flatted";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { FAB, useTheme } from "react-native-paper";
import { useNetInfoStatus } from "shared/contexts/NetInfoProvider";
import BedDetails from "./components/BedDetails";
import BedStatusMenu from "./components/BedStatusMenu";
import { SettingsCard } from "./components/SettingsCard";

export default function BedPage({ route, navigation }) {
  const { leitoId, leito, scanned = false } = route.params;
  const bed = parse(leito);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [user, setUser] = useState(null);
  const [userConfig, setUserConfig] = useState(null);
  const [isMaintenance, setIsMaintenance] = useState(!!bed.isMaintenance);
  const [isBlocked, setIsBlocked] = useState(!!bed.isBlocked);

  const [canToggle, setCanToggle] = useState(false);
  const [lastLog, setLastLog] = useState(null);
  const netInfo = useNetInfoStatus();

  const { colors } = useTheme();

  const fetchLastLog = async () => {
    try {
      if (bed.lastLogId) {
        const log = await LogService.getLogById(bed.lastLogId);
        setLastLog(log);
      }
    } catch (error) {
      console.error("Error fetching last log:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [_user, _userConfig] = await Promise.all([
          AsyncStorage.getItem("user").then((user) => parse(user)),
          AsyncStorage.getItem("userConfig").then((userConfig) => {
            setUserConfig(parse(userConfig));
            return parse(userConfig);
          }),
        ]);
        setUser(_user);

        const _options = _getOptions(_userConfig.permission, bed.status);
        setOptions(_options);
        if (
          _userConfig?.permission === "admin" ||
          _userConfig?.permission === "enfermeira"
        ) {
          setCanToggle(true);
        }

        if (leitoId && !bed && netInfo.isConnected) {
          const bedData = await BedsService.getById(leitoId);
          setLeito(bedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        showMessage({
          type: "error",
          text1: "Erro ao buscar dados",
          text2: error.message,
        });
      }
    };
    fetchData();
    fetchLastLog();
  }, []);

  const updateLeito = useCallback(() => {
    if (
      (isMaintenance || isBlocked) &&
      (!userConfig ||
        (userConfig.permission !== "admin" &&
          userConfig.permission !== "enfermeira"))
    ) {
      let status = isMaintenance ? "manutenção" : "bloqueado";
      showMessage({
        type: "error",
        text1: "Permissão negada",
        text2: `Este leito está em ${status}. Somente alguém da enfermagem ou um administrador pode alterar o status dele.`,
      });

      return;
    }

    changeStatus(selectedOption)
      .then(() => {
        navigation.navigate("Menu", bed.id);
      })
      .catch((error) => {
        console.error("Erro ao atualizar leito", error.message);
        showMessage({
          type: "error",
          text1: "Erro ao atualizar leito",
          text2: error.message,
        });
      });
  }, [
    bed.id,
    changeStatus,
    isBlocked,
    isMaintenance,
    navigation,
    selectedOption,
    userConfig,
  ]);

  const changeStatus = async (status) => {
    try {
      if (
        (isMaintenance !== bed.isMaintenance || isBlocked !== bed.isBlocked) &&
        !status
      ) {
        status = bed.status;
      }

      if (netInfo.isConnected) {
        const newBed = {
          ...bed,
          status: status,
          isMaintenance,
          isBlocked,
          updated_at: new Date(),
        };

        const log = {
          bed_id: bed.id,
          after: newBed,
          before: bed,
          created_at: new Date(),
          userName: userConfig.name,
          userUid: user.uid,
          userEmail: user.email,
          userPermission: userConfig.permission,
          bed_type: bed.type,
        };

        const createdLog = await LogService.createLog(log);

        newBed.lastLogId = createdLog.id;

        await BedsService.updateBed(newBed);
        showMessage({
          type: "success",
          text1: "Leito atualizado com sucesso",
        });
      } else if (!netInfo.isConnected) {
        const changes = {
          status,
          isMaintenance,
          isBlocked,
          updated_at: new Date(),
        };
        await savePendingChanges(changes);
        showMessage({
          type: "success",
          text1: "Mudanças salvas localmente",
          text2:
            "As mudanças serão enviadas quando a conexão for restabelecida.",
        });
      }
    } catch (error) {
      console.error("Error occurred while updating bed status:", error);
      throw error;
    }
  };

  const savePendingChanges = async (changes) => {
    try {
      const pendingChanges = await AsyncStorage.getItem("pendingChanges");
      const parsedPendingChanges = parse(pendingChanges);
      const newPendingChanges = {
        ...parsedPendingChanges,
        [bed.id]: changes,
      };
      await AsyncStorage.setItem(
        "pendingChanges",
        stringify(newPendingChanges)
      );
    } catch (error) {
      console.error("Error saving pending changes:", error);
    }
  };

  const handleMaintenanceChange = () => {
    setIsMaintenance(!isMaintenance);
  };

  const handleBlockedChange = () => {
    setIsBlocked(!isBlocked);
  };

  const canSave = () => {
    const hasStatusChanged =
      selectedOption !== null && selectedOption !== bed.status;
    const hasMaintenanceChanged =
      (isMaintenance ?? false) !== (bed.isMaintenance ?? false);
    const hasBlockedChanged = (isBlocked ?? false) !== (bed.isBlocked ?? false);
    const canToggleMaintenanceOrBlocked =
      canToggle && (hasMaintenanceChanged || hasBlockedChanged);
    const userIsEnfermeiraOrAdmin =
      userConfig?.permission === "admin" ||
      userConfig?.permission === "enfermeira";
    const userIsLimpezaOrCamareira =
      userConfig?.permission === "limpeza" ||
      userConfig?.permission === "camareira";

    if (
      userIsEnfermeiraOrAdmin &&
      (hasStatusChanged || canToggleMaintenanceOrBlocked)
    ) {
      return true;
    } else if (
      userIsLimpezaOrCamareira &&
      scanned &&
      (hasStatusChanged || canToggleMaintenanceOrBlocked)
    ) {
      return true;
    } else if (
      hasStatusChanged &&
      !userIsEnfermeiraOrAdmin &&
      !userIsLimpezaOrCamareira
    ) {
      return true;
    }
    return false;
  };
  return (
    <View style={globalStyles.page}>
      <ScrollView showsVerticalScrollIndicator={true}>
        {netInfo.isConnected && <BedDetails bed={bed} lastLog={lastLog} />}
        <View style={globalStyles.centeredContainer}>
          {canToggle && (
            <SettingsCard
              toggles={[
                {
                  label: "Manutenção",
                  value: isMaintenance,
                  onValueChange: handleMaintenanceChange,
                },
                {
                  label: "Bloqueado",
                  value: isBlocked,
                  onValueChange: handleBlockedChange,
                },
              ]}
            />
          )}
          <BedStatusMenu
            menuOptions={options}
            selectedMenuOption={selectedOption}
            currentBedStatus={bed.status}
            setSelectedMenuOption={setSelectedOption}
          />
        </View>
        <FAB
          style={{
            margin: 16,
            backgroundColor: canSave() ? colors.confirm : colors.disabled,
          }}
          size="medium"
          label="Salvar"
          color="#ffffff"
          onPress={updateLeito}
        />
      </ScrollView>
    </View>
  );
}
