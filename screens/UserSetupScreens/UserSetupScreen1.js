import React, { useContext, useState } from 'react';
import { Button, View, Text, TextInput, Alert, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { auth, firestore } from '../../firebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from 'firebase/auth';
import FormButton from '../../components/FormButton';
import { SegmentedButtons } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { UserSetupContext } from '../../contexts/UserSetupContext';

const UserSetupScreen1 = ({ navigation }) => {

    const { tempDetails, updateTempDetails, handleCompleteProfile } = useContext(UserSetupContext);
    const handleChange = (name, value) => {
        updateTempDetails({ [name]: value });
    };

    //Dropdown menu for housing option
    const [open, setOpen] = useState(false);
    const [housingOption, setHousingOption] = useState(tempDetails.housing);
    const [items, setItems] = useState([
        { label: 'Eusoff Hall', value: 'eusoff' },
        { label: 'Temasek Hall', value: 'temasek' },
        { label: 'Kent Ridge Hall', value: 'kentridge' },
        { label: 'Sheares Hall', value: 'sheares' },
        { label: 'King Edward VII Hall', value: 'ke7' },
        { label: 'Raffles Hall', value: 'raffles' },
    ]);

    const handleCompletion = async () => {
        try {
            handleCompleteProfile();
        } catch (error) {
            console.error('Error completing profile: ', error);
            Alert.alert('Error', 'There was an error completing your profile. Please try again.');
        } finally {
            navigation.navigate("TabStack");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.inputTitle}>Username *</Text>
            <TextInput
                placeholder='Please key in your username'
                value={tempDetails.userName}
                onChangeText={(value) => handleChange('userName', value)}
                style={styles.input}
                returnKeyType='done'
            />
            <Text style={styles.inputTitle}>User Introduction *</Text>
            <TextInput
                placeholder='Tell us more about you!'
                value={tempDetails.userIntro}
                onChangeText={(value) => handleChange('userIntro', value)}
                style={styles.input}
                returnKeyType='done'
            />
            <Text style={styles.inputTitle}>Age *</Text>
            <TextInput
                placeholder='Please key in your age'
                value={tempDetails.age}
                onChangeText={(value) => handleChange('age', value)}
                keyboardType='numeric'
                style={styles.input}
                returnKeyType='done'
            />

            <Text style={styles.inputTitle}>Gender *</Text>
            <SegmentedButtons
                style={styles.segButt}
                value={tempDetails.gender}
                onValueChange={(value) => handleChange('gender', value)}
                option
                buttons={[
                    { value: 'Male', label: 'Male', style: tempDetails.gender === 'Male' ? styles.checkedButt : styles.uncheckedButt },
                    { value: 'Female', label: 'Female', style: tempDetails.gender === 'Female' ? styles.checkedButt : styles.uncheckedButt },
                ]}
            />

            {/* below roommate preferences, not yet done, should include dropdown, slidebar, etc  */}
            <Text style={styles.inputTitle}>Housing *</Text>
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

            {/* <Text style={styles.caption}>More preferences option to come</Text> */}

            {/* <Button title="Complete Profile" onPress={handleCompleteProfile}/> */}
            {/* <FormButton buttonTitle="Complete Profile" onPress={handleCompletion} /> */}
            <FormButton buttonTitle="Next" onPress={() => {navigation.navigate('Setup 2')}} />
        </View>
    );
}

export default UserSetupScreen1;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 18,
        justifyContent: 'space-between',
    },
    inputTitle: {
        paddingTop: 10,
        paddingLeft: 5,
        fontSize: 15,
        fontFamily: 'AlNile-Bold',
    },
    input: {
        width: '100%',
        padding: '5%',
        marginVertical: '0.25%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        backgroundColor: '#fff'
    },
    segButt: {
        marginVertical: 7,
    },
    checkedButt: {
        backgroundColor: '#bdd3fc',
    },
    uncheckedButt: {
        backgroundColor: '#fff',
    },
    dropdown: {
        marginVertical: 7,
        borderRadius: 20,
    },
    caption: {
        marginVertical: 100,
        alignSelf: 'center',
    },
});

