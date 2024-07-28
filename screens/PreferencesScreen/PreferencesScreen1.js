import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, TextInput, Picker, Alert, TouchableOpacity, ImageBackground } from 'react-native';
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
            <ImageBackground
                source={require('../../assets/orange-gradient.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground
            source={require('../../assets/orange-gradient.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <View style={styles.box}>
                    <Text style={styles.label}>Your Age* : </Text>
                    <TextInput
                        style={styles.input}
                        value={tempPreferences.age}
                        onChangeText={(value) => handleChange('age', value)}
                        keyboardType='numeric'
                        returnKeyType='done'
                    />
                </View>
                <View style={styles.box}>
                    <Text style={styles.label}>Year of Study* : </Text>
                    <SegmentedButtons
                        style={styles.segButt}
                        value={tempPreferences.yearOfStudy}
                        onValueChange={(value) => handleChange('yearOfStudy', value)}
                        option
                        buttons={[
                            { value: '1', label: '1', style: tempPreferences.yearOfStudy === '1' ? styles.checkedButt : styles.uncheckedButt },
                            { value: '2', label: '2', style: tempPreferences.yearOfStudy === '2' ? styles.checkedButt : styles.uncheckedButt },
                            { value: '3', label: '3', style: tempPreferences.yearOfStudy === '3' ? styles.checkedButt : styles.uncheckedButt },
                            { value: '4', label: '4', style: tempPreferences.yearOfStudy === '4' ? styles.checkedButt : styles.uncheckedButt },
                        ]}
                    />
                </View>
                <View style={styles.box}>
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
                </View>
                <View style={styles.box}>
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
                </View>
                <View style={styles.buttContainer}>
                    <FormButton buttonTitle="Next" onPress={() => navigation.navigate('Preferences 2')} />
                </View>
            </View>
        </ImageBackground>
    );
}

export default PreferencesScreen1;

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flexGrow: 0.8,
        paddingVertical: 20,
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
        padding: 0,
        margin: 0,
        // Shadow properties for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        // Elevation property for Android
        elevation: 10,
    },
    nextButton: {
        marginRight: 10,
    },
    box: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 14,
        // Shadow properties for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        // Elevation property for Android
        elevation: 10,
    }
})