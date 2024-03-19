import { FontAwesome } from "@expo/vector-icons";
import globalStyles from "@styles/globalStyles";
import { stringify } from "flatted";
import { TouchableOpacity, View } from "react-native";
import { Card, Paragraph, Text, Title, useTheme } from "react-native-paper";

export default function SectorCard({
  section,
  number,
  navigation,
  disabled = false,
}) {
  const theme = useTheme();
  disabled = number === 0 ? true : disabled;
  const color = disabled ? theme.colors.error : theme.colors.secondaryVariant;

  return (
    <Card
      style={[
        globalStyles.card,
        disabled ? { backgroundColor: theme.colors.disabled } : {},
      ]}
    >
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          navigation.navigate("Homepage", {
            section: stringify(section || ""),
          });
        }}
      >
        <Card.Content>
          <View style={globalStyles.head}>
            <FontAwesome
              name={disabled ? "lock" : "building"}
              color={color}
              style={globalStyles.icon}
            />
            <Title style={globalStyles.title}>
              {section} - {number}
            </Title>
          </View>
          <Paragraph style={globalStyles.textCenter}>
            {number === 0
              ? "Não há leitos disponíveis nesse setor"
              : `Existem ${number} leitos nesse setor`}
          </Paragraph>
          <Text style={globalStyles.textInPrimaryColor}>
            {disabled ? "Ação desabilitada" : "Clique para ver mais"}
          </Text>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
}
