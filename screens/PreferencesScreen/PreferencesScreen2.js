import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, TextInput, Picker, Alert } from 'react-native';
import { auth, firestore } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import FormButton from '../../components/FormButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { windowWidth } from '../../utils/Dimensions';


const PreferencesScreen2 = ({ navigation }) => {

    //sleep category
    const [sleepLightsOnOff, setSleepLightsOnOff] = useState('No preference');
    const sleepLightsArray = ['Lights off', 'No preference', 'Lights On'];
    const formatSleepLight = (sliderValue) => {
        if (sliderValue == 0) {
            setSleepLightsOnOff('Lights off');
        } else if (sliderValue == 0.5) {
            setSleepLightsOnOff('No preference');
        } else {
            setSleepLightsOnOff('Lights on');
        }
    };

    const sleepLightStringToNum = (string) => {
        if (string == "Lights off") {
            return 0;
        } else if (string == "No preference") {
            return 0.5;
        } else {
            return 1;
        }
    };
    
    //for other preferences 
    const [tidiness, setTidiness] = useState('');
    
    return (
        <View style={styles.container}>
            <Text>Preferences Screen 2</Text>
            <Text style={styles.label}>Do you prefer to sleep with lights on/off?</Text>
                <View style={styles.sliderCont}>
                    <Slider
                        style={{ width: windowWidth * 0.9, height: 40 }}
                        value={sleepLightStringToNum(sleepLightsOnOff)}
                        minimumValue={0}
                        maximumValue={1}
                        onValueChange={(sliderValue) => {formatSleepLight(sliderValue)}}
                        step={0.5}
                    />
                    <Text style={{ fontSize: 18 }}>{sleepLightsOnOff}</Text>
                </View>
            <Button title="GoBack" onPress={() => navigation.goBack()}></Button>
        </View>
    );
}

export default PreferencesScreen2;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 15,
        paddingHorizontal: 18,
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 20,
        fontFamily: 'Lato-Regular',
        marginBottom: 10, //Add margin for spacing
        fontWeight: 'bold'
    },
    sliderCont: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 70,
    },
})