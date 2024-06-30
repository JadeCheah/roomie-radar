import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PreferencesScreen from '../screens/PreferencesScreen';
import SettingsScreen from '../screens/SettingsScreen';

import ProfileScreen from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator();

const ProfileDrawer = () => {
    return (
        <Drawer.Navigator initialRouteName='Profile' screenOptions={{drawerPosition:"right"}}>
            <Drawer.Screen name="Profile" component={ProfileScreen} options={{ drawerLabel: 'Profile' }}/>
            <Drawer.Screen name="Preferences Details" component={PreferencesScreen} options={{ drawerLabel: 'Preferences' }}/> 
            <Drawer.Screen name="Settings" component={SettingsScreen} options={{ drawerLabel: 'Settings' }}/> 
        </Drawer.Navigator>
    );
}

export default ProfileDrawer;

