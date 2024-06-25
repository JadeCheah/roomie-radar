import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileStack from './ProfileStack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeStack from './HomeStack';
import ChatStack from './ChatStack';

const Tab = createBottomTabNavigator();

const MyTabs = () => {
    return (
        <Tab.Navigator initialRouteName='Home'>
            <Tab.Screen 
              name="Home" 
              component={HomeStack}
              options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
              }} 
            />
            <Tab.Screen 
              name="Chat" 
              component={ChatStack}
              options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="chat" color={color} size={size} />
                ),
              }} 
            />
            <Tab.Screen 
              name="Profile" 
              component={ProfileStack} 
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