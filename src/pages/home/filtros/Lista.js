import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import { parse, stringify } from 'flatted';

import styles from './style'

export default function Lista({ route, navigation }) {

    const { leitos: beds, cor } = route.params

    return (
        <View style={[styles.containerLeitos]}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={parse(beds)}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("Leito", {
                                    leito: stringify(item),
                                })
                            }}>
                            <View style={styles.leito}>
                                <FontAwesome
                                    name="circle"
                                    color={cor} style={styles.livre} />
                                <Text style={styles.title}>
                                    {item.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}
