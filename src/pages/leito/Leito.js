import AsyncStorage from "@react-native-async-storage/async-storage";
import { parse } from "flatted";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import BedsService from "../../shared/services/BedsServices";
import showMessage from "../../shared/util/messageUtils";
import { _getOptions } from "../../shared/util/translationUtils";
import { BedDetails } from "./components/BedDetails";
import { BedStatusDropdown } from "./components/BedStatusDropdown";
import { LastModification } from "./components/LastModification";
import { SaveButton } from "./components/SaveButton";
import { ToggleCard } from "./components/ToggleCard";
import styles from "./styles";

export default function Leito({ route, navigation }) {
  const { leito, scanned = false } = route.params;
  const bed = parse(leito);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [user, setUser] = useState(null);
  const [userConfig, setUserConfig] = useState(null);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [canToggle, setCanToggle] = useState(false);
  const [lastLog, setLastLog] = useState(null);

  const fetchLastLog = async () => {
    try {
      if (bed.lastLogId) {
        const log = await BedsService.getLastLog(bed.lastLogId);
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
        setIsBlocked(bed.isBlocked || false);
        setIsMaintenance(bed.isMaintenance || false);
        if (
          _userConfig?.permission === "admin" ||
          _userConfig?.permission === "enfermeira"
        ) {
          setCanToggle(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        showMessage("error", "Error fetching data", error.message);
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

      showMessage(
        "error",
        `Este leito está em ${status}. Somente alguém da enfermagem ou um administrador pode alterar o status dele.`
      );
      return;
    }

    changeStatus(selectedOption)
      .then(() => {
        navigation.navigate("Menu", bed.id);
      })
      .catch((error) => {
        console.error("Erro ao atualizar leito", error.message);
        showMessage("error", "Erro ao atualizar leito", error.message);
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

      const createdLog = await BedsService.createLog(log);

      newBed.lastLogId = createdLog.id;

      await BedsService.updateBed(newBed);

      showMessage("success", "Leito atualizado com sucesso");
    } catch (error) {
      console.error("Error occurred while updating bed status:", error);
      throw error;
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
    const hasMaintenanceChanged = isMaintenance !== bed.isMaintenance;
    const hasBlockedChanged = isBlocked !== bed.isBlocked;
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
    <>
      <ScrollView>
        <View style={styles.containerStatus}>
          <BedDetails bed={bed} />
          <LastModification bed={bed} lastLog={lastLog} />
          {canToggle && (
            <ToggleCard
              label1="Manutenção"
              value1={isMaintenance}
              onValueChange1={handleMaintenanceChange}
              label2="Bloqueado"
              value2={isBlocked}
              onValueChange2={handleBlockedChange}
            />
          )}
          <BedStatusDropdown
            options={options}
            selectedOption={selectedOption}
            currentStatus={bed.status}
            disabled={options.length === 0}
            setSelectedOption={setSelectedOption}
          />
        </View>
      </ScrollView>
      <SaveButton
        bed={bed}
        disabled={!canSave()}
        selectedOption={selectedOption}
        updateLeito={updateLeito}
      />
    </>
  );
}
