import React from 'react';
import { firestore } from '../firebaseConfig';
import { collection, doc, getDocs, setDoc, updateDoc, deleteField, getDoc } from 'firebase/firestore';

const extractId = (uid) => {
    //This extracts the first 8 characters of the UID
    return uid.substring(0,8);
}

async function migrateUserData() {
    const usersRef = collection(firestore, 'users');
    const snapshot = await getDocs(usersRef);

    for (const userDoc of snapshot.docs) {
        const userData = userDoc.data();
        const userRef = userDoc.ref; // ref field of the queryDocumentSnapshot object 

        //check if the 'preferences' subcollection exists
        const preferencesRef = collection(userRef, 'preferences');
        const preferencesSnapshot = await getDocs(preferencesRef); 
        if (!preferencesSnapshot.empty) {
            console.log(`User ${userDoc.id} already has preferences. Skipping.`);
            continue;
        }

        //extract id from UID, add new id field 
        const extractedId = extractId(userDoc.id);
        await updateDoc(userRef, { id: extractedId }); //this id is different from the queryDocumentSnapshot object id field 

        //create 'main' document in preferences 
        await setDoc(doc(preferencesRef, 'main'), {
            age: userData.age || '',
            gender: userData.gender || '',
            housing: userData.housing || ''
        });

        //create 'sleep' document in preferences 
        await setDoc(doc(preferencesRef, 'sleep'), {
            sleepTimeStart: userData.sleepTimeStart || '00:00',
            sleepTimeEnd: userData.sleepTimeEnd || '00:00',
            wakeUpTimeStart: userData.wakeUpTimeStart || '00:00',
            wakeUpTimeEnd: userData.wakeUpTimeEnd || '00:00',
            sleepScheduleFlexibility: userData.sleepScheduleFlexibility || 0,
            sleepLightsOnOff: userData.sleepLightsOnOff || 'No preference'
        });

        //Remove age, gender, housing from the main document if it exists 
        if (userData.age !== undefined) {
            await updateDoc(userRef, { age: null });
        }
        if (userData.gender !== undefined) {
            await updateDoc(userRef, { gender: null });
        }
        if (userData.housing !== undefined) {
            await updateDoc(userRef, { housing: null });
        }
        console.log(`Migrated user ${userDoc.id}`);
    }
    
    console.log('Migration completed');
}

export default migrateUserData;