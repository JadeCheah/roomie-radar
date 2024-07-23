import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, TextInput, Picker, Alert, TouchableOpacity } from 'react-native';
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

const CustomNextButton = ({ navigation }) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Preferences 2')} style={styles.nextButton}>
            <Text style={{ color: '#007AFF', fontSize: 18 }}>Sleep {`>`}</Text>
        </TouchableOpacity>
    );
};

const PreferencesScreen1 = ({ navigation }) => {
    const { tempPreferences, updateTempPreferences, loading, saving } = useContext(PreferencesContext);
    //for navigation
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <CustomNextButton navigation={navigation} />,
        });
    }, [navigation]);

    const handleChange = (name, value) => {
        updateTempPreferences({ [name]: value });
    };
    //housing stuff
    const [housingOption, setHousingOption] = useState(tempPreferences.housing);

    useEffect(() => {
        setHousingOption(tempPreferences.housing);
    }, [tempPreferences.housing]);

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

    console.log("Loading state:", loading); //debuggging line 
    
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
                value={housingOption}
                items={items}
                setOpen={setOpen}
                setValue={(callback) => { 
                    const value = callback(housingOption);
                    setHousingOption(value); 
                    handleChange('housing', value);
                }}
                setItems={setItems}
            />
            <View style={styles.buttContainer}>
                <FormButton buttonTitle="Next" onPress={() => navigation.navigate('Preferences 2')} />
            </View>
        </View>
    );
}

export default PreferencesScreen1;

const styles = StyleSheet.create({
    container: {
        flexGrow: 0.8,
        paddingVertical: 50,
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
    },
    nextButton: {
        marginRight: 10,
    }
})
