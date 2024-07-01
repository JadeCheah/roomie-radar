import React , { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, TextInput, Picker, Alert } from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import FormButton from '../components/FormButton';

const PreferencesScreen = ({navigation}) => {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
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

    const savePreferences = async() => {
        if (!age || !gender || !housing) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        const user = auth.currentUser;
        if (user) {
            setSaving(true);
            try {
                await updateDoc(doc(firestore, 'users', user.uid), {
                    age, 
                    gender, 
                    housing,
                });
                Alert.alert("Success", "Preferences updated successfully!");
                navigation.navigate('Profile');
            } catch (error) {
                console.error("Failed to update preferences: ", error);
                Alert.alert("Error", "Failed to update preferences. ");
            } finally {
                setSaving(false);
            }
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff"/>
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
            {saving && (
                <ActivityIndicator size="small" color="#0000ff" style={styles.savingIndicator} />
            )}
            <FormButton buttonTitle="Save Preferences" onPress={savePreferences}/>
        </View>
    );
}

export default PreferencesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        marginLeft: 20,
        marginTop: 20,
        marginHorizontal: 18,
    },
    text: {
        fontSize: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
        fontFamily: 'Lato-Regular',
        marginTop: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        marginTop: 5,
        borderRadius: 8,
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
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    savingIndicator: {
        marginTop: 10,
    },
})
