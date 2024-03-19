import UserChip from "@components/UserChip";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProfilePage from "@pages/profile/ProfilePage";
import QRCode from "@pages/qr-code/QRCode";
import SectorListPage from "@pages/sectors/SectorListPage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { theme } from "@styles/theme";
import { parse } from "flatted";
import { useEffect, useState } from "react";

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
            borderTopWidth: 1,
            borderTopColor: theme.colors.disabled,
          },
        }}
      >
        <Tab.Screen
          name="Setores"
          component={SectorListPage}
          options={{
            headerRight: () => (
              <UserChip parsedUser={parsedUser} />
            ),
            tabBarLabel: "Setores",
            tabBarActiveTintColor: theme.colors.primary,
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="QRCode"
          component={QRCode}
          options={{
            tabBarActiveTintColor: theme.colors.primary,
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons name="qrcode" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Perfil"
          component={ProfilePage}
          initialParams={{ idUser: user }}
          options={{
            tabBarActiveTintColor: theme.colors.primary,

            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="account"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}