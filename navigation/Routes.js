import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
        </NavigationContainer>
    );
};

export default Routes;