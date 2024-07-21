import React, { createContext, useState, useEffect } from 'react';
import { Image } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
// import { useNavigation } from '@react-navigation/native';


const UserProfileContext = createContext();

export const defaultProfilePhoto = Image.resolveAssetSource(
    require('../assets/defaultUserImage_1.png')).uri; 

const UserProfileProvider = ({children}) => {

    const [loading, setLoading] = useState(true);

    const[profile, setProfile] = useState({
        userName: 'New User',
        userIntro: 'User Introduction',
        profilePhoto: defaultProfilePhoto , //URI of the profile photo
    });

    useEffect(() => {
        const loadProfile = async() => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const profileDoc = await getDoc(doc(firestore, 'users', user.uid));
                    if (profileDoc.exists()) {
                        const profileData = profileDoc.data();
                        setProfile({
                            userName: user.displayName,
                            userIntro: profileData.userIntro,
                            profilePhoto: user.photoURL || defaultProfilePhoto,
                        });
                    } else {
                        //If no profile exists, initialize with default value
                        setProfile({
                            userName: 'New User',
                            userIntro: 'User Introduction',
                            profilePhoto: defaultProfilePhoto,
                        });

                    }
                } catch (error) {
                    console.error('Failed to load profile', error);
                } finally {
                    setLoading(false);
                }
            }

        };

        loadProfile();

    }, [auth.currentUser]);

    // const addNewUser = async (userId, userData) => {
    //     try {
    //         await setDoc(doc(firestore, 'users', userId), userData);
    //         console.log('New user document written successfully');
    //     } catch(error) {
    //         console.error('Error writing new use document: ', error)
    //     }
    // };
    
    const updateUserProfile = async (newProfile) => {
        const user = auth.currentUser;
        if (user) {
            try {
                //Update Firestore profile
                const profileDocRef = doc(firestore, 'users', user.uid);
                const profileDoc = await getDoc(profileDocRef);

                if (profileDoc.exists()) {
                    //update the profile in firestore
                    await updateDoc(profileDocRef, {
                        userName: newProfile.userName,
                        userIntro: newProfile.userIntro,
                        profilePhoto: newProfile.profilePhoto,
                    });
                } else {
                    //create a new document with the new profile data 
                    await setDoc(profileDocRef, {
                        userName: newProfile.userName,
                        userIntro: newProfile.userIntro,
                        profilePhoto: newProfile.profilePhoto || defaultProfilePhoto,
                    });
                }

                //update Firebase Auth profile 
                await updateProfile(user, {
                    displayName: newProfile.userName,
                    photoURL: newProfile.profilePhoto || defaultProfilePhoto
                });

                //update the local state 
                setProfile({
                    ...newProfile,
                    profilePhoto: newProfile.profilePhoto || defaultProfilePhoto,
                });

                console.log('User profile updated successfully');
            } catch (error) {
                console.error('Error updating profile: ', error);
            }
        } else {
            console.error('No user is currently logged in');
        }
    };

    return (
        <UserProfileContext.Provider value={{ profile, updateUserProfile, loading }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export {UserProfileContext, UserProfileProvider};