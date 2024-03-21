import SearchButton from "@components/SearchButton";
import { useFocusEffect } from "@react-navigation/native";
import BedsService from "@services/BedsServices";
import globalStyles from "@styles/globalStyles";
import { sections } from "@utils/constantsUtils";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SectorCard from "./components/SectorCard/SectorCard";

export default function SectorListPage({ navigation }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBedsCountBySector = async () => {
    const promises = sections.map(async (section) => {
      const count = await BedsService.getCountBy({section});
      return { section, count };
    });
    const counts = await Promise.all(promises);
    return counts;
  };

  useFocusEffect(
    useCallback(() => {
      getBedsCountBySector().then((counts) => {
        setCards(counts);
        setLoading(false);
      });
    }, [])
  );

  return (
    <View style={globalStyles.page}>
      <View>
        <FlatList
          data={cards.filter((item) => item.count !== 0)}
          keyExtractor={(item) => item.section}
          renderItem={({ item }) => (
            <SectorCard
              section={item.section}
              number={item.count}
              navigation={navigation}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
      <SearchButton navigation={navigation} />
    </View>
  );
}
