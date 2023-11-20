import AsyncStorage from "@react-native-async-storage/async-storage";
import { parse } from "flatted";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SearchButton from "../../components/SearchButton";
import BedsService from "../../shared/services/BedsServices";
import { _getColor, _getPermissions } from "../../shared/util/translationUtils";
import { BedList } from "./components/BedList";
import { OccupancyRate } from "./components/OccupancyRate";

export default function ListStatus({ route, navigation }) {
  const [beds, setBeds] = useState([]);
  const [userConfig, setUserConfig] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [showFloatButton, setShowFloatButton] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const _userConfig = await AsyncStorage.getItem("userConfig").then(
        (userConfig) => {
          return parse(userConfig);
        }
      );
      setUserConfig(_userConfig);
    };

    fetchData();

    const unsubscribe = BedsService.listenToAllBedsChanges((newBeds) => {
      setBeds(newBeds);
      setShowFloatButton(newBeds.length > 0);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
    <View>
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
      {showFloatButton && <SearchButton navigation={navigation} />}
    </View>
  );
}



export const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  lives: {
    flexDirection: "column",
    backgroundColor: "#dcdcdc",
    width: "94%",
    height: 130,
    paddingTop: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  head: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 10,
  },
  shortDescription: {
    fontSize: 16,
    paddingTop: 25,
    alignSelf: "center",
  },
  longDescription: {
    fontSize: 12,
    paddingTop: 25,
    alignSelf: "center",
  },
  text: {
    color: "#6495ED",
    paddingTop: 12,
    fontSize: 12,
    alignSelf: "center",
  },
  occupation: {
    backgroundColor: "#dcdcdc",
    width: "94%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textOc: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
