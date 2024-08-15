import React, { useContext, useEffect, useState } from 'react';
import { Button, View, Text, TextInput, Alert, StyleSheet, ScrollView, SafeAreaView, Picker } from 'react-native';
import { auth, firestore } from '../../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from 'firebase/auth';
import FormButton from '../../components/FormButton';
import { ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { UserSetupContext } from '../../contexts/UserSetupContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { windowWidth } from '../../utils/Dimensions';
import { CommonActions } from '@react-navigation/native';


const UserSetupScreen2 = ({ navigation }) => {

    const { tempDetails, updateTempDetails, handleCompleteProfile } = useContext(UserSetupContext);
    
    const handleTimeChange = (name, event, date) => {
        if (event.type === 'set' && date) {
            // console.log('Raw date:', date);
            if (date instanceof Date && !isNaN(date)) {
                const hours = date.getHours().toString().padStart(2,'0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                // console.log(`Formatted time: ${hours}:${minutes}`);
                updateTempDetails({ [name]: `${hours}:${minutes}`});
            } else {
                console.error('Invalid date object: ', date);
            }
        }
    };

    const parseTime = (timeStr) => {
        if (typeof timeStr !== 'string' || !timeStr.includes(':')) {
            console.error('Invalid time string:' , timeStr);
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

    const handleChange = (name, value) => {
        updateTempDetails({ [name]: value });
    };

    //sleep flexibility
    const sleepFlexesArray = ['Not flexible', 'Somewhat flexible', 'Highly flexible'];
    const showSleepFlex = (sliderValue) => {
        return sleepFlexesArray[Math.round(sliderValue * 2)];
    };
    //sleep lights on/off
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

    const handleCompletion = async () => {
        try {
            const result = await handleCompleteProfile();
            if (result !== null) {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'TabStack' }],
                    })
                );
            }
        } catch (error) {
            console.error('Error completing profile: ', error);
            Alert.alert('Error', 'There was an error completing your profile. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Text style={styles.inputTitle}>What is your preferred sleep schedule ?</Text>
                <View style={styles.sleepContainer}>
                    <Text>Your Sleep Time :</Text>
                    <DateTimePicker
                        value={parseTime(tempDetails.sleepTimeStart)}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, date) => handleTimeChange('sleepTimeStart', event, date)}
                    />
                    <Text style={styles.toText}> to </Text>
                    <DateTimePicker
                        value={parseTime(tempDetails.sleepTimeEnd)}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, date) => handleTimeChange('sleepTimeEnd', event, date)}
                    />
                </View>
                {/* <View style={styles.sleepContainer}>
                    <Text >Your Wake Time :</Text>
                    <DateTimePicker
                        value={parseTime(tempDetails.wakeUpTimeStart)}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, date) => handleTimeChange('wakeUpTimeStart', event, date)}
                    />
                    <Text style={styles.toText}> to </Text>
                    <DateTimePicker
                        value={parseTime(tempDetails.wakeUpTimeEnd)}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, date) => handleTimeChange('wakeUpTimeEnd', event, date)}
                    />
                </View> */}
            </View>
            <View style={styles.subContainer}>
                <Text style={styles.inputTitle}>How flexible are you with your sleep schedule?</Text>
                <View style={styles.sliderCont}>
                    <Slider
                        style={{ width: windowWidth * 0.9, height: 40 }}
                        value={tempDetails.sleepScheduleFlexibility}
                        minimumValue={0}
                        maximumValue={1}
                        onValueChange={(value) => handleChange('sleepScheduleFlexibility', value)}
                        step={0.5}
                    />
                    <Text style={{ fontSize: 18 }}>{showSleepFlex(tempDetails.sleepScheduleFlexibility)}</Text>
                </View>
            </View>
            <View style={styles.subContainer2}>
                <Text style={styles.inputTitle}>Do you prefer to sleep with lights on/off?</Text>
                <View style={styles.lightCont}>
                    {tempDetails.sleepLightsOnOff === "Lights off" && <MaterialCommunityIcons name='lightbulb-off' size='50' />}
                    {tempDetails.sleepLightsOnOff === "No preference" && <MaterialCommunityIcons name='lightbulb-multiple-outline' size='50'
                        style={{ color: '#ada693' }} />}
                    {tempDetails.sleepLightsOnOff === "Lights on" && <MaterialCommunityIcons name='lightbulb-on' size='50'
                        style={{ color: '#faba0a' }} />}
                </View>
                <View style={styles.sliderCont}>
                    <Slider
                        style={{ width: windowWidth * 0.9, height: 40 }}
                        value={sleepLightStringToNum(tempDetails.sleepLightsOnOff)}
                        minimumValue={0}
                        maximumValue={1}
                        onValueChange={(sliderValue) => formatSetSleepLight(sliderValue)}
                        step={0.5}
                    />
                    <Text style={{ fontSize: 18 }}>{tempDetails.sleepLightsOnOff}</Text>
                </View>
            </View>

            <FormButton buttonTitle="Complete Profile" onPress={handleCompletion} />
        </View>
    );
}

export default UserSetupScreen2;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 18,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    subContainer: {
        paddingVertical: 20,
        flexGrow: 1,
        justifyContent: 'space-between'
    },
    subContainer2: {
        paddingVertical: 20,
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    inputTitle: {
        fontFamily: 'AlNile-Bold',
        fontSize: 18,
        textAlign: 'center',
    },
    text: {
        fontSize: 20,
    },
    label: {
        fontSize: 20,
        fontFamily: 'Lato-Regular',
        marginBottom: 10, //Add margin for spacing
        fontWeight: 'bold'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    segButt: {
        marginBottom: 20,
    },
    checkedButt: {
        backgroundColor: '#bdd3fc',
    },
    uncheckedButt: {
        backgroundColor: '#fff',
    },
    dropdown: {
        marginBottom: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    savingIndicator: {
        marginTop: 10,
    },
    sleepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    toText: {
        marginLeft: 10,
    },
    buttContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
    },
    sliderCont: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    lightCont: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});