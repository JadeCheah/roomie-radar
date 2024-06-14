import React, {createContext, useState} from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import { auth } from '../firebaseConfig';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    // const auth = getAuth(app);

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
                    }
                },
                register: async (email, password) => {
                    try {
                        await createUserWithEmailAndPassword(auth, email, password);
                    } catch (e) {
                        console.log(e);
                    }
               
                },
                logout: async () => {
                    try {
                        await signOut(auth);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }}>
            {children}
        </AuthContext.Provider>
    );
};