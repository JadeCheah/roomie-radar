import React, { createContext, useState, useEffect } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const PreferencesContext = createContext();

//create the provider component 
const PreferencesProvider = ({ children }) => {
    const [preferences, setPreferences] = useState({
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

    const [tempPreferences, setTempPreferences] = useState(preferences);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadPreferences = async () => {
            const user = auth.currentUser;
            if (user) {
                setLoading(true);
                try {
                    const mainRef = doc(firestore, 'users', user.uid, 'preferences', 'main');
                    const sleepRef = doc(firestore, 'users', user.uid, 'preferences', 'sleep');

                    const validateTimeString = (timeStr) => {
                        if (typeof timeStr === 'string' && /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr)) {
                            return timeStr;
                        }
                        console.warn(`Invalid time string: ${timeStr}, defaulting to 00:00`);
                        return '00:00';
                    }

                    const unsubscribeMain = onSnapshot(mainRef, (doc) => {
                        if (doc.exists()) {
                            const mainData = doc.data();
                            const validatedData = {
                                ...mainData, 
                                age: mainData.age || '',
                                gender: mainData.gender || '',
                                housing: mainData.housing || '',
                            };
                            setPreferences((prev) => ({ ...prev, ...validatedData }));
                            setTempPreferences((prev) => ({ ...prev, ...validatedData }));
                        }
                    });

                    const unsubscribeSleep = onSnapshot(sleepRef, (doc) => {
                        if (doc.exists()) {
                            const sleepData = doc.data();
                            const validatedData = {
                                sleepTimeStart: validateTimeString(sleepData.sleepTimeStart),
                                sleepTimeEnd: validateTimeString(sleepData.sleepTimeEnd),
                                wakeUpTimeStart: validateTimeString(sleepData.wakeUpTimeStart),
                                wakeUpTimeEnd: validateTimeString(sleepData.wakeUpTimeEnd),
                                sleepScheduleFlexibility: sleepData.sleepScheduleFlexibility || 0,
                                sleepLightsOnOff: sleepData.sleepLightsOnOff || 'No preference',
                            }
                            setPreferences((prev) => ({ ...prev, ...validatedData }));
                            setTempPreferences((prev) => ({ ...prev, ...validatedData }));
                        }
                    });

                    //cleanup subscriptions on unmount 
                    return () => {
                        unsubscribeMain();
                        unsubscribeSleep();
                    };
                } catch (error) {
                    console.error('Error loading preferences', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
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

    const savePreferences = async () => {
        const user = auth.currentUser;
        if (user) {
            setSaving(true);
            try {
                const mainRef = doc(firestore, 'users', user.uid, 'preferences', 'main');
                const sleepRef = doc(firestore, 'users', user.uid, 'preferences', 'sleep');
                // const tidinessRef = doc(firestore, 'users', user.uid, 'preferences', 'tidiness');

                //setDoc main
                await setDoc(mainRef, {
                    age: tempPreferences.age,
                    gender: tempPreferences.gender,
                    housing: tempPreferences.housing
                }, { merge: true });

                //setDoc sleep
                await setDoc(sleepRef, {
                    sleepTimeStart: tempPreferences.sleepTimeStart,
                    sleepTimeEnd: tempPreferences.sleepTimeEnd,
                    wakeUpTimeStart: tempPreferences.wakeUpTimeStart,
                    wakeUpTimeEnd: tempPreferences.wakeUpTimeEnd,
                    sleepScheduleFlexibility: tempPreferences.sleepScheduleFlexibility,
                    sleepLightsOnOff: tempPreferences.sleepLightsOnOff
                }, { merge: true });
                //this part ignore first, haven't implemented yet 
                // await setDoc(tidinessRef, { age: tempPreferences.age, gender: tempPreferences.gender, 
                //     housing: tempPreferences.housing }, { merge: true });
            } catch (error) {
                console.error("Error saving preferences: ", error);
            } finally {
                setSaving(false);
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
        <PreferencesContext.Provider value={{ tempPreferences, updateTempPreferences, savePreferences, loading, saving }}>
            {children}
        </PreferencesContext.Provider>

    );
}

export { PreferencesProvider, PreferencesContext };