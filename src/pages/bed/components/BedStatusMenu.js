import globalStyles from "@styles/globalStyles";
import { theme } from "@styles/theme";
import { translateStatus } from "@utils/translationUtils";
import { useCallback, useState } from "react";
import { Button, Card, Divider, Headline, Menu } from "react-native-paper";

const BedStatusMenu = ({
  menuOptions = [],
  selectedMenuOption,
  currentBedStatus,
  setSelectedMenuOption,
}) => {
  const [isMenuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleMenuOptionSelect = useCallback(
    (value) => {
      setSelectedMenuOption(value);
      closeMenu();
    },
    [setSelectedMenuOption]
  );

  const selectedMenuOptionLabel = menuOptions.find(
    (option) => option.value === selectedMenuOption
  )?.label;

  const defaultButtonText =
    selectedMenuOptionLabel ||
    translateStatus(currentBedStatus) ||
    "Selecione uma opção";

  return (
    <Card style={globalStyles.card}>
      <Card.Content>
        <Headline style={globalStyles.title}>Estado do Leito</Headline>
        <Divider style={globalStyles.divider} />
        {menuOptions.length >= 0 && (
          <Menu
            visible={isMenuVisible}
            onDismiss={closeMenu}
            
            anchor={
              <Button
                onPress={openMenu}
                mode="outlined"
                buttonColor={theme.colors.background}
                textColor={theme.colors.text}
              >
                {defaultButtonText}
              </Button>
            }
          >
            {menuOptions.map((option, index) => (
              <Menu.Item
                key={index}
                onPress={() => handleMenuOptionSelect(option.value)}
                title={option.label}
                background={theme.colors.background}
              />
            ))}
          </Menu>
        )}
      </Card.Content>
    </Card>
  );
};

export default BedStatusMenu;
