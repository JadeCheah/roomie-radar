import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PreferencesStack from './PreferencesStack';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileStack from './ProfileStack';
import { useFocusEffect } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const ProfileDrawer = ({navigation}) => {
    useEffect (() => {
        const unsubscribe = navigation.addListener('blur', () => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Profile Stack' }],
            });
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <Drawer.Navigator initialRouteName='Profile Stack' screenOptions={{drawerPosition:"right"}}>
            <Drawer.Screen name="Profile Stack" component={ProfileStack} options={{ drawerLabel: 'Profile', title: 'Profile'}}/>
            <Drawer.Screen name="Preferences Details" component={PreferencesStack} options={{ drawerLabel: 'Preferences' }}/> 
            <Drawer.Screen name="Settings" component={SettingsScreen} options={{ drawerLabel: 'Settings' }}/> 
        </Drawer.Navigator>
    );
}

export default ProfileDrawer;

