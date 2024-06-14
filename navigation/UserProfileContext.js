import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileContext = createContext();

const UserProfileProvider = ({children}) => {
    const defaultProfilePhoto = require('../assets/defaultUserImage_1.png'); 
    const[profile, setProfile] = useState({
        userName: 'John Doe',
        userIntro: 'Something something',
        profilePhoto: defaultProfilePhoto , //URI of the profile photo
    });

    useEffect(() => {
        const loadProfile = async() => {
            try {
                const userProfileData = await AsyncStorage.getItem('profile');
                if (userProfileData !== null ) {
                    setProfile(JSON.parse(userProfileData));
                }
            } catch (error) {
                console.error('Failed to load profile', error);
            }
        };

        loadProfile();
    }, []);

    const updateProfile = async (newProfile) => {
        try {
            setProfile(newProfile);
            await AsyncStorage.setItem('profile', JSON.stringify(newProfile));
        } catch (error) {
            console.error('Failed to save profile', error);
        }
    };

    return (
        <UserProfileContext.Provider value={{ profile, updateProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export {UserProfileContext, UserProfileProvider};