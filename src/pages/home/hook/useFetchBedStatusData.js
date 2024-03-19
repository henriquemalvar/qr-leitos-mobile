import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import BedsService from "@services/BedsServices";
import { parse } from "flatted";
import * as React from "react";
import { useState } from "react";

const statusList = [
  "occupied",
  "discharge",
  "final_discharge",
  "awaiting_for_cleaning",
  "cleaning_in_progress",
  "awaiting_for_bedding",
  "bedding_in_progress",
  "available",
];

export const useFetchBedStatusData = (section) => {
  const [data, setData] = useState({
    userConfig: null,
    bedCounts: {
      available: 0,
      occupied: 0,
      cleaning: 0,
      bedding: 0,
      maintenance: 0,
      blocked: 0,
    },
    percentage: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const userConfigString = await AsyncStorage.getItem("userConfig");
          const userConfig = userConfigString ? parse(userConfigString) : null;

          const results = await Promise.all(
            statusList.map((status) =>
              BedsService.getCountByStatus(status, section)
            )
          );

          const bedCounts = results.reduce(
            (acc, count, index) => {
              const status = statusList[index];
              if (
                ["occupied", "discharge", "final_discharge"].includes(status)
              ) {
                acc.occupied += count;
              } else if (
                ["awaiting_for_cleaning", "cleaning_in_progress"].includes(
                  status
                )
              ) {
                acc.cleaning += count;
              } else if (
                ["awaiting_for_bedding", "bedding_in_progress"].includes(status)
              ) {
                acc.bedding += count;
              } else if (status === "available") {
                acc.available = count;
              }
              return acc;
            },
            {
              available: 0,
              occupied: 0,
              cleaning: 0,
              bedding: 0,
              maintenance: 0,
              blocked: 0,
            }
          );

          bedCounts.maintenance = await BedsService.getCountByMaintenance(
            true,
            section
          );
          bedCounts.blocked = await BedsService.getCountByBlocked(
            true,
            section
          );

          const totalBeds = bedCounts.occupied + bedCounts.available;
          const percentage =
            totalBeds > 0 ? (bedCounts.occupied * 100) / totalBeds : 0;

          setData({
            userConfig,
            bedCounts,
            percentage,
          });
        } catch (error) {
          console.error("Failed to fetch bed status data:", error);
        }
      };

      fetchData();
    }, [section])
  );

  return data;
};
