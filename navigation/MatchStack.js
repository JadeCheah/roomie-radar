import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Pressable, Text } from 'react-native';
import FindMatchesScreen from '../screens/FindMatchesScreen';
import OtherUsersProfileScreen from '../screens/OtherUsersProfileScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

const MatchStack = () => {
    return (
        <Stack.Navigator initialRouteName="FindMatches">
            <Stack.Screen name="FindMatches" component={FindMatchesScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="OtherUserProfile" component={OtherUsersProfileScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
    );
}

export default MatchStack;