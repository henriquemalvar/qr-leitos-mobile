import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import styles from './style'
import database from '../../database/database';

export default function QRCode({ navigation }) {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [codigo, setCodigo] = useState('');
    const [leito, setLeito] = useState(null);

    async function searchLeito(code) {
      const leitoRef = database.collection('Leito').doc(code);
      const leitoDoc = await leitoRef.get();
      const leitoData = leitoDoc.data();
      setLeito(leitoData);
    }

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        searchLeito(data).then(() => {
          setCodigo(data);
        });
    };

    if (hasPermission === null) {
        return <Text style={styles.text}>Aguardando permissão de acesso a câmera!</Text>;
    }
    if (hasPermission === false) {
        return <Text style={styles.text}>Sem acesso a câmera</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.scanner}
            />
            <View>
                <Text style={styles.text}>{codigo}</Text>
            </View>
            {scanned && <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate('Leito',
                        {
                            idid: codigo,
                            id: leito.codigo,
                            endereco: leito.endereco,
                            estado: leito.status,
                            ultimaMod: new Date(leito.ultimaMod.toDate())
                        }
                    )
                    setScanned(false)
                    setCodigo('');
                }}
            >
                <Text style={styles.textButton}>ACESSAR LEITO</Text>
            </TouchableOpacity>}
        </View>
    );
}