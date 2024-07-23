import React from 'react';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import UserSetupScreen1 from '../screens/UserSetupScreens/UserSetupScreen1';
import UserSetupScreen2 from '../screens/UserSetupScreens/UserSetupScreen2';
import { createStackNavigator } from '@react-navigation/stack';
import MyTabs from './TabStack';
import { UserSetupProvider } from '../contexts/UserSetupContext';

const Stack = createStackNavigator();

const SetupStack = () => {
    return (
        <UserSetupProvider>
            <Stack.Navigator initialRouteName='Setup 1'>
                <Stack.Screen
                    name="Setup 1"
                    component={UserSetupScreen1}
                    options={{ headerShown: true, title: 'Finish Setting Up' }}
                />
                <Stack.Screen
                    name="Setup 2"
                    component={UserSetupScreen2}
                    options={{ headerShown: true, title: 'Finish Setting Up' }}
                />
                <Stack.Screen
                    name="TabStack"
                    component={MyTabs}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </UserSetupProvider>
    );
}

export default SetupStack;
