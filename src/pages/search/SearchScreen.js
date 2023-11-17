import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import db from "../../database/database";

const SearchScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleClearInput = () => {
    setSearchTerm("");
    setResults([]);
  };

  const handleSearch = () => {
    const searchTermUpper = searchTerm.toUpperCase();
    db.collection("beds")
      .orderBy("name")
      .startAt(searchTermUpper)
      .endAt(searchTermUpper + "\uf8ff")
      .get()
      .then((querySnapshot) => {
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResults(results);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={handleClearInput}>
            <Icon name="times-circle" size={20} color="#000" />
          </TouchableOpacity>
        )}
      </View>
      {/* Lista de resultados */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Leito", { leito: JSON.stringify(item) })
            }
          >
            <View style={styles.leito}>
              <Icon name="bed" size={20} color="#000" />
              <Text style={styles.title}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  searchIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    color: "#424242",
  },
  cancelButtonText: {
    color: "#007AFF",
  },
  searchButtonText: {
    color: "#007AFF",
  },
  leito: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    margin: 5,
    padding: 10,
  },
  title: {
    marginLeft: 10,
  },
});
export default SearchScreen;
