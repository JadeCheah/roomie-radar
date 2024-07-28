import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, getDocs, updateDoc, where } from 'firebase/firestore';
import { useAuth } from '../navigation/AuthProvider';
import { firestore } from '../firebaseConfig';

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const { conversationId, recipientId, recipientName } = route.params;

  useEffect(() => {
    console.log(`[ChatScreen] Setting up snapshot listener for conversation ${conversationId}`);
    const messagesRef = collection(firestore, `conversations/${conversationId}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`[ChatScreen] Received ${snapshot.docs.length} new messages from Firestore.`);
      const incomingMessages = snapshot.docs.map(doc => ({
        _id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
        user: {
          _id: doc.data().senderId,
          name: doc.data().senderName,
          avatar: doc.data().senderProfilePhoto,
        },
      }));
      setMessages(previousMessages => {
        const newUniqueMessages = incomingMessages.filter(inMsg => !previousMessages.some(pm => pm._id === inMsg._id));
        return GiftedChat.append(previousMessages, newUniqueMessages);
      });
    });

    return () => {
      console.log("[ChatScreen] Cleaning up messages listener.");
      unsubscribe();
    };
  }, [conversationId]);

  const onSend = useCallback(async (messages = []) => {
    console.log(`[ChatScreen] Attempting to send ${messages.length} messages.`);
    messages.forEach(async message => {
      const messageData = {
        text: message.text,
        createdAt: serverTimestamp(),
        senderId: user.uid,
        senderName: user.displayName,
        senderProfilePhoto: user.photoURL,
      };

      const participantIds = [user.uid, recipientId].sort();
      console.log("[ChatScreen] Participant IDs sorted:", participantIds);

      const conversationsRef = collection(firestore, 'conversations');
      const q = query(conversationsRef, where("participantIds", '==', participantIds));

      try {
        const querySnapshot = await getDocs(q);
        let existingConversationId = null;

        querySnapshot.forEach(doc => {
          if (doc.data().participantIds.length === 2) {
            existingConversationId = doc.id;
            console.log(`[ChatScreen] Found existing conversation: ${existingConversationId}`);
          }
        });

        if (existingConversationId) {
          console.log(`[ChatScreen] Adding message to existing conversation ${existingConversationId}`);
          await addDoc(collection(firestore, `conversations/${existingConversationId}/messages`), messageData);
          await updateDoc(doc(firestore, `conversations/${existingConversationId}`), {
            lastMessage: message.text,
            lastMessageTime: serverTimestamp()
          });
        } else {
          console.log("[ChatScreen] No existing conversation found. Creating new one.");
          const newConversationRef = await addDoc(conversationsRef, {
            participantIds,
            participantNames: [user.displayName, recipientName],
            lastMessage: message.text,
            lastMessageTime: serverTimestamp()
          });
          console.log(`[ChatScreen] New conversation created with ID: ${newConversationRef.id}`);
          await addDoc(collection(firestore, `conversations/${newConversationRef.id}/messages`), messageData);
        }
      } catch (error) {
        console.error("[ChatScreen] Failed to send message or create conversation:", error);
      }
    });
  }, [user, recipientId, recipientName]);

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
    <MaterialCommunityIcons name="chevron-double-down" size=
    {22} color="#333" />
  );

  return (
    <ImageBackground 
      source={require('../assets/orange-gradient.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{ _id: user.uid, name: user.displayName, avatar: user.photoURL }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container expands to fill the screen
    backgroundColor: 'transparent' // Ensures the ImageBackground shows through
  }
});

export default ChatScreen;
