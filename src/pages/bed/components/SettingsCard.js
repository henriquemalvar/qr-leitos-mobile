import globalStyles from "@styles/globalStyles";
import { Switch, Text, View } from "react-native";
import { Card, Divider, Headline, useTheme } from "react-native-paper";

const SettingToggle = ({ label, value, onValueChange }) => {
  const { colors } = useTheme();

  return (
    <View style={globalStyles.rowContainer}>
      <Text style={globalStyles.checkboxLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? colors.primary : colors.disabled}
        trackColor={{ true: colors.primary, false: colors.disabled }}
      />
    </View>
  );
};

export const SettingsCard = ({ toggles }) => (
  <Card style={globalStyles.card}>
    <Card.Content>
      <Headline style={globalStyles.title}>Configurações</Headline>
      <Divider style={globalStyles.divider} />
      {toggles.map((toggle, index) => (
        <SettingToggle
          key={index}
          label={toggle.label}
          value={toggle.value}
          onValueChange={toggle.onValueChange}
        />
      ))}
    </Card.Content>
  </Card>
);
