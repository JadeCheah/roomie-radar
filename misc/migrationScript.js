import React from 'react';
import { firestore } from '../firebaseConfig';
import { collection, doc, getDocs, setDoc, updateDoc, deleteField, getDoc, writeBatch } from 'firebase/firestore';

const extractId = (uid) => {
    //This extracts the first 8 characters of the UID
    return uid.substring(0, 8);
}


const migrateUserData = async () => {
    const usersRef = collection(firestore, 'users');
    let batch = writeBatch(firestore);
    let userCount = 0;
    let successCount = 0;
    let errorCount = 0;

    try {
        const querySnapshot = await getDocs(usersRef);

        for (const userDoc of querySnapshot.docs) {
            userCount++;
            const userId = userDoc.id;
            const userData = userDoc.data();

            try {
                const preferencesRef = doc(usersRef, userId, 'preferences', 'main');
                const preferencesSnap = await getDoc(preferencesRef);

                if (preferencesSnap.exists()) {
                    const preferencesData = preferencesSnap.data();
                    const { gender, housing } = preferencesData;

                    // Update user document with gender and housing
                    batch.update(doc(usersRef, userId), {
                        gender: gender || null,
                        housing: housing || null
                    });

                    successCount++;
                    console.log(`Migrated data for user ${userId}`);
                } else {
                    console.log(`No preferences found for user ${userId}`);
                }
            } catch (error) {
                errorCount++;
                console.error(`Error migrating data for user ${userId}:`, error);
            }

            // Commit batch every 500 operations to avoid exceeding limits
            if (userCount % 500 === 0) {
                await batch.commit();
                batch = writeBatch(firestore);
            }
        }

        // Commit any remaining operations
        if (userCount % 500 !== 0) {
            await batch.commit();
        }

        console.log(`
        Migration completed:
        Total users processed: ${userCount}
        Successful migrations: ${successCount}
        Errors encountered: ${errorCount}
      `);

    } catch (error) {
        console.error("Error in migration process:", error);
    }
};

export default migrateUserData;