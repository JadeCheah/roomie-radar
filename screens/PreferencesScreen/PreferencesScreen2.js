import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, TextInput, Picker, Alert } from 'react-native';
import { auth, firestore } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import FormButton from '../../components/FormButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { windowWidth } from '../../utils/Dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PreferencesContext } from '../../contexts/PreferencesContext';


const PreferencesScreen2 = ({ navigation }) => {
    
    const {tempPreferences, updateTempPreferences } = useContext(PreferencesContext);
    const handleChange = (name, value) => {
        updateTempPreferences({ [name]: value });
    };

    //sleep category
    const formatSetSleepLight = (sliderValue) => {
        if (sliderValue === 0) {
            handleChange(sleepLightsOnOff, 'Lights off');
        } else if (sliderValue === 0.5) {
            handleChange(sleepLightsOnOff, 'No preference');
        } else {
            handleChange(sleepLightsOnOff, 'Lights on');
        }
    };
    const sleepLightStringToNum = (string) => {
        if (string === "Lights off") {
            return 0;
        } else if (string === "No preference") {
            return 0.5;
        } else {
            return 1;
        }
    };

    //for other preferences 
    const [tidiness, setTidiness] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Do you prefer to sleep with lights on/off?</Text>
            <View style={styles.lightCont}>
                {tempPreferences.sleepLightsOnOff === "Lights off" && <MaterialCommunityIcons name='lightbulb-off' size='50' 
                    style={{ position: 'absolute', left: 0, top: '50%', transform: [{ translateY: -50 }] }}/>}
                {tempPreferences.sleepLightsOnOff === "No preference" && <MaterialCommunityIcons name='lightbulb-multiple-outline' size='50' 
                    style={{ color: '#ada693', position: 'absolute', top: '50%', left: '55%', transform: [{ translateX: -50 }, { translateY: -50 }] }} />}
                {tempPreferences.sleepLightsOnOff === "Lights on" && <MaterialCommunityIcons name='lightbulb-on' size='50'
                    style={{ color: '#faba0a', position: 'absolute', right: 0, top: '50%', transform: [{ translateY: -50 }]}} />}
            </View>
            <View style={styles.sliderCont}>
                <Slider
                    style={{ width: windowWidth * 0.9, height: 40 }}
                    value={sleepLightStringToNum(tempPreferences.sleepLightsOnOff)}
                    minimumValue={0}
                    maximumValue={1}
                    onValueChange={(sliderValue) => { formatSleepLight(sliderValue) }}
                    step={0.5}
                />
                <Text style={{ fontSize: 18 }}>{tempPreferences.sleepLightsOnOff}</Text>
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
        padding: 7,
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
    lightCont: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})