import BedsService from "@services/BedsServices";
import globalStyles from "@styles/globalStyles";
import { theme } from "@styles/theme";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";

export const SearchForm = ({ navigation, route, onResults, onLoading }) => {
  const { control, handleSubmit, reset } = useForm();
  const [state, setState] = useState({
    results: [],
    type: route.params?.type || "",
    location: route.params?.location || "",
    section: route.params?.section || "",
    filtersVisible: false,
    loading: false,
    name: route.params?.name || "",
  });

  const { filtersVisible } = state;

  const handleClearInput = () => {
    reset({
      name: "",
      type: "",
      location: "",
      section: "",
    });
    setState({
      ...state,
      results: [],
      name: "",
      type: "",
      location: "",
      section: "",
    });
  };

  function handleValue(value, defaultValue) {
    return value !== undefined && value !== null ? value : defaultValue;
  }

  const onSubmit = async (data) => {
    onLoading(true);

    try {
      const results = await BedsService.filterBeds(data);
      onResults(results);
      onLoading(false);
    } catch (error) {
      console.error("Erro ao buscar documentos: ", error);
      onLoading(false);
    }
  };

  const toggleFilters = () => {
    setState({ ...state, filtersVisible: !filtersVisible });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={globalStyles.container}
    >
      <View style={globalStyles.container}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={globalStyles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={handleValue(value, state.name)}
              mode="outlined"
              label="Nome do leito"
            />
          )}
          name="name"
          defaultValue={state.name}
        />

        {filtersVisible && (
          <>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={globalStyles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={handleValue(value, state.type)}
                  mode="outlined"
                  label="Tipo"
                />
              )}
              name="type"
              defaultValue={
                Array.isArray(state.type) ? state.type[0] : state.type
              }
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={globalStyles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={handleValue(value, state.location)}
                  mode="outlined"
                  label="Localização"
                />
              )}
              name="location"
              defaultValue={state.location}
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={globalStyles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={handleValue(value, state.section)}
                  mode="outlined"
                  label="Setor"
                />
              )}
              name="section"
              defaultValue={state.section}
            />
          </>
        )}

        <Button
          icon={filtersVisible ? "chevron-up" : "chevron-down"}
          mode="outlined"
          onPress={toggleFilters}
        >
          {filtersVisible ? "Menos filtros" : "Mais filtros"}
        </Button>
        <View style={globalStyles.flexRow}>
          <View style={globalStyles.flex} />
          <IconButton icon="eraser" onPress={handleClearInput} iconColor={
            theme.colors.error
          } />
          <Button
            icon="magnify"
            mode="contained"
            onPress={handleSubmit(onSubmit)}
          >
            Pesquisar
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
