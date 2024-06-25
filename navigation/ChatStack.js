import React from 'react';
import ChatScreen from '../screens/ChatScreen';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

const ChatStack = () => {
    return (
        <Stack.Navigator initialRouteName="ChatPage">
            <Stack.Screen name="ChatPage" component={ChatScreen} options={{ headerShown: false }} />
       </Stack.Navigator>
    )
};

export default ChatStack;