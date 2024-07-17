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


const PreferencesScreen1 = ({ navigation }) => {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    //For Sleep schedule 
    const [sleepTimeStart, setSleepTimeStart] = useState(new Date(1598051730000));
    const [sleepTimeEnd, setSleepTimeEnd] = useState(new Date(1598051730000));
    const [wakeUpTimeStart, setWakeUpTimeStart] = useState(new Date(1598051730000));
    const [wakeUpTimeEnd, setWakeUpTimeEnd] = useState(new Date(1598051730000));
    const [showTimePicker, setShowTimePicker] = useState({});
    const showPicker = (key, mode) => {
        setShowTimePicker({ [key]: true, mode });
    };
    const handleTimeChange = (event, selectedDate, key) => {
        setShowTimePicker({ [key]: false });
        if (selectedDate) {
            if (key === 'sleepTimeStart') setSleepTimeStart(selectedDate);
            if (key === 'sleepTimeEnd') setSleepTimeEnd(selectedDate);
            if (key === 'wakeUpTimeStart') setWakeUpTimeStart(selectedDate);
            if (key === 'wakeUpTimeEnd') setWakeUpTimeEnd(selectedDate);
        }
    };
    //other sleep preference
    const [sleepScheduleFlexibility, setSleepScheduleFlexibility] = useState(0);
    const sleepFlexesArray = ['Not flexible', 'Somewhat flexible', 'Highly flexible'];
    const showSleepFlex = (sliderValue) => {
        return sleepFlexesArray[sliderValue * 2];
    };

    //For loading circle 
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    //Dropdown menu for housing option
    const [open, setOpen] = useState(false);
    const [housing, setHousing] = useState('');
    const [items, setItems] = useState([
        { label: 'Eusoff Hall', value: 'eusoff' },
        { label: 'Temasek Hall', value: 'temasek' },
        { label: 'Kent Ridge Hall', value: 'kentridge' },
        { label: 'Sheares Hall', value: 'sheares' },
        { label: 'King Edward VII Hall', value: 'ke7' },
        { label: 'Raffles Hall', value: 'raffles' },
    ]);

    useEffect(() => {
        const loadDoc = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const profileDoc = await getDoc(doc(firestore, 'users', user.uid));
                    if (profileDoc.exists()) {
                        const profileData = profileDoc.data();
                        setAge(profileData.age);
                        setGender(profileData.gender);
                        setHousing(profileData.housing);

                        const sleepDoc = await getDoc(doc(firestore, 'users', user.uid, 'sleepPreferences', 'sleepSchedule'));
                        if (sleepDoc.exists()) {
                            const sleepData = sleepDoc.data();
                            setSleepTimeStart(sleepData.sleepTimeStart);
                            setSleepTimeEnd(sleepData.sleepTimeEnd);
                            setWakeUpTimeStart(sleepData.wakeUpTimeStart);
                            setWakeUpTimeEnd(sleepData.wakeUpTimeEnd);
                        }
                    } else {
                        //If no profile exists, which is not possible, show alert 
                        Alert.alert("Error", "Profile isn't completed yet!");
                    }
                } catch (error) {
                    console.error('Failed to load profile', error);
                } finally {
                    setLoading(false);
                }
            }

        };

        loadDoc();

    }, [auth.currentUser]);

    // const savePreferences = async() => {
    //     if (!age || !gender || !housing) {
    //         Alert.alert('Error', 'Please fill in all required fields');
    //         return;
    //     }
    //     if (age > 122) {
    //         Alert.alert('Error', 'Invalid Age');
    //         return;
    //     }
    //     const user = auth.currentUser;
    //     if (user) {
    //         setSaving(true);
    //         try {
    //             await updateDoc(doc(firestore, 'users', user.uid), {
    //                 age, 
    //                 gender, 
    //                 housing,  
    //             });

    //             // await updateDoc(doc(firestore, 'users', user.uid, 'SleepPreferences', 'sleepSchedule'), {
    //             //     sleepTimeStart,
    //             //     sleepTimeEnd,
    //             //     wakeUpTimeStart,
    //             //     wakeUpTimeEnd
    //             // });

    //             Alert.alert("Success", "Preferences updated successfully!");
    //             navigation.navigate('Profile');
    //         } catch (error) {
    //             console.error("Failed to update preferences: ", error);
    //             Alert.alert("Error", "Failed to update preferences. ");
    //         } finally {
    //             setSaving(false);
    //         }
    //     }
    // };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Your Age* : </Text>
            <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType='numeric'
                returnKeyType='done'
            />
            <Text style={styles.label}>Your Gender* : </Text>
            <SegmentedButtons
                style={styles.segButt}
                value={gender}
                onValueChange={setGender}
                option
                buttons={[
                    { value: 'Male', label: 'Male', style: gender === 'Male' ? styles.checkedButt : styles.uncheckedButt },
                    { value: 'Female', label: 'Female', style: gender === 'Female' ? styles.checkedButt : styles.uncheckedButt },
                ]}
            />
            <Text style={styles.label}>Your Housing* : </Text>
            <DropDownPicker style={styles.dropdown}
                placeholder='Select a housing option'
                open={open}
                value={housing}
                items={items}
                setOpen={setOpen}
                setValue={setHousing}
                setItems={setItems}
            />

            <Text style={styles.label}>Your Preferred Sleep Schedule :</Text>
            <View style={styles.sleepContainer}>
                <Text>Your Sleep Time :</Text>
                <DateTimePicker
                    value={sleepTimeStart}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, time) => handleTimeChange(event, time, 'sleepTimeStart')}
                />
                <Text style={styles.toText}> to </Text>
                <DateTimePicker
                    value={sleepTimeEnd}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, time) => handleTimeChange(event, time, 'sleepTimeEnd')}
                />
            </View>
            <View style={styles.sleepContainer}>
                <Text >Your Wake Time :</Text>
                <DateTimePicker
                    value={wakeUpTimeStart}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, time) => handleTimeChange(event, time, 'wakeUpTimeStart')}
                />
                <Text style={styles.toText}> to </Text>
                <DateTimePicker
                    value={wakeUpTimeEnd}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, time) => handleTimeChange(event, time, 'wakeUpTimeEnd')}
                />
            </View>
            <Text style={styles.label}>How flexible are you with your sleep schedule?</Text>
            <View style={styles.sliderCont}>
                <Slider
                    style={{ width: windowWidth * 0.9, height: 40 }}
                    value={sleepScheduleFlexibility}
                    minimumValue={0}
                    maximumValue={1}
                    onValueChange={setSleepScheduleFlexibility}
                    step={0.5}
                />
                <Text style={{ fontSize: 18 }}>{showSleepFlex(sleepScheduleFlexibility)}</Text>
            </View>
            {saving && (
                <ActivityIndicator size="small" color="#0000ff" style={styles.savingIndicator} />
            )}
            <View style={styles.buttContainer}>
                <FormButton buttonTitle="Next" onPress={() => navigation.navigate('Preferences 2')} />
            </View>
            {/* <FormButton buttonTitle="Save Preferences" onPress={savePreferences} /> */}
        </View>
    );
}

export default PreferencesScreen1;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 15,
        paddingHorizontal: 18,
        justifyContent: 'space-between',
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
        paddingBottom: 70,
    },
})
