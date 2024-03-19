import SearchButton from "@components/SearchButton";
import globalStyles from "@styles/globalStyles";
import { _getColor, _getPermissions } from "@utils/translationUtils";
import { parse } from "flatted";
import { useMemo } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import BedCard from "./components/BedCard";
import OccupancyCard from "./components/OccupancyCard";
import { useFetchBedStatusData } from "./hook/useFetchBedStatusData";

export default function BedStatusPage({ route, navigation }) {
  const section =
    route.params?.section === "" ? null : parse(route.params?.section);
  const { userConfig, bedCounts, percentage } = useFetchBedStatusData(section);
  const theme = useTheme();

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
      <View style={globalStyles.page}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <OccupancyCard percentage={percentage} />
          <BedCard
            title="Leitos Livres"
            beds={canAccessStatus("available") ? bedCounts.available : []}
            color={_getColor("available")}
            navigation={navigation}
            disabled={!canAccessStatus("available")}
            status={["available"]}
            section={section}
          />
          <BedCard
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
            section={section}
          />
          <BedCard
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
            section={section}
          />
          <BedCard
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
            section={section}
          />
          {canAccessMaintenanceAndBlockedBeds && (
            <>
              <BedCard
                title="Leitos em Manutenção"
                beds={bedCounts.maintenance}
                color={_getColor("maintenance")}
                navigation={navigation}
                maintenance={true}
              />
              <BedCard
                title="Leitos Bloqueados"
                beds={bedCounts.blocked}
                color={_getColor("blocked")}
                navigation={navigation}
                blocked={true}
              />
            </>
          )}
        </ScrollView>
      </View>
      <SearchButton navigation={navigation} section={section} />
    </>
  );
}
