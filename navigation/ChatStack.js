import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MessageScreen from '../screens/MessageScreen';
import ChatScreen from '../screens/ChatScreen';
import { Pressable, Text, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

const ChatStack = () => {
    
    return (
        <>
        <Stack.Navigator initialRouteName="Messages" >
            <Stack.Screen 
                name="Messages" 
                component={MessageScreen} 
                options={{headerTitle: "Chat"}}
            />
            <Stack.Screen 
                name="ChatScreen" 
                component={ChatScreen} 
                options={({ route }) => ({ 
                    title: route.params.userName, // Dynamically set the header title to the user's name
                    headerBackTitleVisible: false
                })}
            />
        </Stack.Navigator>
        </>
    );

};

const styles = StyleSheet.create({
    addButton: {
        padding: 10,
        marginRight: 10,
        borderRadius: 20,
        elevation: 2
    },
    addButtonText: {
        fontSize: 24,
        color: '#2e64e5'
    }
});

export default ChatStack;
