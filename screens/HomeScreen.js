import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Modal, TextInput, Button, ImageBackground, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import PostCard from '../components/PostCard';
import { useAuth } from '../navigation/AuthProvider';

const HomeScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const postsRef = collection(firestore, "posts");
        const q = query(postsRef, orderBy('postTime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log(`[HomeScreen] Received ${snapshot.docs.length} new posts from Firestore.`);
            const incomingPosts = snapshot.docs.map(doc => ({
                _id: doc.id,
                post: doc.data().post || '',
                postImg: doc.data().postImg,
                postTime: doc.data().postTime ? new Date(doc.data().postTime.seconds * 1000).toLocaleString() : new Date().toLocaleString(),
                userImg: doc.data().userImg || 'default_avatar.png',
                userName: doc.data().userName || '',
                userId: doc.data().userId,
                likes: doc.data().likes || 0,
                commentsCount: doc.data().commentsCount,
                liked: doc.data().liked || false,
            }));
            setPosts(incomingPosts);
        });

        return () => unsubscribe();
    }, []);

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
        <ImageBackground 
            source={require('../assets/orange-gradient.jpg')} 
            style={styles.container}
            resizeMode="cover"
        >
            <FlatList
                data={posts}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <PostCard item={item}/>}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
            />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    addButton: {
        padding: 10,
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 1,
        borderRadius: 20,
        elevation: 3
    },
    addButtonText: {
        fontSize: 24,
        color: '#ffffff'
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
        marginBottom: 15,
        textAlign: 'center'
    }
});

export default HomeScreen;
