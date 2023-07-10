import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import Homepage from '../pages/home/Homepage';
import QRCode from '../pages/qr-code/QRCode';
import Perfil from '../pages/perfil/Perfil';

import { Entypo, Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function Menu(props) {

    const user = props.route.params.idUser;

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    paddingTop: 5,
                    paddingBottom: 25,
                    height: 70,
                },
            }
            }>
            <Tab.Screen
                name="Leitos"
                component={Homepage}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Entypo name="home" size={size} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="QRCode"
                component={QRCode}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Feather name="camera" size={size} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="Perfil"
                component={Perfil}
                initialParams={{ idUser: user }}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Entypo name="user" size={size} color={color} />
                    )
                }}
            />
        </Tab.Navigator>
    );
}