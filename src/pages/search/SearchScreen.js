import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import db from "../../database/database";
import { _getColor, translateStatus } from "../../shared/util/translationUtils";
import { styles } from "./styles";

const SearchScreen = ({ navigation }) => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [state, setState] = useState({
    results: [],
    type: "",
    address: "",
    filtersVisible: false,
    loading: false,
    searchTerm: "",
  });

  const { results, type, address, filtersVisible, loading, searchTerm } = state;

  useEffect(() => {
    ["searchTerm", "type", "address"].forEach((field) => register(field));
  }, [register]);

  const handleClearInput = () => {
    reset();
    setState({
      ...state,
      results: [],
      searchTerm: "",
      type: "",
      address: "",
    });
  };

  const fetchData = async (data) => {
    let query = db.collection("beds");

    if (data.searchTerm) {
      const searchTermUpper = data.searchTerm.toUpperCase();
      query = query
        .orderBy("name")
        .startAt(searchTermUpper)
        .endAt(searchTermUpper + "\uf8ff");
    }

    const querySnapshot = await query.get();
    const results = querySnapshot.docs.map((doc) => doc.data());

    return results;
  };

  const onSubmit = async (data) => {
    setState({ ...state, loading: true });

    try {
      const results = await fetchData(data);
      setState({ ...state, results, loading: false });
    } catch (error) {
      console.log("Erro ao buscar documentos: ", error);
      setState({ ...state, loading: false });
    }
  };

  const toggleFilters = () => {
    setState({ ...state, filtersVisible: !filtersVisible });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome"
          onChangeText={(text) => setValue("searchTerm", text)}
        />
        <TouchableOpacity onPress={toggleFilters} style={styles.expandButton}>
          <Text style={styles.expandButtonText}>
            {filtersVisible ? "Menos filtros" : "Mais filtros"}
          </Text>
          <Icon
            name={filtersVisible ? "angle-up" : "angle-down"}
            size={20}
            color="black"
          />
        </TouchableOpacity>

        {filtersVisible && (
          <>
            <Text style={styles.label}>Tipo (Masculino/Feminino):</Text>
            <Picker
              selectedValue={type}
              style={styles.input}
              onValueChange={(itemValue, itemIndex) =>
                setValue("type", itemValue)
              }
            >
              <Picker.Item label="Masculino" value="masculino" />
              <Picker.Item label="Feminino" value="feminino" />
            </Picker>
            <Text style={styles.label}>Endereço:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o endereço"
              onChangeText={(text) => setValue("address", text)}
            />
          </>
        )}
        <View style={styles.buttonContainer}>
          <View style={styles.spacer} />
          <TouchableOpacity onPress={handleClearInput} style={styles.button}>
            <Icon name="times" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          >
            <Icon name="search" size={20} color="white" />
            <Text style={styles.buttonText}>Pesquisar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Leito", { leito: stringify(item) })
            }
          >
            <View style={styles.leito}>
              <Icon name="bed" size={20} color={_getColor(item.status)} />
              <Text style={styles.title}>
                {item.name} - {translateStatus(item.status)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>Nenhum resultado encontrado.</Text>
        }
      />
    </View>
  );
};

export default SearchScreen;
