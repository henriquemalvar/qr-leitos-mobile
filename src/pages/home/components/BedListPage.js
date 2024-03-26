import React, { useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { List } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import BedsService from '@services/BedsServices';
import globalStyles from '@styles/globalStyles';
import { parse, stringify } from 'flatted';
import SearchButton from '@components/SearchButton';
import { useNetInfoStatus } from '@contexts/NetInfoProvider';

export default function BedListPage({ route, navigation }) {
  const { cor, status, section, maintenance, blocked } = route.params;
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const netInfo = useNetInfoStatus();

  const fetchData = useCallback(async () => {
    if (!netInfo.isConnected) {
      setLoading(false);
      return;
    }

    let bedsArrays;
    if (maintenance) {
      bedsArrays = await BedsService.getBedsByConditions({
        maintenance,
        section,
      });
    } else if (blocked) {
      bedsArrays = await BedsService.getBedsByConditions({
        blocked,
        section,
      });
    } else {
      const statusList = parse(status);
      const bedsPromises = Array.isArray(statusList)
        ? statusList.map((status) =>
            section
              ? BedsService.getBedsByConditions({ status, section })
              : BedsService.getBedsByConditions({ status })
          )
        : [];
      bedsArrays = await Promise.all(bedsPromises);
    }
    const combinedBeds = Array.isArray(bedsArrays)
      ? bedsArrays.flat()
      : bedsArrays;
    combinedBeds.sort((a, b) => sortBeds(a.name, b.name));
    setBeds(combinedBeds);
    setLoading(false);
  }, [netInfo.isConnected, maintenance, blocked, status, section]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );
  function sortBeds(a, b) {
    return a.localeCompare(b);
  }

  if (loading || !netInfo.isConnected) {
    return (
      <View style={{ ...globalStyles.page, ...globalStyles.centeredContainer }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
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