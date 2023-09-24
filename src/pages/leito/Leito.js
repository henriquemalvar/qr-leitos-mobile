import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { parse } from "flatted";
import moment from "moment";
import styles from "../leito/style";
import BedsService from "../../shared/services/BedsServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { statusToLabel, permissions } from "../../shared/util/constants";
import { checkConnection } from "../../shared/services/OfflineService";
import Toast from "react-native-toast-message";

const convertTimestamp = (timestamp) => {
  return moment
    .unix(timestamp.seconds)
    .millisecond(timestamp.nanoseconds / 1000000)
    .format("DD/MM/YYYY HH:mm:ss");
};

const translateStatus = (status) => {
  return statusToLabel[status] || status;
};

export default function Leito({ route, navigation }) {
  const { leito } = route.params;
  const bed = parse(leito);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [user, setUser] = useState(null);
  const [userConfig, setUserConfig] = useState(null);
  const [disableSave, setDisableSave] = useState(true);
  const [disableSelect, setDisableSelect] = useState(true);
  const [connection, setConnection] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [_user, _userConfig, _userOptions] = await Promise.all([
        AsyncStorage.getItem("user").then((user) => parse(user)),
        AsyncStorage.getItem("userConfig").then((userConfig) =>
          parse(userConfig)
        ),
        AsyncStorage.getItem("options").then(
          (userOptions) => parse(userOptions) || []
        ),
      ]);

      setUser(_user);
      setUserConfig(_userConfig);
      const _options = _userConfig.permission === "admin" ? _userOptions : _userOptions.filter((option) => option.from === bed.status);
      setOptions(generateOptionsLabelValue(_options));
      setDisableSelect(false);
      setDisableSave(false);
    };
  }, []);

  const generateOptionsLabelValue = (options) => {
    return options.map((option) => {
      return {
        label: translateStatus(option.to || ""),
        value: option.to || "",
      };
    });
  };

  const updateLeito = () => {
    changeStatus(selectedOption)
      .then(() => {
        navigation.navigate("Menu", bed.id);
      })
      .catch((error) => {
        console.error("Erro ao atualizar leito", error.message);
      });
  };

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
      // throw new Error("Failed to update bed status");
    }
  };

  return (
    <View style={styles.containerStatus}>
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

      <View style={styles.containerDesc}>
        <View style={{ paddingBottom: 10 }}>
          <Text style={styles.detailsFont}>Ultima Modificação </Text>
          <Text style={styles.detailsEnd}>
            {convertTimestamp(bed.updated_at)}
          </Text>
        </View>
      </View>

      <View
        style={styles.containerDropdown}
      >
        <View style={styles.containerDesc}>
          <Text style={styles.detailsFont}>Estado do Leito </Text>
        </View>
        {options.length > 0 && (
          <SelectDropdown
            disabled={disableSelect}
            data={options.map((option) => option?.label || "")}
            onSelect={(selectedItem, index) => {
              setSelectedOption(options[index]?.value || "");
              if (!selectedOption) setDisableSave(true);
              else setDisableSave(false);
            }}
            defaultButtonText={
              translateStatus(bed.status) || "Selecione uma opção"
            }
            rowTextForSelection={(item, index) => {
              return item;
            }}
            style={styles.dropdown}
            buttonStyle={styles.dropdownButton}
            dropdownStyle={styles.dropdownDropdown}
          ></SelectDropdown>
        )}
      </View>

      <TouchableOpacity
        style={styles.buttonLabel}
        onPress={() => {
          if (bed.status === selectedOption || !selectedOption) return;
          updateLeito();
        }}
      >
        <View>
          <Text style={styles.buttonText}>Salvar</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
