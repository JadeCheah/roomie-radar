import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import GradualButton from '../components/GradualButton';
import { AuthContext } from "../navigation/AuthProvider";
import { firestore } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

//test

const AddPostScreen = ({ navigation, route }) => {
    const [postText, setPostText] = useState('');
    const [postImg, setPostImg] = useState(route.params?.postImg || ''); // Default to empty or the incoming URI
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (route.params?.postImg) {
            setPostImg(route.params.postImg);
        }
    }, [route.params?.postImg]);

    const handleAddPost = async () => {
        if (postText.trim().length > 0) {
            await addDoc(collection(firestore, 'posts'), {
                userName: user.displayName,
                userId: user.uid,
                userImg: user.photoURL,
                postTime: serverTimestamp(),
                post: postText.trim(),
                postImg: postImg,
                liked: false,
                likes: [],
                commentsCount: 0,
            });
            setPostText('');
            setPostImg('');
            navigation.goBack();
        }
    };

    const dismissKeyboard = () => Keyboard.dismiss();

    return (
        <ImageBackground
            source={require('../assets/orange-gradient.jpg')}
            style={styles.container}
            resizeMode="cover"
        >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.inner}>
                    {postImg ? (
                        <Image
                            source={{ uri: postImg }}
                            style={styles.imagePreview}
                        />
                    ) : null}
                    <TextInput
                        placeholder="What's on your mind?"
                        style={styles.textInput}
                        value={postText}
                        onChangeText={setPostText}
                        multiline={true}
                        numberOfLines={4}
                    />
                    <GradualButton title="Post" onPress={handleAddPost} />
                    <GradualButton title="Add Photo" onPress={() => navigation.navigate('AddPostPhoto', { onPhotoSelected: setPostImg })} />
                    <GradualButton title="Back" onPress={() => navigation.goBack()} />
                </View>
            </TouchableWithoutFeedback>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    textInput: {
        height: 100,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
    }
});

export default AddPostScreen;