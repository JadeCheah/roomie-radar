import React from 'react';
import { Card, UserInfo, UserImg, UserName, UserInfoText, PostTime, PostText, InteractionWrapper, Interaction, InteractionText } from "../styles/FeedStyles";
import { Image, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PostCard = ({ item }) => {
    const likeIcon = item.liked ? 'heart' : 'heart-outline';
    const likeIconColor = item.liked ? '#2e64e5' : '#333';
    const likeText = item.likes === 1 ? '1 Like' : item.likes > 1 ? `${item.likes} Likes` : 'Like';
    const commentText = item.comments === 1 ? '1 Comment' : item.comments > 1 ? `${item.comments} Comments` : 'Comment';

    return (
        <Card>
            <UserInfo>
                <UserImg source={{ uri: item.userImg }} />
                <UserInfoText>
                    <UserName>{item.userName}</UserName>
                    <PostTime>{item.postTime}</PostTime>
                </UserInfoText>
            </UserInfo>
            {item.postImg && item.postImg !== null && item.postImg.trim() !== '' && (
                <Image
                    source={{ uri: item.postImg }}
                    style={{ width: '100%', height: 200, backgroundColor: 'transparent' }} // Ensure background is transparent
                    resizeMode="cover"
                />
            )}
            <PostText>{item.post}</PostText>
            <InteractionWrapper>
                <Interaction active={item.liked}>
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
