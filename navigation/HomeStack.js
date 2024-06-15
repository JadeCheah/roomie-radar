import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import AddPostUploadPhotoScreen from '../screens/AddPostUploadPhotoScreen';
import AddPostScreen from '../screens/AddPostScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';

const Stack = createStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddPost" component={AddPostScreen} />
            <Stack.Screen name="AddPostPhoto" component={AddPostUploadPhotoScreen} />
       </Stack.Navigator> 
    )
};

export default HomeStack;