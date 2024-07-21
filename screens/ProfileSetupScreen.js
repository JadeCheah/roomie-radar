import React, { useState } from 'react';
import { Button, View, Text, TextInput, Alert, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from 'firebase/auth';
import FormButton from '../components/FormButton';
import { SegmentedButtons } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

const ProfileSetupScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');

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

    const handleCompleteProfile = async () => {
        if (!username || !age || !gender || !housing) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            const userId = auth.currentUser.uid;

            //update or set user doc with info
            await setDoc(doc(firestore, "users", userId), {
                userName: username,
                age,
                gender,
                housing,
                isProfileComplete: true,
            }, { merge: true }).then(() => {
                console.log("Document successfully written with merge");
            });

            //update auth displayName 
            await updateProfile(auth.currentUser, {
                displayName: username,
            }).then(() => {
                console.log("auth user displayName updated");
            })


            navigation.navigate("TabStack");
        } catch (error) {
            console.error('Error completing profile: ', error);
            Alert.alert('Error', 'There was an error completing your profile. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.inputTitle}>Username *</Text>
            <TextInput
                placeholder='Please key in your username'
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <Text style={styles.inputTitle}>Age *</Text>
            <TextInput
                placeholder='Please key in your age'
                value={age}
                onChangeText={setAge}
                keyboardType='numeric'
                style={styles.input}
            />

            <Text style={styles.inputTitle}>Gender *</Text>
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

            {/* below roommate preferences, not yet done, should include dropdown, slidebar, etc  */}
            <Text style={styles.inputTitle}>Housing *</Text>
            <DropDownPicker style={styles.dropdown}
                placeholder='Select a housing option'
                open={open}
                value={housing}
                items={items}
                setOpen={setOpen}
                setValue={setHousing}
                setItems={setItems}
            />

            <Text style={styles.caption}>More preferences option to come</Text>

            {/* <Button title="Complete Profile" onPress={handleCompleteProfile}/> */}
            <FormButton buttonTitle="Complete Profile" onPress={handleCompleteProfile} />
        </View>
    );
}

export default ProfileSetupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    inputTitle: {
        marginTop: 10,
        fontSize: 15,
    },
    input: {
        width: '100%',
        padding: 8,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
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
    },
    caption: {
        marginVertical: 100,
        alignSelf: 'center',
        marginBottom: 150,
    },
});

