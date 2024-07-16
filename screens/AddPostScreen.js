// import React, { useContext } from "react";
// import { View, Text, StyleSheet, FlatList, TouchableOpacity} from "react-native";
// import FormButton from '../components/FormButton';

// const AddPostScreen = ({navigation}) => {

//     return (
//         <View style={styles.container}>
//             <Text style={styles.text}>What's On Your Mind?</Text>
//             <FormButton buttonTitle="Add Photo" onPress={() => navigation.navigate("AddPostPhoto")}></FormButton>
//         </View>
//     );
// };

// export default AddPostScreen;

// const styles = StyleSheet.create({
//     container: {
//         alignItems: 'center',
//         marginHorizontal: 20
//     },
//     text: {
//         font: 1,
//         marginTop: 100
//     }
// }) 

import React, { useState, useContext } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import FormButton from '../components/FormButton';
import { firestore } from '../firebaseConfig';
import { AuthContext } from "../navigation/AuthProvider";

const AddPostScreen = ({ navigation }) => {
    const [postText, setPostText] = useState('');
    const { user } = useContext(AuthContext);

    const handleAddPost = async () => {
        if (postText.length > 0) {
            await firestore.collection('posts').add({
                userName: user.displayName,
                userImg: user.photoURL,
                postTime: new Date(),
                post: postText,
                postImg: null, // This will be null until an image is added
                liked: false,
                likes: 0,
                comments: 0,
            });
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
                multiline
            />
            <FormButton buttonTitle="Post" onPress={handleAddPost} />
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
