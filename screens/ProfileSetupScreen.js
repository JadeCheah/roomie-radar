import React, { useState } from 'react';
import { Button, View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from 'firebase/auth';

const ProfileSetupScreen = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [preferences, setPreferences] = useState('');

    const handleCompleteProfile = async() => {
        if (!username || !age) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        try {
            const userId = auth.currentUser.uid;
            await setDoc(doc(firestore, "users", userId), {
                userName: username, 
                age, 
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
            <Text>Profile Setup</Text>
            <TextInput
                placeholder='Username'
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder='Age'
                value={age}
                onChangeText={setAge}
                keyboardType='numeric'
                style={styles.input}
            />
            <Button title="Complete Profile" onPress={handleCompleteProfile} />
            {/* below roommate preferences, not yet done, should include dropdown, slidebar, etc  */}
        </View>
    );
}

export default ProfileSetupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        width: '100%',
        padding: 8,
        marginVertical: 8,
        borderWidth: 1, 
        borderColor: '#ccc',
        borderRadius: 4,
    },
});

