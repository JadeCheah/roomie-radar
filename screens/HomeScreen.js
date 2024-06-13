import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList} from "react-native";

import FormButton from "../components/FormButton";
import { AuthContext } from "../navigation/AuthProvider";
import PostCard from '../components/PostCard';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {
    Container,
  } from "../styles/FeedStyles";

const Posts = [
    {
      id: '1',
      userName: 'Jenny Doe',
      userImg: require('../assets/onboarding_1.png'),
      postTime: '4 mins ago',
      post:
        'Hey there, this is my test for a post of my social app in React Native.',
      postImg: require('../assets/onboarding_1.png'),
      liked: true,
      likes: '14',
      comments: '5',
    },
    {
      id: '2',
      userName: 'John Doe',
      userImg: require('../assets/onboarding2.webp'),
      postTime: '2 hours ago',
      post:
        'Hey there, this is my test for a post of my social app in React Native.',
      postImg: 'none',
      liked: false,
      likes: '8',
      comments: '0',
    },
]


const HomeScreen = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <Container>
      <FlatList 
      data ={Posts}
      renderItem = {({item}) => <PostCard item = {item}/>}
      keyExtractor={item=>item.id}
      showsVerticalScrollIndicator = {false}
      />
      <FormButton buttonTitle="Logout" onPress={() => logout()} />
    </Container>
  );
};

export default HomeScreen;
