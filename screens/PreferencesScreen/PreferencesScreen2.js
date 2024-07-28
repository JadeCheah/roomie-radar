import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, TextInput, Picker, Alert, ImageBackground } from 'react-native';
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

    const { tempPreferences, updateTempPreferences, savePreferences, saving } = useContext(PreferencesContext);
    const handleChange = (name, value) => {
        updateTempPreferences({ [name]: value });
    };

    //sleep category
    const handleTimeChange = (name, event, date) => {
        if (event.type === 'set' && date) {
            console.log('Raw date:', date);
            if (date instanceof Date && !isNaN(date)) {
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                console.log(`Formatted time: ${hours}:${minutes}`);
                updateTempPreferences({ [name]: `${hours}:${minutes}` });
            } else {
                console.error('Invalid date object: ', date);
            }
        }
    };

    const parseTime = (timeStr) => {
        if (typeof timeStr !== 'string' || !timeStr.includes(':')) {
            console.error('Invalid time string:', timeStr);
            return new Date(); //return current date as fallback
        }
        const [hours, minutes] = timeStr.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) {
            console.error('Invalid time components:', hours, minutes);
            return new Date();
        }
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    };

    //sleep flexibility
    const sleepFlexesArray = ['Not flexible', 'Somewhat flexible', 'Highly flexible'];
    const showSleepFlex = (sliderValue) => {
        return sleepFlexesArray[Math.round(sliderValue * 2)];
    };

    const formatSetSleepLight = (sliderValue) => {
        if (sliderValue === 0) {
            handleChange('sleepLightsOnOff', 'Lights off');
        } else if (sliderValue === 0.5) {
            handleChange('sleepLightsOnOff', 'No preference');
        } else {
            handleChange('sleepLightsOnOff', 'Lights on');
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
    // const [tidiness, setTidiness] = useState('');

    return (
        <ImageBackground
            source={require('../../assets/orange-gradient.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.backButt}>
                        <Text style={{ color: "white", fontSize: 15, fontFamily: 'Lato-Regular', fontWeight: 'bold' }} onPress={() => { navigation.goBack() }}>Go Back</Text>
                    </View>
                    <View style={styles.sleepContainer}>
                        <Text style={styles.label}>Your Preferred Sleep Schedule :</Text>
                        <View style={styles.container1}>
                            <DateTimePicker
                                value={parseTime(tempPreferences.sleepTimeStart)}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(event, date) => handleTimeChange('sleepTimeStart', event, date)}
                            />
                            <Text style={styles.toText}> to </Text>
                            <DateTimePicker
                                value={parseTime(tempPreferences.sleepTimeEnd)}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(event, date) => handleTimeChange('sleepTimeEnd', event, date)}
                            />
                        </View>
                    </View>
                    <View style={styles.cont}>
                        <Text style={styles.label}>How flexible are you with your sleep schedule?</Text>
                        <View style={styles.sliderCont}>
                            <Slider
                                style={{ width: windowWidth * 0.9, height: 40 }}
                                value={tempPreferences.sleepScheduleFlexibility}
                                minimumValue={0}
                                maximumValue={1}
                                onValueChange={(value) => handleChange('sleepScheduleFlexibility', value)}
                                step={0.5}
                            />
                            <Text style={{ fontSize: 18 }}>{showSleepFlex(tempPreferences.sleepScheduleFlexibility)}</Text>
                        </View>
                    </View>
                    <View style={styles.cont}>
                        <Text style={styles.label}>Do you prefer to sleep with lights on/off?</Text>
                        <View style={styles.lightCont}>
                            {tempPreferences.sleepLightsOnOff === "Lights off" && <MaterialCommunityIcons name='lightbulb-off' size='50' />}
                            {tempPreferences.sleepLightsOnOff === "No preference" && <MaterialCommunityIcons name='lightbulb-multiple-outline' size='50'
                                style={{ color: '#ada693' }} />}
                            {tempPreferences.sleepLightsOnOff === "Lights on" && <MaterialCommunityIcons name='lightbulb-on' size='50'
                                style={{ color: '#faba0a' }} />}
                        </View>
                        <View style={styles.sliderCont}>
                            <Slider
                                style={{ width: windowWidth * 0.9, height: 40 }}
                                value={sleepLightStringToNum(tempPreferences.sleepLightsOnOff)}
                                minimumValue={0}
                                maximumValue={1}
                                onValueChange={(sliderValue) => { formatSetSleepLight(sliderValue) }}
                                step={0.5}
                            />
                            <Text style={{ fontSize: 18 }}>{tempPreferences.sleepLightsOnOff}</Text>
                        </View>
                    </View>
                    {saving && <ActivityIndicator size="small" color="#0000ff" />}
                    <FormButton buttonTitle="Save Preferences" onPress={savePreferences} />
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

export default PreferencesScreen2;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        flexGrow: 1,
        paddingVertical: 5,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    label: {
        paddingVertical: 8,
        fontSize: 18,
        fontFamily: 'Lato-Regular',
        marginBottom: 10, // Add margin for spacing
        fontWeight: 'bold',
        color: '#333', // Darker color for better readability
    },
    sliderCont: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    lightCont: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    sleepContainer: {
        alignItems: 'center',
        marginVertical: '3%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Elevation for Android
    },
    toText: {
        paddingTop: '2%',
        marginLeft: 10,
        marginRight: 0,
        fontSize: 16,
    },
    container1: {
        flexDirection: 'row',
    },
    cont: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: '3%',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Elevation for Android
    },
    backButt: {
        backgroundColor: '#2e64e5',
        padding: 5,
        marginRight: '80%',
        borderRadius: 8, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Elevation for Android
    }
})