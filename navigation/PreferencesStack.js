import React, { useEffect } from 'react';
import PreferencesScreen1 from '../screens/PreferencesScreen/PreferencesScreen1';
import PreferencesScreen2 from '../screens/PreferencesScreen/PreferencesScreen2';
import { PreferencesProvider } from '../contexts/PreferencesContext';

import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

const PreferencesStack = ({ navigation }) => {

    return (
        <PreferencesProvider>
            <Stack.Navigator initialRouteName="Preferences 1">
                <Stack.Screen name="Preferences 1" component={PreferencesScreen1} options={{ headerShown: false, title: 'General' }} />
                <Stack.Screen name="Preferences 2" component={PreferencesScreen2} options={{ headerShown: false, title:'Sleep' }} />
            </Stack.Navigator>
        </PreferencesProvider>
    );
};

export default PreferencesStack;