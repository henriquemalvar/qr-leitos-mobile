import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { parse, stringify } from "flatted";
import { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BedsService from "../../shared/services/BedsServices";
import { status } from "../../shared/util/constantsUtils";
import { _getColor, _getPermissions } from "../../shared/util/translationUtils";
import { styles } from "./styles";

function OccupancyRate({ percentage }) {
  return (
    <View style={styles.container}>
      <View style={styles.occupation}>
        <Text style={styles.textOc}>
          Taxa de Ocupação: {percentage.toFixed(2)}%
        </Text>
      </View>
    </View>
  );
}

function BedList({ title, beds, color, navigation, disabled = false }) {
  if (typeof color !== "string") {
    color = "black";
  }

  return (
    <View>
      {beds.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            if (!disabled) {
              navigation.navigate("Lista", {
                leitos: stringify(beds),
                cor: color,
              });
            }
          }}
        >
          <View style={[styles.container]}>
            <View style={[styles.lives]}>
              <View style={[styles.head, { alignItems: "center" }]}>
                <FontAwesome
                  name="bed"
                  color={color}
                  style={{ fontSize: 24 }}
                />
                <Text style={[styles.title]}>
                  {" "}
                  {title} - {beds.length}
                </Text>
              </View>
              <Text style={styles.shortDescription}>
                Existem {beds.length} {title.toLowerCase()}
              </Text>
              <Text style={[styles.text, { paddingBottom: 10 }]}>
                {disabled ? "Ação desabilitada" : "Clique para ver mais"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function ListStatus({ route, navigation }) {
  const [beds, setBeds] = useState([]);
  const [userConfig, setUserConfig] = useState(null);
  const [percentage, setPercentage] = useState(0);

  const fetchData = async () => {
    const _userConfig = await AsyncStorage.getItem("userConfig").then(
      (userConfig) => {
        return parse(userConfig);
      }
    );
    setUserConfig(_userConfig);
    // !TODO: Remove this comment to filter by user permission and comment the next line
    // const _permissions =
    //   _userConfig?.permission === "admin"
    //     ? status
    //     : _getPermissions(_userConfig?.permission)?.map(
    //         (permission) => permission?.from
    //       );
    // const _beds = await BedsService.getByManyStatus(_permissions);
    const _beds = await BedsService.getAll();
    setBeds(_beds);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const [
    arrAvailable,
    arrOccupied,
    arrCleaning,
    arrBedding,
    arrMaintenance,
    arrBlocked,
  ] = useMemo(() => {
    const _availableArr = beds.filter((bed) => bed.status === "available");
    const _occupiedArr = beds.filter(
      (bed) =>
        bed.status === "occupied" ||
        bed.status === "discharge" ||
        bed.status === "final_discharge"
    );
    const _cleaningArr = beds.filter(
      (bed) =>
        bed.status === "awaiting_for_cleaning" ||
        bed.status === "cleaning_in_progress"
    );
    const beddingArr = beds.filter(
      (bed) =>
        bed.status === "awaiting_for_bedding" ||
        bed.status === "bedding_in_progress"
    );
    const _arrMaintenance = beds.filter((bed) => bed.isMaintenance);
    const _arrBlocked = beds.filter((bed) => bed.isBlocked);

    setPercentage((_occupiedArr.length * 100) / beds.length);

    return [
      _availableArr,
      _occupiedArr,
      _cleaningArr,
      beddingArr,
      _arrMaintenance,
      _arrBlocked,
    ];
  }, [beds]);

  const canAccessMaintenanceAndBlockedBeds = useMemo(() => {
    return (
      userConfig?.permission === "admin" ||
      userConfig?.permission === "enfermeira"
    );
  });

  const canAccessStatus = (status) => {
    const _permissionRelation = _getPermissions;
    return _permissionRelation.length > 0;
  };

  return (
    <ScrollView>
      <OccupancyRate percentage={percentage} />
      <BedList
        title="Leitos Livres"
        beds={canAccessStatus("available") ? arrAvailable : []}
        color={_getColor("available")}
        navigation={navigation}
        disabled={!canAccessStatus("available")}
      />
      <BedList
        title="Leitos Ocupados"
        beds={canAccessStatus("occupied") ? arrOccupied : []}
        color={_getColor("occupied")}
        navigation={navigation}
        disabled={!canAccessStatus("occupied")}
      />
      <BedList
        title="Leitos Higienização"
        beds={
          canAccessStatus("awaiting_for_cleaning") ||
          canAccessStatus("cleaning_in_progress")
            ? arrCleaning
            : []
        }
        color={_getColor("awaiting_for_cleaning")}
        navigation={navigation}
        disabled={
          !canAccessStatus("awaiting_for_cleaning") &&
          !canAccessStatus("cleaning_in_progress")
        }
      />
      <BedList
        title="Leitos Forragem"
        beds={
          canAccessStatus("awaiting_for_bedding") ||
          canAccessStatus("bedding_in_progress")
            ? arrBedding
            : []
        }
        color={_getColor("awaiting_for_bedding")}
        navigation={navigation}
        disabled={
          !canAccessStatus("awaiting_for_bedding") &&
          !canAccessStatus("bedding_in_progress")
        }
      />
      {canAccessMaintenanceAndBlockedBeds && (
        <>
          <BedList
            title="Leitos em Manutenção"
            beds={arrMaintenance}
            color={_getColor("maintenance")}
            navigation={navigation}
          />
          <BedList
            title="Leitos Bloqueados"
            beds={arrBlocked}
            color={_getColor("blocked")}
            navigation={navigation}
          />
        </>
      )}
    </ScrollView>
  );
}
