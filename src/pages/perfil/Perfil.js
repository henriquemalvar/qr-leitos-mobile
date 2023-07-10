import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'

import database from '../../database/database';

import styles from './styles'

export default function Perfil({ navigation, route }) {

    const userId = route.params.idUser;
    const [user, setUser] = useState('');

    useEffect(() => {
        async function userData() {
            const userRef = database.collection('usersConfig').doc(userId);
            const userDoc = await userRef.get();
            const user = userDoc.data();
            setUser(user)
        }
        userData();
    }, []);

    return (
        <View style={styles.containerPerfil}>
            <View style={styles.head}>
                <View>
                    <FontAwesome
                        name='circle' style={styles.icon} />
                </View>
                <View>
                    <Text style={styles.user}>
                        {user.nome}
                    </Text>
                </View>
            </View>
            <View style={styles.containerCargo}>
                <Text style={styles.cargo}>
                    Cargo
                </Text>
                <Text style={styles.cargo2}>
                    {user.permissao}
                </Text>
            </View>
            <View style={styles.containerCargo}>
                <Text style={styles.cargo}>
                    Email cadastrado:
                </Text>
                <Text style={styles.cargo2}>
                    {user.email}
                </Text>
            </View>
            <View>
                <TouchableOpacity style={styles.logout}
                    onPress={() => { navigation.navigate("Login") }}>
                    <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>
                        Sair
                    </Text>
                </TouchableOpacity>
            </View>
        </View >
    );
}