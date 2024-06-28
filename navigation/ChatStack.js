import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MessageScreen from '../screens/MessageScreen'; // Make sure the path is correct
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

const ChatStack = () => {
    return (
        <Stack.Navigator initialRouteName="Messages">
            <Stack.Screen 
                name="Messages" 
                component={MessageScreen} 
                options={{ headerShown: false, title: 'Messages' }}
            />
            <Stack.Screen 
                name="Chat" 
                component={ChatScreen} 
                options={({ route }) => ({ 
                  title: route.params.userName, // Dynamically set the header title to the user's name
                  headerBackTitleVisible: false 
                })}
            />
        </Stack.Navigator>
    );
};

export default ChatStack;
