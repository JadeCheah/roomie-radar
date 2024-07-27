import React from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { arrayUnion, arrayRemove, doc, updateDoc } from "firebase/firestore";
import { firestore } from '../firebaseConfig';
import { useAuth } from '../navigation/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ item }) => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const likeIcon = item.likes.length > 0 ? 'heart' : 'heart-outline';
    const likeIconColor = item.likes.length > 0 ? '#2e64e5' : '#333';
    const likeText = item.likes.length === 1 ? '1 Like' : `${item.likes.length} Likes`;
    const commentText = item.commentsCount === 0 ? "Comment" : item.commentsCount === 1 ? '1 Comment' : `${item.commentsCount} Comments`;


    const convertDateString = (dateStr) => {
        const parts = dateStr.split(", ");
        const dateParts = parts[0].split('/');
        const timeParts = parts[1].split(':');
    
        const newFormat = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}T${timeParts[0]}:${timeParts[1]}:${timeParts[2]}`;
        let date = new Date(newFormat);
        return formatDistanceToNow(date) + ' ago';

    };
    

    const openUserProfile = () => {
        console.log(item.userId);
        navigation.navigate('OtherUsersProfileScreen', { userId: item.userId }); 
    };

    const handleLike = async () => {
        const postRef = doc(firestore, "posts", item._id);
        if (item.likes.includes(user.uid)) {
            await updateDoc(postRef, { likes: arrayRemove(user.uid) });
        } else {
            await updateDoc(postRef, { likes: arrayUnion(user.uid) });
        }
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.userInfo} onPress={openUserProfile}>
                <Image source={{ uri: item.userImg }} style={styles.userImg} />
                <View style={styles.userInfoText}>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.postTime}>{convertDateString(item.postTime)}</Text>
                </View>
            </TouchableOpacity>
            {item.postImg && (
                <Image
                    source={{ uri: item.postImg }}
                    style={styles.postImg}
                    resizeMode="cover"
                />
            )}
            <Text style={styles.postText}>{item.post}</Text>
            <View style={styles.interactionWrapper}>
                <TouchableOpacity style={styles.interaction} onPress={handleLike}>
                    <Ionicons name={likeIcon} size={25} color={likeIconColor} />
                    <Text style={styles.interactionText}>{likeText}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.interaction} onPress={() => navigation.navigate('Comment', { postId: item._id })}>
                    <Ionicons name='chatbubble-outline' size={25} color='#333' />
                    <Text style={styles.interactionText}>{commentText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, // Adjusted for spacing
    },
    userImg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userInfoText: {
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    postTime: {
        fontSize: 12,
        color: '#666',
    },
    postImg: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    postText: {
        marginBottom: 10,
    },
    interactionWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    interaction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    interactionText: {
        marginLeft: 5,
        fontWeight: 'bold',
    },
});

export default PostCard;
