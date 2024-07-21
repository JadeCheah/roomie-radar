import React, { createContext, useState, useEffect } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';

const PreferencesContext = createContext();

//create the provider component 
const PreferencesProvider = ({ children }) => {
    const [preferences, setPreferences] = useState({
        age: '',
        gender: '',
        housing: '',
        sleepTimeStart: new Date(1598051730000),
        sleepTimeEnd: new Date(1598051730000),
        wakeUpTimeStart: new Date(1598051730000),
        wakeUpTimeEnd: new Date(1598051730000),
        sleepScheduleFlexibility: 0,
        sleepLightsOnOff: 'No Preference',
    });

    const [tempPreferences, setTempPreferences] = useState(preferences);

    useEffect(() => {
        const loadPreferences = async() => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const mainDoc = await getDoc(doc(firestore, 'users', user.uid, 'preferences', 'main'));
                    const sleepDoc = await getDoc(doc(firestore, 'users', user.uid, 'preferences', 'sleep'));
                    // const tidinessDoc = await getDoc(dc(firestore, 'users', user.uid, 'preferences', 'tidiness'));
                
                    let loadedPreferences = {};
                    if (mainDoc.exists()) loadedPreferences = {...loadedPreferences, ...mainDoc.data() };
                    if (sleepDoc.exists()) loadedPreferences = {...loadedPreferences, ...sleepDoc.data() };
                    // if (tidinessDoc.exists()) loadedPreferences = {...loadedPreferences, ...tidinessDoc.data() };

                    setPreferences(loadedPreferences);
                    setTempPreferences(loadedPreferences);
                } catch (error) {
                    console.error("Error loading preferences", error);
                }
            }
        };

        loadPreferences();

    }, [auth.currentUser]);

    const updateTempPreferences = (newPreferences) => {
        setTempPreferences((prevPreferences) => ({
            ...prevPreferences,
            ...newPreferences,
        }));
    };

    const savePreferences = async() => {
        const user = auth.currentUser;
        if (user) {
            try {
                const mainRef = doc(firestore, 'users', user.uid, 'preferences', 'main');
                const sleepRef = doc(firestore, 'users', user.uid, 'preferences', 'sleep');
                // const tidinessRef = doc(firestore, 'users', user.uid, 'preferences', 'tidiness');
                
                //setDoc main
                await setDoc(mainRef, { age: tempPreferences.age, gender: tempPreferences.gender, 
                    housing: tempPreferences.housing }, { merge: true });
                
                //setDoc sleep
                await setDoc(sleepRef, { sleepTimeStart: tempPreferences.sleepTimeStart, sleepTimeEnd: tempPreferences.sleepTimeEnd,
                    wakeUpTimeStart: tempPreferences.wakeUpTimeStart, wakeUpTimeEnd: tempPreferences.wakeUpTimeEnd,
                    sleepScheduleFlexibility: tempPreferences.sleepScheduleFlexibility, 
                    sleepLightsOnOff: tempPreferences.sleepLightsOnOff }, { merge: true });
                //this part ignore first, haven't implemented yet 
                // await setDoc(tidinessRef, { age: tempPreferences.age, gender: tempPreferences.gender, 
                //     housing: tempPreferences.housing }, { merge: true });
            } catch(error) {
                console.error("Error saving preferences: ", error);
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
        <PreferencesContext.Provider value={{ preferences, tempPreferences, updateTempPreferences, savePreferences }}>
            {children}
        </PreferencesContext.Provider>

    );
}

export { PreferencesProvider, PreferencesContext };