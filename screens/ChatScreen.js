import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../navigation/AuthProvider';
import { firestore } from '../firebaseConfig'; 

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const { recipientId, recipientName } = route.params;

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    messages.forEach(async message => {
      try {
        console.log(user);  // See what properties are available
        await addDoc(collection(firestore, 'messages'), {
          text: message.text,
          createdAt: serverTimestamp(),
          senderId: user.uid,  
          recipientId: recipientId,
          recipientName: recipientName,
           senderName: user.displayName,  
          senderProfilePhoto: user.photoURL,
        });
      } catch (error) {
        console.error("Error adding message to Firestore:", error);
      }
    });
  }, [recipientId, user]);

  const renderSend = (props) => (
    <Send {...props}>
      <View style={{ marginBottom: 5, marginRight: 5 }}>
        <MaterialCommunityIcons name="send-circle" size={32} color="#2e64e5" />
      </View>
    </Send>
  );

  const renderBubble = (props) => (
    <Bubble {...props} wrapperStyle={{ right: { backgroundColor: '#2e64e5' } }} textStyle={{ right: { color: '#fff' } }} />
  );

  const scrollToBottomComponent = () => (
    <MaterialCommunityIcons name="chevron-double-down" size={22} color="#333" />
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{ _id: user.uid, name: user.displayName, avatar: user.photoURL }}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
    />
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

