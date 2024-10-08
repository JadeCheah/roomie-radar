import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddPostScreen from '../screens/AddPostScreen';
import AddPostUploadPhotoScreen from '../screens/AddPostUploadPhotoScreen';
import CommentScreen from '../screens/CommentScreen';
import { StyleSheet, Pressable, Text } from 'react-native';
import OtherUsersProfileScreen from '../screens/OtherUsersProfileScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');

    const handleAddPost = async () => {
        if (newPostContent.trim()) {
            await addDoc(collection(firestore, "posts"), {
                post: newPostContent,
                postTime: serverTimestamp(),
                userImg: user.photoURL, // Assuming you store the user's photo URL in the auth context
                userName: user.displayName,
                likes: 0,
                commentsCount: 0,
                liked: false
            });
            setNewPostContent('');
            setModalVisible(false);
        }
    };

    return (
        <>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={({ navigation }) => ({
                        headerRight: () => (
                            <Pressable
                                onPress={() => navigation.navigate('AddPost')}
                                style={({ pressed }) => [
                                    styles.addButton,
                                    { backgroundColor: '#ffffff' }
                                ]}
                            >
                                <Text style={styles.addButtonText}>+</Text>
                            </Pressable>
                        ),
                        headerTitle: "Home"
                    })}
                />
                <Stack.Screen name="AddPost" component={AddPostScreen} />
                <Stack.Screen name="HomePage" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="OtherUsersProfileScreen" component={OtherUsersProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
                <Stack.Screen name="AddPostPhoto" component={AddPostUploadPhotoScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Comment" component={CommentScreen} />
            </Stack.Navigator>
        </>
    );
}

const styles = StyleSheet.create({
    addButton: {
        padding: 10,
        marginRight: 10,
        borderRadius: 20
    },
    addButtonText: {
        fontSize: 24,
        color: '#2e64e5'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        width: '80%',
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5
    }
});

export default HomeStack;
