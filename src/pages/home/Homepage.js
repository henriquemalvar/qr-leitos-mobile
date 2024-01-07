import AsyncStorage from "@react-native-async-storage/async-storage";
import { parse } from "flatted";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SearchButton from "../../components/SearchButton";
import BedsService from "../../shared/services/BedsServices";
import { _getColor, _getPermissions } from "../../shared/util/translationUtils";
import { BedList } from "./components/BedList";
import { OccupancyRate } from "./components/OccupancyRate";
import { useFocusEffect } from "@react-navigation/native";

export default function ListStatus({ route, navigation }) {
  const [sector, setSector] = useState(null); // route.params?.sector || null
  const [beds, setBeds] = useState([]);
  const [userConfig, setUserConfig] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [showFloatButton, setShowFloatButton] = useState(false);
  const [bedCounts, setBedCounts] = useState({
    available: 0,
    occupied: 0,
    cleaning: 0,
    bedding: 0,
    maintenance: 0,
    blocked: 0,
  });

  useFocusEffect(
    useCallback(() => {
      let sector = route.params?.sector === "" ? null : parse(route.params?.sector);
      const fetchData = async () => {
        const _userConfig = await AsyncStorage.getItem("userConfig").then(
          (userConfig) => JSON.parse(userConfig)
        );
        setUserConfig(_userConfig);

        const statusList = [
          "occupied",
          "discharge",
          "final_discharge",
          "awaiting_for_cleaning",
          "cleaning_in_progress",
          "awaiting_for_bedding",
          "bedding_in_progress",
          // "maintenance",
          // "blocked",
          "available",
        ];

        const results = await Promise.all(
          statusList.map((status) =>
            BedsService.getCountByStatus(status, sector)
          )
        );

        const [
          _beds_occupied,
          _beds_discharge,
          _beds_final_discharge,
          _beds_awaiting_for_cleaning,
          _beds_cleaning_in_progress,
          _beds_awaiting_for_bedding,
          _beds_bedding_in_progress,
          // _beds_maintenance,
          // _beds_blocked,
          _beds_available,
        ] = results;

        const _arrOccupied =
          _beds_occupied + _beds_discharge + _beds_final_discharge;
        const _arrCleaning =
          _beds_awaiting_for_cleaning + _beds_cleaning_in_progress;
        const _arrBedding =
          _beds_awaiting_for_bedding + _beds_bedding_in_progress;

        setBedCounts({
          occupied: _arrOccupied,
          cleaning: _arrCleaning,
          bedding: _arrBedding,
          maintenance: 0,
          blocked: 0,
          available: _beds_available,
        });

        const _percentage =
          (_arrOccupied * 100) / (_arrOccupied + _beds_available);
        setPercentage(isNaN(_percentage) ? 0 : _percentage);
      };

      fetchData();
    }, [])
  );

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
    <>
      <View>
        <ScrollView>
          <OccupancyRate percentage={percentage} />
          <BedList
            title="Leitos Livres"
            beds={canAccessStatus("available") ? bedCounts.available : []}
            color={_getColor("available")}
            navigation={navigation}
            disabled={!canAccessStatus("available")}
            status={["available"]}
          />
          <BedList
            title="Leitos Ocupados"
            beds={canAccessStatus("occupied") ? bedCounts.occupied : []}
            color={_getColor("occupied")}
            navigation={navigation}
            disabled={
              !canAccessStatus("occupied") &&
              !canAccessStatus("discharge") &&
              !canAccessStatus("final_discharge")
            }
            status={["occupied", "discharge", "final_discharge"]}
          />
          <BedList
            title="Leitos Higienização"
            beds={
              canAccessStatus("awaiting_for_cleaning") ||
              canAccessStatus("cleaning_in_progress")
                ? bedCounts.cleaning
                : []
            }
            color={_getColor("awaiting_for_cleaning")}
            navigation={navigation}
            disabled={
              !canAccessStatus("awaiting_for_cleaning") &&
              !canAccessStatus("cleaning_in_progress")
            }
            status={["awaiting_for_cleaning", "cleaning_in_progress"]}
          />
          <BedList
            title="Leitos Forragem"
            beds={
              canAccessStatus("awaiting_for_bedding") ||
              canAccessStatus("bedding_in_progress")
                ? bedCounts.bedding
                : []
            }
            color={_getColor("awaiting_for_bedding")}
            navigation={navigation}
            disabled={
              !canAccessStatus("awaiting_for_bedding") &&
              !canAccessStatus("bedding_in_progress")
            }
            status={["awaiting_for_bedding", "bedding_in_progress"]}
          />
          {canAccessMaintenanceAndBlockedBeds && (
            <>
              <BedList
                title="Leitos em Manutenção"
                beds={bedCounts.maintenance}
                color={_getColor("maintenance")}
                navigation={navigation}
              />
              <BedList
                title="Leitos Bloqueados"
                beds={bedCounts.blocked}
                color={_getColor("blocked")}
                navigation={navigation}
              />
            </>
          )}
        </ScrollView>
      </View>
      <SearchButton navigation={navigation} />
    </>
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
