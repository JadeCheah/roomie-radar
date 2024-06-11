import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import FormButton from "../components/FormButton";
import { AuthContext } from "../navigation/AuthProvider";
import { Container, Card, UserInfo, UserImg, UserName, UserInfoText, PostTime } from "../styles/FeedStyles";

const HomeScreen = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <Container>
      <Card>
        <UserInfo>
            <UserImg source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfxKrisa64Yr_xzXgeGpvbXEhMk_P7kja7pw&s' }}/>
            <UserInfoText>
                <UserName>Jade Cutie</UserName>
                <PostTime>right now</PostTime>
            </UserInfoText>
        </UserInfo>
      </Card>
    </Container>
  );
};

export default HomeScreen;


