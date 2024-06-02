import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
<<<<<<< HEAD
import auth from '@react-native-firebase/auth';
import {AuthContext} from './AuthProvider';

import AuthStack from './AuthStack';
import AppStack from './AppStack';

const Routes = () => {
    const {user, setUser} = useContext(AuthContext);
    const {initializing, setInitializing} = useState(true);

    const onAuthStateChanged = (user) => {
        setUser(user);
        if(initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;// unsubscribe on unmount 
    }, []);

    if (initializing) return null;

    return (
        <NavigationContainer>
            {user? <AppStack/> : <AuthStack/>}
=======
import app from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { AuthContext } from './AuthProvider';

const Routes = () => {
    const {user, setUser} = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);
    
    const auth = getAuth(app);
    useEffect(() => {
        const subscriber = onAuthStateChanged(auth, (user) => {
            setUser(user);
            // if (initializing) setInitializing(false);
        });

        return subscriber;
    
    }, []);

    // if (initializing) return null; //Possible bug here 

    return (
        <NavigationContainer>
            {user ? <AppStack /> : <AuthStack/>} 
>>>>>>> branch_3
        </NavigationContainer>
    );
};

export default Routes;