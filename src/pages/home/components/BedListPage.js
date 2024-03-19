import SearchButton from "@components/SearchButton";
import { FontAwesome } from "@expo/vector-icons";
import BedsService from "@services/BedsServices";
import globalStyles from "@styles/globalStyles";
import { parse, stringify } from "flatted";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { List } from "react-native-paper";

export default function BedListPage({ route, navigation }) {
  const { cor, status, section, maintenance, blocked } = route.params;
  const [beds, setBeds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let bedsArrays;
      if (maintenance) {
        bedsArrays = await BedsService.getBedsUnderMaintenance(true, section);
      } else if (blocked) {
        bedsArrays = await BedsService.getBlockedBeds(true, section);
      } else {
        const statusList = parse(status);
        const bedsPromises = Array.isArray(statusList)
          ? statusList.map((status) =>
              section
                ? BedsService.getByStatusAndSection(status, section)
                : BedsService.getByStatus(status)
            )
          : [];
        bedsArrays = await Promise.all(bedsPromises);
      }
      const combinedBeds = Array.isArray(bedsArrays)
        ? bedsArrays.flat()
        : bedsArrays;
      combinedBeds.sort((a, b) => sortBeds(a.name, b.name));
      setBeds(combinedBeds);
    };
    fetchData();
  }, []);

  function sortBeds(a, b) {
    return a.localeCompare(b);
  }

  return (
    <View style={globalStyles.page}>
      <FlatList
        showsVerticalScrollIndicator={true}
        data={beds}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item: bed }) => {
          return (
            <List.Item
              title={bed.name}
              titleStyle={globalStyles.title}
              left={(props) => (
                <FontAwesome
                  name="bed"
                  color={cor}
                  style={[
                    globalStyles.icon,
                    [
                      {
                        marginLeft: 10,
                        marginVertical: 5,
                      },
                    ],
                  ]}
                />
              )}
              onPress={() => {
                navigation.navigate("Leito", {
                  leito: stringify(bed),
                });
              }}
              style={globalStyles.card}
            />
          );
        }}
      />
      <SearchButton navigation={navigation} section={section} />
    </View>
  );
}
