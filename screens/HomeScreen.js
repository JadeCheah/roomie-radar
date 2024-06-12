import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";

import FormButton from "../components/FormButton";
import { AuthContext } from "../navigation/AuthProvider";

import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  PostText,
  PostImg, 
  InteractionWrapper,
  Interaction, 
  InteractionText,
  Divider
} from "../styles/FeedStyles";

const HomeScreen = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <Container>
      <Card>
        <UserInfo>
          <UserImg
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfxKrisa64Yr_xzXgeGpvbXEhMk_P7kja7pw&s",
            }}
          />
          <UserInfoText>
            <UserName>Jade Cutie</UserName>
            <PostTime>right now</PostTime>
          </UserInfoText>
        </UserInfo>
        <PostText>Hello Im Jade baby-bean, I love CS and my teammate Maria</PostText>
        <PostImg source={{uri: 'https://static.printler.com/cache/d/5/4/4/b/9/d544b9370bbb4f8c328c3e7dea9d9f5a50e313ee.jpg'}}/>
        <Divider/>
        <InteractionWrapper>
            <Interaction>
                <Ionicons name='heart-outline' size={25}/>
                <InteractionText>12 Likes</InteractionText>
            </Interaction>
            <Interaction>
                <Ionicons name='chatbubble-outline' size={25}/>
                <InteractionText>Comment</InteractionText>
            </Interaction>
            <Interaction>
                <Ionicons name='heart-outline' size={25}/>
                <InteractionText>Like</InteractionText>
            </Interaction>
        </InteractionWrapper>
      </Card>
      <FormButton buttonTitle="Logout" onPress={() => logout()} />
    </Container>
  );
};

export default HomeScreen;
