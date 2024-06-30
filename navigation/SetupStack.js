import React from 'react';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import { createStackNavigator } from '@react-navigation/stack';
import MyTabs from './TabStack';

const Stack = createStackNavigator();

const SetupStack = () => {
    return (
        <Stack.Navigator initialRouteName='Finish Setting Up'>
            <Stack.Screen
                name="Finish Setting Up"
                component={ProfileSetupScreen}
                options={{ headerShown: true }}
            />
            <Stack.Screen
                name="TabStack"
                component={MyTabs}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default SetupStack;
