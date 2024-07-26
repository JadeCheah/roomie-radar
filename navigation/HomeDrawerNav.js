import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddPostScreen from '../screens/AddPostScreen';
import { Modal, View, TextInput, Button, StyleSheet, Pressable, Text } from 'react-native';

const Stack = createStackNavigator();

const HomeDrawerNav = () => {
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
                    name="Home" 
                    component={HomeScreen}
                    options={({ navigation }) => ({
                        headerRight: () => (
                            <Pressable 
                                onPress={() => navigation.navigate('AddPost')}
                                style={({ pressed }) => [
                                    styles.addButton,
                                    { backgroundColor:  '#ffffff' }
                                ]}
                            >
                                <Text style={styles.addButtonText}>+</Text>
                            </Pressable>
                        ),
                        headerTitle: "Home"
                    })}
                />
                <Stack.Screen name="AddPost" component={AddPostScreen} />
            </Stack.Navigator>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            placeholder="What's on your mind?"
                            value={newPostContent}
                            onChangeText={setNewPostContent}
                            style={styles.modalText}
                        />
                        <Button
                            title="Post"
                            onPress={handleAddPost}
                        />
                        <Button
                            title="Cancel"
                            color="red"
                            onPress={() => setModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>
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
        fontSize: 26,
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

export default HomeDrawerNav;
