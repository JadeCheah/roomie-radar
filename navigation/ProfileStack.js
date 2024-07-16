import React from 'react';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileUploadPhotoScreen from '../screens/EditProfileUploadPhotoScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import { UserProfileProvider } from './UserProfileContext';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, TouchableOpacity } from 'react-native';
import ProfileDrawer from './ProfileDrawerNav';
import FindMatchesScreen from '../screens/FindMatchesScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();

const ProfileStack = ({ navigation }) => {
    return (
        <UserProfileProvider>
            <Stack.Navigator initialRouteName='Profile Page'>
            <Stack.Screen
                name="Profile Page"
                component={ProfileScreen}
                options={{ headerShown: false}}
            />
            <Stack.Screen
                name="Upload Photo"
                component={EditProfileUploadPhotoScreen}
                options={({ navigation }) => ({
                    headerLeft: () => (
                        <Button
                            onPress={() => navigation.goBack()}
                            title="< Back"
                            color="#000"
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="Edit Profile"
                component={EditProfileScreen}
                options={({ navigation }) => ({
                    headerLeft: () => (
                        <Button
                            onPress={() => navigation.goBack()}
                            title="< Back"
                            color="#000"
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="Find Matches"
                component={FindMatchesScreen}
                options={({ navigation }) => ({
                    headerLeft: () => (
                        <Button
                            onPress={() => navigation.goBack()}
                            title="< Back"
                            color="#000"
                        />
                    ),
                })}
            />
        </Stack.Navigator>
        </UserProfileProvider >
    );
}

export default ProfileStack;