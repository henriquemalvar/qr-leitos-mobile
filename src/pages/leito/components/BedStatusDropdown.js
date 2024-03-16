import React, { useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { translateStatus } from "../../../shared/util/translationUtils";

export const BedStatusDropdown = ({
  options,
  selectedOption,
  currentStatus,
  disabled,
  setSelectedOption,
}) => {
  const onSelect = useCallback(
    (selectedItem, index) => {
      setSelectedOption(options[index]?.value || "");
    },
    [options, setSelectedOption]
  );

  const defaultButtonText = useMemo(() => {
    const translatedText =
      translateStatus(currentStatus) || "Selecione uma opção";
    return translatedText;
  }, [selectedOption]);

  return (
    <View style={styles.containerDropdown}>
      <View style={styles.containerDesc}>
        <Text style={styles.detailsFont}>Estado do Leito </Text>
      </View>
      {options.length >= 0 && (
        <SelectDropdown
          disabled={disabled}
          data={options.map((option) => option.label)}
          onSelect={onSelect}
          defaultButtonText={defaultButtonText}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          style={styles.dropdown}
          buttonStyle={styles.dropdownButton}
          dropdownStyle={styles.dropdownDropdown}
        ></SelectDropdown>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerDropdown: {
    backgroundColor: "#E7E6E1",
    width: "97%",
    borderRadius: 15,
    paddingBottom: 15,
  },
  dropdown: {
    backgroundColor: "#E7E6E1",
    width: "97%",
    borderRadius: 15,
  },
  dropdownButton: {
    backgroundColor: "#fff",
    width: "97%",
    borderRadius: 15,
    alignSelf: "center",
  },
  dropdownDropdown: {
    backgroundColor: "#fff",
    width: "94%",
    borderRadius: 15,
  },
  containerDesc: {
    backgroundColor: "#E7E6E1",
    width: "97%",
    flexDirection: "column",
    borderRadius: 15,
    marginBottom: 10,
  },
  detailsFont: {
    fontSize: 24,
    paddingLeft: 10,
    fontWeight: "bold",
    paddingBottom: 5,
    paddingTop: 10,
  },
});
