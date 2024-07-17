import React, { useState, useContext } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import FormButton from '../components/FormButton';
import { firestore } from '../firebaseConfig';
import { AuthContext } from "../navigation/AuthProvider";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';


const AddPostScreen = ({ navigation }) => {
    const [postText, setPostText] = useState('');
    const [postImg, setPostImg] = useState('');
    const { user } = useContext(AuthContext);

    const handleAddPost = async () => {
        if (postText.length > 0) {
            console.log(firestore);
            await addDoc(collection(firestore, 'posts'),{
                userName: user.displayName,
                userImg: user.photoURL,
                postTime: new Date(),
                post: postText,
                postImg: postImg, 
                liked: false,
                likes: 0,
                comments: 0,
            });
            setPostText('');
            setPostImg('');  // Reset image URI after posting
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="What's on your mind?"
                style={styles.textInput}
                value={postText}
                onChangeText={setPostText}
                
            />
            <FormButton buttonTitle="Post" onPress={handleAddPost} />
            <FormButton 
            buttonTitle="Add Photo" 
            onPress={() => navigation.navigate('AddPostPhoto', { onPhotoSelected: setPostImg })} />
        </View>
    );
};

export default AddPostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    textInput: {
        height: 100,
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        width: '100%',
        marginBottom: 10,
    }
});
