import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { parse } from "flatted";
import { Chip } from "react-native-paper";
import { permissionsIcons } from "../shared/util/constants";

import Homepage from "../pages/home/Homepage";
import QRCode from "../pages/qr-code/QRCode";
import Perfil from "../pages/perfil/Perfil";
import Toast from "react-native-toast-message";

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
          name="Leitos"
          component={Homepage}
          options={{
            headerRight: () => (
              <Chip
                style={{
                  alignSelf: "flex-end",
                  marginRight: 10,
                  marginTop: 10,
                }}
                icon={permissionsIcons[parsedUser?.permission]}
                mode="outlined"
                onPress={() => {
                  Toast.show({
                    type: "info",
                    text1: `Permissão: ${parsedUser?.permission}`,
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 30,
                    bottomOffset: 40,
                  });
                }}
              >
                {parsedUser?.name}
              </Chip>
            ),
            tabBarLabel: "Leitos",
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
