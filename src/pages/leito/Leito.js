import AsyncStorage from "@react-native-async-storage/async-storage";
import { parse } from "flatted";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Switch } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import BedsService from "../../shared/services/BedsServices";
import {
  convertTimestamp,
  convertTimestampToDate,
} from "../../shared/util/dateUtils";
import showMessage from "../../shared/util/messageUtils";
import {
  _getOptions,
  translateStatus,
} from "../../shared/util/translationUtils";
import styles from "../leito/style";
import moment from "moment";

const BedDetails = ({ bed }) => {
  return (
    <>
      <View style={styles.title}>
        <Text style={styles.titleFont}>{bed.name}</Text>
      </View>
      <View style={styles.containerDesc}>
        <View style={{ paddingBottom: 10 }}>
          <Text style={styles.detailsFont}>Endereço </Text>
          <Text style={styles.detailsEnd}>
            {bed.location.map((field) => {
              return <Text key={field}>{field} </Text>;
            })}
          </Text>
        </View>
      </View>
    </>
  );
};

const BedStatusDropdown = ({
  options,
  selectedOption,
  currentStatus,
  disabled,
  setSelectedOption,
}) => {
  const onSelect = useCallback(
    (selectedItem, index) => {
      setSelectedOption(options[index]?.value || "");
    },
    [options, setSelectedOption]
  );

  const defaultButtonText = useMemo(() => {
    const translatedText =
      translateStatus(currentStatus) || "Selecione uma opção";
    return translatedText;
  }, [selectedOption]);

  return (
    <View style={styles.containerDropdown}>
      <View style={styles.containerDesc}>
        <Text style={styles.detailsFont}>Estado do Leito </Text>
      </View>
      {options.length >= 0 && (
        <SelectDropdown
          disabled={disabled}
          data={options.map((option) => option.label)}
          onSelect={onSelect}
          defaultButtonText={defaultButtonText}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          style={styles.dropdown}
          buttonStyle={styles.dropdownButton}
          dropdownStyle={styles.dropdownDropdown}
        ></SelectDropdown>
      )}
    </View>
  );
};

const LastModification = ({ bed }) => {
  const updated_at = convertTimestamp(bed.updated_at);
  const duration = moment.duration(moment().diff(updated_at));
  const hoursAgo = duration.asHours();
  const daysAgo = duration.asDays();
  const timeAgo =
    hoursAgo < 24
      ? `${Math.floor(hoursAgo)} horas`
      : `${Math.floor(daysAgo)} dias`;
  return (
    <View style={styles.containerDesc}>
      <View style={{ paddingBottom: 10 }}>
        <Text style={styles.detailsFont}>Ultima Modificação </Text>
        <Text style={styles.detailsEnd}>
          {moment(updated_at).format("DD/MM/YYYY HH:mm")} - há {timeAgo}
        </Text>
      </View>
    </View>
  );
};

const ToggleContainer = ({ label, value, onValueChange }) => {
  return (
    <View style={styles.toggleContainer}>
      <Text style={styles.checkboxLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} color="blue" />
    </View>
  );
};

const ToggleCard = ({
  label1,
  value1,
  onValueChange1,
  label2,
  value2,
  onValueChange2,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Configurações</Text>
      </View>
      <View style={styles.cardContent}>
        <ToggleContainer
          label={label1}
          value={value1}
          onValueChange={onValueChange1}
        />
        <ToggleContainer
          label={label2}
          value={value2}
          onValueChange={onValueChange2}
        />
      </View>
    </View>
  );
};

const SaveButton = ({ bed, selectedOption, disabled, updateLeito }) => {
  const onPress = useCallback(() => {
    updateLeito();
  }, [bed.status, selectedOption, updateLeito]);

  return (
    <TouchableOpacity
      style={[
        styles.saveButton,
        disabled ? styles.disabledButtonLabel : styles.buttonLabel,
      ]}
      onPress={onPress}
      disabled={disabled || false}
    >
      <View>
        <Text style={styles.buttonText}>Salvar</Text>
      </View>
    </TouchableOpacity>
  );
};

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
      await BedsService.updateBed(newBed);
      const log = {
        bed_id: bed.id,
        after: newBed,
        before: bed,
        created_at: new Date(),
        userName: userConfig.name,
        userUid: user.uid,
        userEmail: user.email,
        userPermission: userConfig.permission,
      };
      await BedsService.createLog(log);
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
    <View style={styles.containerStatus}>
      <BedDetails bed={bed} />
      <LastModification bed={bed} />
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
      <SaveButton
        bed={bed}
        disabled={!canSave()}
        selectedOption={selectedOption}
        updateLeito={updateLeito}
      />
    </View>
  );
}
