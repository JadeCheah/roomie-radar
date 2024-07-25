import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeStack from './HomeStack';
import ChatStack from './ChatStack';
import FindMatchesScreen from '../screens/FindMatchesScreen';
import HomeDrawerNav from './HomeDrawerNav';
import ProfileDrawer from './ProfileDrawerNav';

const Tab = createBottomTabNavigator();

const MyTabs = () => {
    return (
        <Tab.Navigator initialRouteName='Home'>
            <Tab.Screen 
              name="Home" 
              component={HomeDrawerNav}
              options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
                headerShown: false,
              }} 
              
            />
            <Tab.Screen
                name="Find Matches"
                component={FindMatchesScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="radar" color={color} size={size} />
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
              component={ProfileDrawer} 
              options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="account" color={color} size={size} />
                ),
                headerShown: false,
              }}
            />
        </Tab.Navigator>
    );
}

export default MyTabs;