import react, {createContext, useState} from 'react';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import app from '../firebaseConfig';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const auth = getAuth(app);

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
                    // signInWithEmailAndPassword(auth, email, password)
                    // .then((userCredential) => {
                    //     //Signed in
                    //     const user = userCredential.user;
                    //     setUser(user);
                    // })
                    // .catch((error) => {
                    //     const errorCode = error.code;
                    //     const errorMessage = error.message;
                    // });
                },
                register: async (email, password) => {
                    try {
                        await createUserWithEmailAndPassword(auth, email, password);
                    } catch (e) {
                        console.log(e);
                    }
                    // createUserWithEmailAndPassword(auth, email, password)
                    // .then((userCredential) => {
                    //     //Signed up
                    //     const user = userCredential.user;
                    //     setUser(user);
                    // })
                    // .catch((error) => {
                    //     const errorCode = error.code;
                    //     const errorMessage = error.message;
                    // });
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