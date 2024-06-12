import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const MyTabs = () => {
    return (
        <Tab.Navigator initialRouteName='Home'>
            <Tab.Screen 
              name="Home" 
              component={HomeScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
              }} 
            />
            <Tab.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="account" color={color} size={size} />
                ),
              }}
            />
        </Tab.Navigator>
    );
}

export default MyTabs;