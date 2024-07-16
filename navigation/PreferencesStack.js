import React, { useEffect } from 'react';
import PreferencesScreen1 from '../screens/PreferencesScreen/PreferencesScreen1';
import PreferencesScreen2 from '../screens/PreferencesScreen/PreferencesScreen2';

import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

const PreferencesStack = ({ navigation }) => {

    return (
        <Stack.Navigator initialRouteName="Preferences 1">
            <Stack.Screen name="Preferences 1" component={PreferencesScreen1} options={{ headerShown: false }} />
            <Stack.Screen name="Preferences 2" component={PreferencesScreen2} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
};

export default PreferencesStack;