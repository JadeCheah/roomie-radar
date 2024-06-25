import React, { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChatHeader from '../components/ChatHeader'; 
import { GiftedChat } from "react-native-gifted-chat";


const MessageScreen = () => {
    return (
        <View style={{ flex: 1 }}>
            <ChatHeader />
            <Text>Hello from ChatScreen</Text>
        </View>
    ); 
};

export default MessageScreen;
