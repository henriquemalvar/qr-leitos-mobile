import { Entypo, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { parse } from "flatted";
import React, { useEffect, useState } from "react";

import Perfil from "../pages/perfil/Perfil";
import QRCode from "../pages/qr-code/QRCode";
import Sectors from "../pages/sectors/Sectors";
import UserChip from "./UserChip";

const Tab = createBottomTabNavigator();

export default function Menu(props) {
  const [parsedUser, setParsedUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("userConfig").then((user) => {
      setParsedUser(parse(user));
    });
  }, []);

  const user = props.route.params.idUser;

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            paddingTop: 5,
            paddingBottom: 25,
            height: 70,
          },
        }}
      >
        <Tab.Screen
          name="Setores"
          component={Sectors}
          options={{
            headerRight: () => (
              <UserChip parsedUser={parsedUser} onPress={() => {}} />
            ),
            tabBarLabel: "Setores",
            tabBarIcon: ({ size, color }) => (
              <Entypo name="home" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="QRCode"
          component={QRCode}
          options={{
            tabBarIcon: ({ size, color }) => (
              <Feather name="camera" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Perfil"
          component={Perfil}
          initialParams={{ idUser: user }}
          options={{
            tabBarIcon: ({ size, color }) => (
              <Entypo name="user" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}
