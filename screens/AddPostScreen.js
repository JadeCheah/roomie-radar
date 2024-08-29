// import React, { useState, useContext } from 'react';
// import { View, TextInput, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
// import GradualButton from '../components/GradualButton';
// import { AuthContext } from "../navigation/AuthProvider";
// import { firestore } from '../firebaseConfig';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


//     const handlePhotoSelected = (photoUrl) => {
//         setPostImg(photoUrl);
//     };

//     const dismissKeyboard = () => Keyboard.dismiss();

//     return (
//         <ImageBackground
//             source={require('../assets/orange-gradient.jpg')}
//             style={styles.container}
//             resizeMode="cover"
//         >
//             <TouchableWithoutFeedback onPress={dismissKeyboard}>
//                 <View style={styles.inner}>
//                     {postImg ? (
//                         <Image
//                             source={{ uri: postImg }}
//                             style={styles.imagePreview}
//                         />
//                     ) : null}
//                     <TextInput
//                         placeholder="What's on your mind?"
//                         style={styles.textInput}
//                         value={postText}
//                         onChangeText={setPostText}
//                         multiline={true}
//                         numberOfLines={4}
//                     />
//                     <GradualButton title="Post" onPress={handleAddPost} />
//                     <GradualButton 
//                         title="Add Photo" 
//                         onPress={() => navigation.navigate('AddPostUploadPhotoScreen', { onPhotoSelected: handlePhotoSelected })} 
//                     />
//                     <GradualButton title="Back" onPress={() => navigation.goBack()} />
//                 </View>
//             </TouchableWithoutFeedback>
//         </ImageBackground>
//     );
// };






import React, { useState, useContext } from "react";
import { View, TextInput, StyleSheet, ImageBackground } from "react-native";
import FormButton from '../components/FormButton';
import { firestore } from '../firebaseConfig';
import { AuthContext } from "../navigation/AuthProvider";
 import GradualButton from '../components/GradualButton';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';


const AddPostScreen = ({ navigation }) => {
    const [postText, setPostText] = useState('');
    const [postImg, setPostImg] = useState('');
    const { user } = useContext(AuthContext);

        const handlePhotoSelected = (photoUrl) => {
        setPostImg(photoUrl);
    };


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
                likes: [],
                commentsCount: 0,
            });
            setPostText('');
            setPostImg('');  // Reset image URI after posting
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
        <View style={styles.inner}>
            <TextInput
                placeholder="What's on your mind?"
                style={styles.textInput}
                value={postText}
                onChangeText={setPostText}
                
            />
            <GradualButton title="Post" onPress={handleAddPost} />
                     <GradualButton 
                        title="Add Photo" 
                        onPress={() => navigation.navigate('AddPostPhoto', { onPhotoSelected: setPostImg })} 
                    />
                    <GradualButton title="Back" onPress={() => navigation.goBack()} />
                </View>
        </ImageBackground>
    );
};

//<TouchableWithoutFeedback onPress={dismissKeyboard}>
//                 <View style={styles.inner}>
//                     {postImg ? (
//                         <Image
//                             source={{ uri: postImg }}
//                             style={styles.imagePreview}
//                         />
//                     ) : null}
//                     <TextInput
//                         placeholder="What's on your mind?"
//                         style={styles.textInput}
//                         value={postText}
//                         onChangeText={setPostText}
//                         multiline={true}
//                         numberOfLines={4}
//                     />
//                     <GradualButton title="Post" onPress={handleAddPost} />
//                     <GradualButton 
//                         title="Add Photo" 
//                         onPress={() => navigation.navigate('AddPostUploadPhotoScreen', { onPhotoSelected: handlePhotoSelected })} 
//                     />
//                     <GradualButton title="Back" onPress={() => navigation.goBack()} />
//                 </View>
//             </TouchableWithoutFeedback>

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