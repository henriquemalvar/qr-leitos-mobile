import globalStyles from "@styles/globalStyles";
import { FAB } from "react-native-paper";

const SearchButton = ({ navigation, name, type, location, section }) => {
  const params = { name, type, location, section };

  return (
    <FAB
      style={globalStyles.fab}
      size="medium"
      icon="magnify"
      onPress={() => navigation.navigate("Pesquisa", params)}
      color="white"
    />
  );
};

export default SearchButton;
