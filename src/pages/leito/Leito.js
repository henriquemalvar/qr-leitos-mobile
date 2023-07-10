import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { ModalPicker } from "../../components/ModalPicker";

import database from '../../database/database'
import styles from '../leito/style'

export default function Leito({ route, navigation }) {

    const { idid, id, endereco, estado, ultimaMod } = route.params
    const estadoShow = estado.path.substr(14, estado.path.length)[0].toUpperCase() + estado.path.substr(14, estado.path.length).substr(1);

    const [statusl, setStatusl] = useState(estadoShow)

    const [isModalVisble, setisModalVisible] = useState(false)
    const changeModalVisibility = (bool) => {
        setisModalVisible(bool)
    }

    const setOption = (option) => {
        setStatusl(option.toLowerCase())
    }

    function formataData(data) {
        let dia = data.getDate().toString().padStart(2, '0'),
            mes = (data.getMonth() + 1).toString().padStart(2, '0'),
            ano = data.getFullYear(),
            hora = data.getHours().toString().padStart(2, '0'),
            minuto = data.getMinutes().toString().padStart(2, '0');
        return dia + "/" + mes + "/" + ano + ' - ' + hora + ':' + minuto;
    }

    async function changeStatus() {
        database.collection('Leito').doc(idid).update({
            status: database.collection('estadoDoLeito').doc(statusl),
            ultimaMod: new Date()
        })
        // database.collection('modificaStatus').add({
        //     IdLeito: refLeito,
        //     data_hora: new Date(),
        //     modificacao: statusl
        // })
    }

    const updateLeito = () => {
        changeStatus().then(() => {
          navigation.navigate('Menu', idid)
        })
    }

    return (
        <View style={styles.containerStatus}>

            <View style={styles.title}>
                <Text style={styles.titleFont}>
                    {id}
                </Text>
            </View>

            <View style={styles.containerDesc}>
                <View style={{ paddingBottom: 10 }}>
                    <Text style={styles.detailsFont}>Endereço </Text>
                    <Text style={styles.detailsEnd}>{endereco.map((field) => {
                      return(
                        <Text key={field}>{field} </Text>
                      );
                    })}</Text>
                </View>
            </View>

            <View style={styles.containerDesc}>
                <View style={{ paddingBottom: 10 }}>
                    <Text style={styles.detailsFont}>Ultima Modificação </Text>
                    <Text style={styles.detailsEnd}>{formataData(new Date(ultimaMod))} </Text>
                </View>
            </View>

            <View style={[{ backgroundColor: '#E7E6E1', width: '97%', borderRadius: 15, paddingBottom: 15 }]}>
                <View style={styles.containerDesc} >
                    <Text style={styles.detailsFont}>Estado do Leito </Text>
                </View>

                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        onPress={() => changeModalVisibility(true)}>
                        <Text style={[styles.detailsEnd]}>{statusl}</Text>
                    </TouchableOpacity>
                    <Modal
                        transparent={true}
                        animationType='slide'
                        visible={isModalVisble}
                        nRequestClose={() => changeModalVisibility(false)}
                    >
                        <ModalPicker
                            changeModalVisibility={changeModalVisibility}
                            setOption={setOption}
                        />

                    </Modal>
                </View>
            </View>

            <TouchableOpacity style={styles.buttonLabel}
                onPress={() => {
                    updateLeito();
                  }
                }
            >
                <View>
                    <Text style={styles.buttonText}>
                        Salvar
                    </Text>
                </View>
            </TouchableOpacity>

        </View >

    );

}