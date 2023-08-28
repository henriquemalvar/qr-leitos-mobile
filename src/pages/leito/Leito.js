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

export default function Leito({ route, navigation }) {
  const { leito: bed } = route.params;
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [user, setUser] = useState(null);
  const [userConfig, setUserConfig] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await AsyncStorage.getItem("user").then((user) => {
        setUser(parse(user));
      });

      await AsyncStorage.getItem("userConfig").then((userConfig) => {
        setUserConfig(parse(userConfig));
      });

      await AsyncStorage.getItem("options").then((userOptions) => {
        setOptions(parse(userOptions).value);
      });
    };

    fetchData();
  }, []);

  const updateLeito = () => {
    changeStatus(selectedOption)
      .then(() => {
        navigation.navigate("Menu", parse(bed).id);
      })
      .catch((error) => {
        // console.log(error);
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
            data={options.map((option) => option?.label || "")}
            onSelect={(selectedItem, index) => {
              setSelectedOption(options[index]?.value || "");
            }}
            defaultButtonText={
              options.find((option) => parse(bed).status === option.value)
                ?.label
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
