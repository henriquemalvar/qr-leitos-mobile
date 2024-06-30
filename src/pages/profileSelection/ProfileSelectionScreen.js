import AsyncStorage from "@react-native-async-storage/async-storage";
import globalStyles from "@styles/globalStyles";
import { parse } from "flatted";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Text,
  TextInput,
} from "react-native-paper";

export default function ProfileSelectionScreen({ navigation, route }) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
  const loadProfiles = async () => {
    setLoading(true);
    const userConfigString = await AsyncStorage.getItem("userConfig");
    const userConfig = parse(userConfigString);
    if (userConfig && userConfig.profiles && userConfig.profiles.length > 0) {
      setProfiles(userConfig.profiles);
    } else {
      const defaultProfile = ["Usuário Padrão"];
      setProfiles(defaultProfile);
      setSelectedProfile(defaultProfile[0]);
    }
    const savedProfile = await AsyncStorage.getItem("selectedProfile");
    if (savedProfile) {
      setSelectedProfile(savedProfile);
    } else if (!userConfig || !userConfig.profiles || userConfig.profiles.length === 0) {
      await AsyncStorage.setItem("selectedProfile", "Usuário Padrão");
      setSelectedProfile("Usuário Padrão");
    }
    setLoading(false);
  };

  loadProfiles();
}, []);

  const handleProfileSelection = useCallback(async (profile) => {
    setSelectedProfile(profile);
  }, []);

  const confirmProfileSelection = useCallback(async () => {
    if (selectedProfile) {
      try {
        await AsyncStorage.setItem("selectedProfile", selectedProfile);
        navigation.navigate("StartShift", {
          idUser: route.params.idUser,
          profile: selectedProfile,
        });
      } catch (error) {
        console.error("Erro ao salvar o perfil selecionado:", error);
      }
    }
  }, [selectedProfile, navigation, route.params.idUser]);

  const filteredProfiles = profiles.filter((profile) =>
    profile.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <ActivityIndicator
        style={{ marginTop: 20 }}
        animating={true}
        size="large"
      />
    );
  }

  return (
    <ScrollView style={globalStyles.page}>
      <Card.Content>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={globalStyles.input}
              onBlur={onBlur}
              onChangeText={(text) => {
                onChange(text);
                setSearchQuery(text);
              }}
              value={value}
              mode="outlined"
              label="Pesquisar Perfil"
            />
          )}
          name="profileSearch"
          defaultValue=""
        />
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          Selecione o Perfil
        </Text>
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile, index) => (
            <Button
              key={index}
              mode="outlined"
              onPress={() => handleProfileSelection(profile)}
              style={{
                marginBottom: 10,
                backgroundColor:
                  profile === selectedProfile ? "#567ebb" : "transparent",
              }}
              labelStyle={{
                color: profile === selectedProfile ? "white" : "black",
              }}
            >
              {profile}
            </Button>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Nenhum perfil disponível.
          </Text>
        )}
        <Button
          mode="contained"
          onPress={confirmProfileSelection}
          disabled={!selectedProfile}
          style={{ marginTop: 20 }}
        >
          Confirmar Seleção
        </Button>
      </Card.Content>
    </ScrollView>
  );
}
