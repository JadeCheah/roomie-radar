import React, { createContext, useState, useEffect } from 'react';
import { Button, View, Text, TextInput, Alert, StyleSheet, ScrollView, SafeAreaView, Picker } from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const UserSetupContext = createContext();

//create the provider component 
const UserSetupProvider = ({ children }) => {

    const[saving, setSaving] = useState(false);

    const [details, setDetails] = useState({
        userName: '',
        userIntro: '',
        age: '',
        gender: '',
        housing: '',
        sleepTimeStart: '00:00',
        sleepTimeEnd: '00:00',
        wakeUpTimeStart: '00:00',
        wakeUpTimeEnd: '00:00',
        sleepScheduleFlexibility: 0,
        sleepLightsOnOff: 'No preference',
    });

    const [tempDetails, setTempDetails] = useState(details);

    const updateTempDetails = (newDetails) => {
        setTempDetails((prevDetails) => ({
            ...prevDetails,
            ...newDetails,
        }));
    };

    const handleCompleteProfile = async () => {

        const { userName, userIntro, age, gender, housing } = tempDetails;

        if (!userName || !userIntro || !age || !gender || !housing) {
            Alert.alert('Error', 'Please fill in all required fields');
            return null;
        }

        const user = auth.currentUser;
        if (user) {
            try {
                const userDocRef = doc(firestore, 'users', user.uid);
                const mainDocRef = doc(firestore, 'users', user.uid, 'preferences', 'main');
                const sleepDocRef = doc(firestore, 'users', user.uid, 'preferences', 'sleep');
                // const tidinessRef = doc(firestore, 'users', user.uid, 'preferences', 'tidiness');

                //set user doc: userName, userIntro, isProfileComplete
                //update or set user doc with info
                await setDoc(userDocRef, {
                    userName: tempDetails.userName,
                    userIntro: tempDetails.userIntro,
                    isProfileComplete: true,
                }, { merge: true });

                //set main doc includes: age, gender, housing
                await setDoc(mainDocRef, {
                    age: tempDetails.age,
                    gender: tempDetails.gender,
                    housing: tempDetails.housing,
                }, { merge: true });

                //set sleep doc includes: sleepTimeStart, sleepTimeEnd, wakeUpTimeStart, wakeUpTimeEnd
                await setDoc(sleepDocRef, {
                    sleepTimeStart: tempDetails.sleepTimeStart,
                    sleepTimeEnd: tempDetails.sleepTimeEnd,
                    wakeUpTimeStart: tempDetails.wakeUpTimeStart,
                    wakeUpTimeEnd: tempDetails.wakeUpTimeEnd,
                    sleepScheduleFlexibility: tempDetails.sleepScheduleFlexibility,
                    sleepLightsOnOff: tempDetails.sleepLightsOnOff,
                })

                //update auth displayName 
                await updateProfile(auth.currentUser, {
                    displayName: tempDetails.userName,
                }).then(() => {
                    console.log("auth user displayName updated");
                });

            } catch (error) {
                console.error("Error completing profile ", error);
            }
        }
    };

    // const updatePreferences = async (newPreferences) => {
    //     const user = auth.currentUser;
    //     if (user) {
    //         try {
    //             const docRef = doc(firestore, 'users', user.uid, 'preferences', 'main');
    //             await setDoc(docRef, newPreferences, { merge:true });
    //             setPreferences((prevPreferences) => ({
    //                 ...prevPreferences,
    //                 ...newPreferences,
    //             }));
    //         } catch(error) {
    //             console.error("Error updating preferences", error);
    //         }
    //     }
    // };

    return (
        <UserSetupContext.Provider value={{ tempDetails, updateTempDetails, handleCompleteProfile }}>
            {children}
        </UserSetupContext.Provider>

    );
}

export { UserSetupProvider, UserSetupContext };