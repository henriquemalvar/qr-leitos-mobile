import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { stringify } from "flatted";

const SearchScreen = ({ navigation }) => {
  const { control, handleSubmit, reset } = useForm();
  const [state, setState] = useState({
    results: [],
    type: "",
    location: "",
    filtersVisible: false,
    loading: false,
    searchTerm: "",
  });

  const { results, type, location, filtersVisible, loading, searchTerm } = state;

  const handleClearInput = () => {
    reset();
    setState({
      ...state,
      results: [],
      searchTerm: "",
      type: "",
      location: "",
    });
  };

  const fetchData = async (data) => {
      let query = db.collection("beds");
      let localLocationFilter = false;
      if (data.searchTerm) {
        const searchTermUpper = data.searchTerm.toUpperCase();
        query = query
          .orderBy("name")
          .startAt(searchTermUpper)
          .endAt(searchTermUpper + "\uf8ff");
      }

      if (data.type) {
        query = query.where("type", "array-contains", data.type);
      }

      if (data.location) {
        if(!data.searchTerm) {
        query = query.where("location", "array-contains", data.location);
        }
        else {
          localLocationFilter = true;
        }

      }

      try {
        const querySnapshot = await query.get();
        let results = querySnapshot.docs.map((doc) => doc.data());
        if(localLocationFilter) {
          const filteredResults = results.filter((result) => {
            return result.location.some(location => location.includes(data.location));
          });
          return filteredResults;
        }
        return results;
      } catch (error) {
        console.error("Erro ao buscar documentos: ", error);
      }
    };

  const onSubmit = async (data) => {
    setState({ ...state, loading: true });

    try {
      const results = await fetchData(data);
      setState({ ...state, results, loading: false });
    } catch (error) {
      console.error("Erro ao buscar documentos: ", error);
      setState({ ...state, loading: false });
    }
  };

  const toggleFilters = () => {
    setState({ ...state, filtersVisible: !filtersVisible });
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Nome:</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Digite o nome"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="searchTerm"
          defaultValue=""
        />

        {filtersVisible && (
          <>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
              Tipo (Masculino/Feminino):
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  style={[styles.input, styles.picker]}
                  onValueChange={onChange}
                >
                  <Picker.Item label="Selecione" value="" />
                  <Picker.Item label="Masculino" value="Masculino" />
                  <Picker.Item label="Feminino" value="Feminino" />
                </Picker>
              )}
              name="type"
              defaultValue=""
            />
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
              Endereço:
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Digite o endereço"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="location"
              defaultValue=""
            />
          </>
        )}

        <TouchableOpacity onPress={toggleFilters} style={styles.filterButton}>
          <Icon
            name={filtersVisible ? "angle-up" : "angle-down"}
            size={20}
            color="black"
            style={{ marginRight: 5, marginBottom: 5 }}
          />
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
            {filtersVisible ? "Menos filtros" : "Mais filtros"}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={handleClearInput}
            style={styles.clearButton}
          >
            <Icon name="times" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.searchButton}
          >
            <Icon name="search" size={20} color="white" />
            <Text style={{ color: "white", marginLeft: 5 }}>Pesquisar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <View style={styles.loading}>
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
            <View style={styles.listItem}>
              <Icon name="bed" size={20} color={_getColor(item.status)} />
              <Text style={{ marginLeft: 10 }}>
                {item.name} - {translateStatus(item.status)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyList}>Nenhum resultado encontrado.</Text>
        }
      />
    </View>
  );
};

export default SearchScreen;
