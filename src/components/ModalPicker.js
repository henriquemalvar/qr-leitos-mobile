import React from 'react'
import { Text, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'


const OPTIONS = [
    'Aguardando forragem', 'Aguardando limpeza',
    'Em alta', 'Em higienizacao', 'em forragem',
    'Livre', 'Ocupado'
]

const ModalPicker = (props) => {

    const onPressItem = (option) => {
        props.changeModalVisibility(false);
        props.setOption(option)
    }

    const option = OPTIONS.map((item) => {
        return (
            <TouchableOpacity
                style={styles.option}
                key={item}
                onPress={() => onPressItem(item)}>

                <Text style={styles.text}>
                    {item}
                </Text>

            </TouchableOpacity>
        );
    })

    return (
        <TouchableOpacity
            onPress={() => props.changeModalVisibility(false)}
            style={styles.container}
        >
            <View style={[styles.modal, { width: '95%', height: '53%' }]}>
                <ScrollView>
                    {option}
                </ScrollView>
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 10,
    },
    option: {
        alignItems: 'flex-start',
    },
    text: {
        margin: 20,
        fontSize: 20,
        fontWeight: 'bold',
    }
})

export { ModalPicker }