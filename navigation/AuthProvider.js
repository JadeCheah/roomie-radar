import React, {createContext, useState, useContext, useEffect} from 'react';
import { Alert } from 'react-native';
import {  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebaseConfig';
import { defaultProfilePhoto } from './UserProfileContext';
import { onAuthStateChanged } from 'firebase/auth';



export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext); 

export const AuthProvider = ({children}) => {
   

    const [user, setUser] = useState(null);
      
    // const auth = getAuth(app);


useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser && currentUser.userName) {
            console.log('User is logged in');
            // Optionally set more user details from Firestore if needed
            setUser(currentUser);
        } else {
            console.log('No user logged in');
            setUser(null);
        }
    });

    return () => unsubscribe(); // Unsubscribe on cleanup
}, []);
  

    const getErrorMessage = (errorCode) => {
        switch(errorCode) {
            case 'auth/invalid-email':
                return 'Invalid email address format.';
            case 'auth/user-disabled':
                return 'This user had been disabled.';
            case 'auth/user-not-found':
                return 'No user found with this email.';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/email-already-in-use':
                return 'Email is already in use.';
            case 'auth/invalid-credential':
                return 'The provided authentication credential is invalid or has expired. Please try again.';
            default: 
                return 'An unknown error occured. Please try again.';
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async(email, password) => {
                    try {
                        await signInWithEmailAndPassword(auth, email, password);
                    } catch(e) {
                        console.log(e);
                        const errorMessage = getErrorMessage(e.code);
                        Alert.alert('Login Error', errorMessage);
                    }
                },
                register: async (email, password) => {
                    try {
                        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                        const { uid } = userCredential.user;

                        //create user profile document in firestore
                        const shortenedUid = uid.slice(0,6);
                        await setDoc(doc(firestore, 'users', uid), {
                            userName: uid, //initializing username with userID 
                            userIntro: 'User Introduction',
                            profilePhoto: defaultProfilePhoto,
                        });

                        console.log('User registered and profile created');
                    } catch (e) {
                        console.log(e);
                        const errorMessage = getErrorMessage(e.code);
                        Alert.alert('Login Error', errorMessage);
                    }
               
                },
                logout: async () => {
                    try {
                        await sosignOut(auth);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }}>
            {children}
        </AuthContext.Provider>
    );
};