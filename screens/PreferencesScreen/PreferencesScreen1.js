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
import { PreferencesContext } from '../../contexts/PreferencesContext';
import { useNavigation } from '@react-navigation/native';


const PreferencesScreen1 = ({ navigation }) => {
    const { tempPreferences, updateTempPreferences } = useContext(PreferencesContext);

    const handleChange = (name, value) => {
        updateTempPreferences({ [name]: value });
    };
    
    //sleep flexibility
    const sleepFlexesArray = ['Not flexible', 'Somewhat flexible', 'Highly flexible'];
    const showSleepFlex = (sliderValue) => {
        return sleepFlexesArray[sliderValue * 2];
    };

    //For loading circle 
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    //Dropdown menu for housing option
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Eusoff Hall', value: 'eusoff' },
        { label: 'Temasek Hall', value: 'temasek' },
        { label: 'Kent Ridge Hall', value: 'kentridge' },
        { label: 'Sheares Hall', value: 'sheares' },
        { label: 'King Edward VII Hall', value: 'ke7' },
        { label: 'Raffles Hall', value: 'raffles' },
    ]);
    
    // if (loading) {
    //     return (
    //         <View style={styles.loaderContainer}>
    //             <ActivityIndicator size="large" color="#0000ff" />
    //         </View>
    //     );
    // }


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Your Age* : </Text>
            <TextInput
                style={styles.input}
                value={tempPreferences.age}
                onChangeText={(value) => handleChange('age', value)}
                keyboardType='numeric'
                returnKeyType='done'
            />
            <Text style={styles.label}>Your Gender* : </Text>
            <SegmentedButtons
                style={styles.segButt}
                value={tempPreferences.gender}
                onValueChange={(value) => handleChange('gender', value)}
                option
                buttons={[
                    { value: 'Male', label: 'Male', style: tempPreferences.gender === 'Male' ? styles.checkedButt : styles.uncheckedButt },
                    { value: 'Female', label: 'Female', style: tempPreferences.gender === 'Female' ? styles.checkedButt : styles.uncheckedButt },
                ]}
            />
            <Text style={styles.label}>Your Housing* : </Text>
            <DropDownPicker style={styles.dropdown}
                placeholder='Select a housing option'
                open={open}
                value={tempPreferences.housing}
                items={items}
                setOpen={setOpen}
                setValue={(value) => handleChange('housing', value)}
                setItems={setItems}
            />

            <Text style={styles.label}>Your Preferred Sleep Schedule :</Text>
            <View style={styles.sleepContainer}>
                <Text>Your Sleep Time :</Text>
                <DateTimePicker
                    value={tempPreferences.sleepTimeStart}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(value) => handleChange('sleepTimeStart', value)}
                />
                <Text style={styles.toText}> to </Text>
                <DateTimePicker
                    value={tempPreferences.sleepTimeEnd}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(value) => handleChange('sleepTimeEnd', value)}
                />
            </View>
            <View style={styles.sleepContainer}>
                <Text >Your Wake Time :</Text>
                <DateTimePicker
                    value={tempPreferences.wakeUpTimeStart}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(value) => handleChange('wakeUpTimeStart', value)}
                />
                <Text style={styles.toText}> to </Text>
                <DateTimePicker
                    value={tempPreferences.wakeUpTimeEnd}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(value) => handleChange('wakeUpTimeEnd', value)}
                />
            </View>
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
