import React from 'react';
import { Card, UserInfo, UserImg, UserName, UserInfoText, PostTime, PostText, InteractionWrapper, Interaction, InteractionText } from "../styles/FeedStyles";
import { Image, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { arrayUnion, arrayRemove, doc, updateDoc } from "firebase/firestore";
import { firestore } from '../firebaseConfig';
import { useAuth } from '../navigation/AuthProvider';


const PostCard = ({ item }) => {
    const { user } = useAuth();
    const likeIcon = item.liked ? 'heart' : 'heart-outline';
    const likeIconColor = item.liked ? '#2e64e5' : '#333';
    const likeText = item.likes.length === 1 ? '1 Like' : item.likes.length > 1 ? `${item.likes.length} Likes` : 'Like';
    const commentText = item.comments === 1 ? '1 Comment' : item.comments > 1 ? `${item.comments} Comments` : 'Comment';

    const handleLike = async () => {
        const postRef = doc(firestore, "posts", item._id);
    
        if (item.likes.includes(user.uid)) {
            // If the current user's ID is already in the likes array, remove it
            await updateDoc(postRef, {
                likes: arrayRemove(user.uid)
            });
        } else {
            // If the current user's ID is not in the likes array, add it
            await updateDoc(postRef, {
                likes: arrayUnion(user.uid)
            });
        }
    };
        

    return (
        <Card>
            <UserInfo>
                <UserImg source={{ uri: item.userImg }} />
                <UserInfoText>
                    <UserName>{item.userName}</UserName>
                    <PostTime>{item.postTime}</PostTime>
                </UserInfoText>
            </UserInfo>
            {item.postImg && (
                <Image
                    source={{ uri: item.postImg }}
                    style={{ width: '100%', height: 200, backgroundColor: 'transparent' }}
                    resizeMode="cover"
                />
            )}
            <PostText>{item.post}</PostText>
            <InteractionWrapper>
                <Interaction active={item.liked} onPress={handleLike}>
                    <Ionicons name={likeIcon} size={25} color={likeIconColor} />
                    <InteractionText active={item.liked}>{likeText}</InteractionText>
                </Interaction>
                <Interaction>
                    <Ionicons name='chatbubble-outline' size={25} />
                    <InteractionText>{commentText}</InteractionText>
                </Interaction>
            </InteractionWrapper>
        </Card>
    );
};

export default PostCard;

