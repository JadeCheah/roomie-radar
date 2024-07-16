import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../navigation/AuthProvider';
import { firestore } from '../firebaseConfig';
import PostCard from '../components/PostCard';

const HomeScreen = ({ route }) => {
    const [posts, setPosts] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const postsRef = collection(firestore, `posts`);
        const q = query(postsRef, orderBy('postTime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log(`[HomeScreen] Received ${snapshot.docs.length} new posts from Firestore.`);
            const incomingPosts = snapshot.docs.map(doc => ({
                _id: doc.id,
                post: doc.data().post || '',
                postImg: doc.data().postImg || 'default_postPhoto.png',
                postTime: doc.data().postTime ? new Date(doc.data().postTime.seconds * 1000).toLocaleString() : new Date().toLocaleString(),
                userImg: doc.data().userImg || 'default_avatar.png',  // Assuming a string URL
                userName: doc.data().userName || 'Anonymous',
                likes: doc.data().likes || 0,
                comments: doc.data().comments || 0,
                liked: doc.data().liked || false,
            }));
            setPosts(incomingPosts);
        });

        return () => {
            console.log("[HomeScreen] Cleaning up posts listener.");
            unsubscribe();
        };
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={item => item._id}
                renderItem={({ item }) => {
                console.log(item);
                return <PostCard item={item} />}}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    separator: {
        height: 1,
        width: "100%",
        backgroundColor: "#ddd",
        marginLeft: 60
    }
});

export default HomeScreen;
