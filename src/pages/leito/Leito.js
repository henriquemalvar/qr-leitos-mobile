import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { parse } from "flatted";
import styles from "../leito/style";
import BedsService from "../../shared/services/BedsServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { _getOptions, translateStatus } from "../../shared/util/translationUtils";
import showMessage from "../../shared/util/messageUtils";
import SelectDropdown from "react-native-select-dropdown";
import { Switch } from "react-native-paper";
import { convertTimestamp } from "../../shared/util/dateUtils";

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
  disableSelect,
  setSelectedOption,
}) => {
  const data = useMemo(
    () => options.map((option) => option?.label || ""),
    [options]
  );

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
      {options.length > 0 && (
        <SelectDropdown
          disabled={disableSelect}
          data={data}
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
  return (
    <View style={styles.containerDesc}>
      <View style={{ paddingBottom: 10 }}>
        <Text style={styles.detailsFont}>Ultima Modificação </Text>
        <Text style={styles.detailsEnd}>
          {convertTimestamp(bed.updated_at)}
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

const SaveButton = ({ bed, selectedOption, disableSave, updateLeito }) => {
  const onPress = useCallback(() => {
    if (bed.status === selectedOption || !selectedOption) return;
    updateLeito();
  }, [bed.status, selectedOption, updateLeito]);

  return (
    <TouchableOpacity
      style={styles.buttonLabel}
      onPress={onPress}
      disabled={disableSave}
    >
      <View>
        <Text style={styles.buttonText}>Salvar</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function Leito({ route, navigation }) {
  const { leito, scanned } = route.params;
  const bed = parse(leito);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [user, setUser] = useState(null);
  const [userConfig, setUserConfig] = useState(null);
  const [disableSave, setDisableSave] = useState(true);
  const [disableSelect, setDisableSelect] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [canToggle, setCanToggle] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [_user, _userConfig] = await Promise.all([
        AsyncStorage.getItem("user").then((user) => parse(user)),
        AsyncStorage.getItem("userConfig").then((userConfig) =>
          parse(userConfig)
        ),
        
      ]);

      setUser(_user);
      setUserConfig(_userConfig);
      const _options = _getOptions(_userConfig.permission, bed.status);
      setOptions(generateOptionsLabelValue(_options));
      setDisableSelect(false);
      setDisableSave(false);
    };
    fetchData();
  }, []);

  const generateOptionsLabelValue = (options) => {
    console.log("generateOptionsLabelValue", options);
    return options.map((option) => {
      console.log("option", option.from)
      return {
        label: translateStatus(option.to || ""),
        value: option.to || "",
      };
    });
  };

  const updateLeito = useCallback(() => {
    changeStatus(selectedOption)
      .then(() => {
        navigation.navigate("Menu", bed.id);
      })
      .catch((error) => {
        console.error("Erro ao atualizar leito", error.message);
        showMessage("error", "Erro ao atualizar leito", error.message);
      });
  }, [bed.id, changeStatus, navigation, selectedOption]);

  const changeStatus = async (status) => {
    try {
      const old_status = bed.status;
      await BedsService.update(bed.id, status);
      const log = {
        bed_id: bed.id,
        old_status: old_status,
        status: status,
        created_at: new Date(),
        userName: userConfig.name,
        userUid: user.uid,
        userEmail: user.email,
      };
      await BedsService.createLog(log);
    } catch (error) {
      console.error("Error occurred while updating bed status:", error);
      throw error;
    }
  };

  const memoizedOptions = useMemo(
    () => generateOptionsLabelValue(options),
    [generateOptionsLabelValue, options]
  );

  const handleMaintenanceChange = () => {
    setIsMaintenance(!isMaintenance);
  };

  const handleBlockedChange = () => {
    setIsBlocked(!isBlocked);
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
        options={memoizedOptions}
        selectedOption={selectedOption}
        currentStatus={bed.status}
        disableSelect={disableSelect}
        setSelectedOption={setSelectedOption}
      />
      <SaveButton
        bed={bed}
        selectedOption={selectedOption}
        disableSave={disableSave}
        updateLeito={updateLeito}
      />
    </View>
  );
}
