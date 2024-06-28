import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { auth } from "../firebaseConfig";
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { AuthContext } from './AuthProvider';

const Routes = () => {
    const {user, setUser} = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);
    
    // const auth = getAuth(app);

    //Authentication state listener
    useEffect(() => {
        const subscriber = auth.onAuthStateChanged((user) => {
            setUser(user);
            if (initializing) setInitializing(false);
        });

        //unsubscribe on unmount 
        return () => subscriber();
    
    }, [initializing]);

    if (initializing) return; //Possible bug here, used to be null

    return (
        <NavigationContainer>
            {user ? <AppStack /> : <AuthStack/>} 
        </NavigationContainer>
    );
};

export default Routes;