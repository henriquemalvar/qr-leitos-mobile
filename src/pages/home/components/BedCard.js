import { FontAwesome } from "@expo/vector-icons";
import globalStyles from "@styles/globalStyles";
import { stringify } from "flatted";
import { TouchableOpacity, View } from "react-native";
import { Card, Paragraph, Text, Title, useTheme } from "react-native-paper";

export default function BedCard({
  title,
  beds,
  color,
  navigation,
  disabled = false,
  status = [],
  maintenance,
  blocked,
  section,
}) {
  const theme = useTheme();
  disabled = beds === 0 ? true : disabled;
  disabled ? (color = theme.colors.error) : color;
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
          if (!disabled) {
            navigation.navigate("Lista", {
              leitos: stringify(beds),
              cor: color,
              status: stringify(status),
              maintenance,
              blocked,
              section,
            });
          }
        }}
      >
        <Card.Content>
          <View style={globalStyles.head}>
            <FontAwesome
              name={disabled ? "lock" : "bed"}
              color={color}
              style={globalStyles.icon}
            />
            <Title style={globalStyles.title}>
              {title} - {beds}
            </Title>
          </View>
          <Paragraph style={globalStyles.textCenter}>
            {beds === 0
              ? `Não há leitos disponíveis nessa condição`
              : `Existem ${beds} ${title.toLowerCase()}`}
          </Paragraph>
          <Text style={globalStyles.textInPrimaryColor}>
            {disabled ? "Ação desabilitada" : "Clique para ver mais"}
          </Text>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
}
