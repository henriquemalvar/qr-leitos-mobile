import globalStyles from "@styles/globalStyles";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { BedListItem } from "./components/BedCard/BedCard";
import { LoadingIndicator } from "./components/LoadingIndicator/LoadingIndicator";
import { SearchForm } from "./components/SearchForm/SearchForm";

const SearchPage = ({ navigation, route }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleResults = (newResults) => {
    setResults(newResults);
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  return (
    <View style={globalStyles.page}>
      <SearchForm
        navigation={navigation}
        route={route}
        onResults={handleResults}
        onLoading={handleLoading}
      />

      <LoadingIndicator loading={loading} />

      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={true}
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BedListItem bed={item} navigation={navigation} />
        )}
      />
    </View>
  );
};
export default SearchPage;