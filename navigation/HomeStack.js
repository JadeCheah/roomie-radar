import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import AddPostUploadPhotoScreen from '../screens/AddPostUploadPhotoScreen';
import AddPostScreen from '../screens/AddPostScreen';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator initialRouteName="HomePage">
            <Stack.Screen name="HomePage" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AddPost" component={AddPostScreen} />
            <Stack.Screen name="AddPostPhoto" component={AddPostUploadPhotoScreen} />
       </Stack.Navigator>
    )
};

export default HomeStack;