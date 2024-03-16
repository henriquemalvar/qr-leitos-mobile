import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SearchButton from "../../components/SearchButton";
import BedsService from "../../shared/services/BedsServices";
import { sectors } from "../../shared/util/constantsUtils";
import SectorCard from "./components/SectorCard";
export default function Sectors({ navigation }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBedsCountBySector = async () => {
    const promises = sectors.map(async (sector) => {
      const count = await BedsService.getCountBySector(sector);
      return { sector, count };
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
    <View>
      <View>
        <FlatList
          data={cards.filter((item) => item.count !== 0)}
          keyExtractor={(item) => item.sector}
          renderItem={({ item }) => (
            <SectorCard
              sector={item.sector}
              number={item.count}
              navigation={navigation}
            />
          )}
        />
      </View>
      <SearchButton navigation={navigation} />
    </View>
  );
}
