import React, {useState, useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const Stack = createStackNavigator();

const AuthStack = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
    let routeName;

    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched').then((value) => {
            if (value == null) {
                AsyncStorage.setItem('alreadyLaunched', 'true');
                setIsFirstLaunch(true);
            } else {
                setIsFirstLaunch(false);
            }
        });
    }, []);

    if (isFirstLaunch == null) {
        return null;
    } else if (isFirstLaunch == true) {
        routeName = 'Onboarding';
    } else {
        routeName = 'Login';
    }

    return (
        <Stack.Navigator initialRouteName={routeName}>
            <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{header: () => null}}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{header: () => null}}
            />
            <Stack.Screen
                name="Signup"
                component={SignupScreen}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;