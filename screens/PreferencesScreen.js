import React , { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, StyleSheet} from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const PreferencesScreen = () => {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [housing, setHousing] = useState('');

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
                }
            }

        };

        loadDoc();

    }, [auth.currentUser]);


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Your Age: {age}</Text>
            <Text style={styles.text}>Your Gender: {gender}</Text>
            <Text style={styles.text}>Your Housing: {housing}</Text>
        </View>
    );
}

export default PreferencesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        marginLeft: 20,
        marginTop: 20
    },
    text: {
        fontSize: 20,
    }
})
