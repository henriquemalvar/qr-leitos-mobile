import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { ModalPicker } from "../../components/ModalPicker";
import SelectDropdown from "react-native-select-dropdown";
import { stringify, parse } from "flatted";
import moment from "moment";
import db from "../../database/database";
import styles from "../leito/style";
import BedsService from "../../shared/services/BedsServices";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const convertTimestamp = (timestamp) => {
  return moment
    .unix(timestamp.seconds)
    .millisecond(timestamp.nanoseconds / 1000000)
    .format("DD/MM/YYYY HH:mm:ss");
};

const translateStatus = (status) => {
  switch (status) {
    case "available":
      return "Livre";
    case "occupied":
      return "Em alta";
    case "discharge":
      return "Alta";
    case "awaiting_for_cleaning":
      return "Aguardando higienização";
    case "cleaning_in_progress":
      return "Em higienização";
    case "awaiting_for_bedding":
      return "Aguardando forragem";
    case "bedding_in_progress":
      return "Em forragem";
    default:
      return status;
  }
};

export default function Leito({ route, navigation }) {
  const { leito: bed } = route.params;
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [user, setUser] = useState(null);
  const [userConfig, setUserConfig] = useState(null);
  const [disableSave, setDisableSave] = useState(true);
  const [disableSelect, setDisableSelect] = useState(true);

  const allStatus = [
    "available",
    "occupied",
    "discharge",
    "awaiting_for_cleaning",
    "cleaning_in_progress",
    "awaiting_for_bedding",
    "bedding_in_progress",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const [user, userConfig, userOptions] = await Promise.all([
        AsyncStorage.getItem("user").then((user) => parse(user)),
        AsyncStorage.getItem("userConfig").then((userConfig) =>
          parse(userConfig)
        ),
        AsyncStorage.getItem("options").then(
          (userOptions) => parse(userOptions).value
        ),
      ]);

      setUser(user);
      setUserConfig(userConfig);
      setOptions(userOptions);

      const parsedBed = parse(bed);
      if (["medico", "enfermeira"].includes(userConfig.permission)) {
        // available -> occupied
        if (parsedBed.status === "available") {
          setOptions(
            userOptions.filter((option) => option.value === "occupied")
          );
          setDisableSelect(false);
          setDisableSave(false);
        }
        // occupied -> discharge
        if (parsedBed.status === "occupied") {
          setOptions(
            userOptions.filter((option) => option.value === "discharge")
          );
          setDisableSelect(false);
          setDisableSave(false);
        }

        // discharge -> awaiting_for_cleaning
        if (parsedBed.status === "discharge") {
          setOptions(
            userOptions.filter(
              (option) => option.value === "awaiting_for_cleaning"
            )
          );
          setDisableSelect(false);
          setDisableSave(false);
        }
      } else if (["limpeza"].includes(userConfig.permission)) {
        // awaiting_for_cleaning -> cleaning_in_progress
        if (parsedBed.status === "awaiting_for_cleaning") {
          setOptions(
            userOptions.filter(
              (option) => option.value === "cleaning_in_progress"
            )
          );
          setDisableSelect(false);
          setDisableSave(false);
        }
        // cleaning_in_progress -> awaiting_for_bedding
        if (parsedBed.status === "cleaning_in_progress") {
          setOptions(
            userOptions.filter(
              (option) => option.value === "awaiting_for_bedding"
            )
          );
          setDisableSelect(false);
          setDisableSave(false);
        }
      } else if (["camareira"].includes(userConfig.permission)) {
        // awaiting_for_bedding -> bedding_in_progress
        if (parsedBed.status === "awaiting_for_bedding") {
          setOptions(
            userOptions.filter(
              (option) => option.value === "bedding_in_progress"
            )
          );
          setDisableSelect(false);
          setDisableSave(false);
        }

        // bedding_in_progress -> available
        if (parsedBed.status === "bedding_in_progress") {
          setOptions(
            userOptions.filter((option) => option.value === "available")
          );
          setDisableSelect(false);
          setDisableSave(false);
        }
      }
    };
    fetchData();
  }, []);

  const updateLeito = () => {
    changeStatus(selectedOption)
      .then(() => {
        navigation.navigate("Menu", parse(bed).id);
      })
      .catch((error) => {
        console.error("Erro ao atualizar leito", error.message);
      });
  };

  const changeStatus = async (status) => {
    try {
      const old_status = parse(bed).status;
      await BedsService.updateStatus(parse(bed).id, status);
      const log = {
        bed_id: parse(bed).id,
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
        <Text style={styles.titleFont}>{parse(bed).name}</Text>
      </View>

      <View style={styles.containerDesc}>
        <View style={{ paddingBottom: 10 }}>
          <Text style={styles.detailsFont}>Endereço </Text>
          <Text style={styles.detailsEnd}>
            {parse(bed).location.map((field) => {
              return <Text key={field}>{field} </Text>;
            })}
          </Text>
        </View>
      </View>

      <View style={styles.containerDesc}>
        <View style={{ paddingBottom: 10 }}>
          <Text style={styles.detailsFont}>Ultima Modificação </Text>
          <Text style={styles.detailsEnd}>
            {convertTimestamp(parse(bed).updated_at)}
          </Text>
        </View>
      </View>

      <View
        style={[
          {
            backgroundColor: "#E7E6E1",
            width: "97%",
            borderRadius: 15,
            paddingBottom: 15,
          },
        ]}
      >
        <View style={styles.containerDesc}>
          <Text style={styles.detailsFont}>Estado do Leito </Text>
        </View>
        {options && (
          <SelectDropdown
            disabled={disableSelect}
            data={options.map((option) => option?.label || "")}
            onSelect={(selectedItem, index) => {
              setSelectedOption(options[index]?.value || "");
              if (!selectedOption) setDisableSave(true);
              else setDisableSave(false);
            }}
            defaultButtonText={
              translateStatus(parse(bed).status) || "Selecione uma opção"
            }
            rowTextForSelection={(item, index) => {
              return item;
            }}
            style={{
              backgroundColor: "#E7E6E1",
              width: "97%",
              borderRadius: 15,
            }}
            buttonStyle={{
              backgroundColor: "#fff",
              width: "97%",
              borderRadius: 15,
              alignSelf: "center",
            }}
            dropdownStyle={{
              backgroundColor: "#fff",
              width: "94%",
              borderRadius: 15,
            }}
          ></SelectDropdown>
        )}
      </View>

      <TouchableOpacity
        hidden={disableSave}
        style={styles.buttonLabel}
        onPress={() => {
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
