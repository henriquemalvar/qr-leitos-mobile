import { FontAwesome } from "@expo/vector-icons";
import globalStyles from "@styles/globalStyles";
import { _getColor } from "@utils/translationUtils";
import { stringify } from "flatted";
import { TouchableOpacity } from "react-native";
import { Card, Title } from "react-native-paper";

export const BedListItem = ({ bed, navigation }) => {
  const color = _getColor(bed.status);

  return (
    <Card style={globalStyles.card} >
      <TouchableOpacity
        onPress={() => navigation.navigate("Leito", { leito: stringify(bed) })}
      >
        <Card.Content style={globalStyles.head}>
          <FontAwesome name="bed" color={color} style={globalStyles.icon} />
          <Title style={globalStyles.title}>{bed.name}</Title>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};
