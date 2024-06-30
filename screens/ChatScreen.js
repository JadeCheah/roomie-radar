import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../navigation/AuthProvider';
import { firestore } from '../firebaseConfig';


const ChatScreen = ({ route }) => {
 const [messages, setMessages] = useState([]);
 const { user } = useAuth();
 const { conversationId, recipientId, recipientName } = route.params;


 useEffect(() => {
   const messagesRef = collection(firestore, `conversations/${conversationId}/messages`);
   const q = query(messagesRef, orderBy('createdAt', 'asc'));


   const unsubscribe = onSnapshot(q, (snapshot) => {
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
     setMessages(GiftedChat.append(messages, incomingMessages));
   });


   return () => unsubscribe();
 }, [conversationId]);


 function useMessages(conversationId) {
   const [messages, setMessages] = useState([]);
    useEffect(() => {
     const messagesRef = collection(firestore, `conversations/${conversationId}/messages`);
     const q = query(messagesRef, orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
       const fetchedMessages = snapshot.docs.map(doc => ({
         id: doc.id,
         ...doc.data()
       }));
       setMessages(fetchedMessages);
     });
      return () => unsubscribe();  // Clean up the listener when the component unmounts
   }, [conversationId]);
    return messages;
 }


 // const onSend = useCallback(async (messages = []) => {
 //   messages.forEach(async message => {
 //     const messageData = {
 //       text: message.text,
 //       createdAt: serverTimestamp(),
 //       senderId: user.uid,
 //       senderName: user.displayName,
 //       senderProfilePhoto: user.photoURL,
 //     };
 //     // Add message to the messages sub-collection
 //     const newMessageRef = await addDoc(collection(firestore, `conversations/${conversationId}/messages`), messageData);


 //     // Check if conversation exists and update or create it
 //     const conversationRef = doc(firestore, `conversations/${conversationId}`);
 //     const conversationSnap = await getDoc(conversationRef);
 //     if (conversationSnap.exists()) {
 //       // Update the existing conversation
 //       await updateDoc(conversationRef, {
 //         lastMessage: message.text,
 //         lastMessageTime: serverTimestamp()
 //       });
 //     } else {
 //       // Create a new conversation if not exists (adjust fields as needed)
 //       await setDoc(conversationRef, {
 //         participantIds: [user.uid, recipientId], // Example: Adjust based on your app logic
 //         participantNames: [user.displayName, recipientName], // Example: Adjust as needed
 //         lastMessage: message.text,
 //         lastMessageTime: serverTimestamp()
 //       });
 //     }
 //   });
 // }, [conversationId, user, recipientId, recipientName]);
  const onSend = useCallback(async (messages = []) => {
   messages.forEach(async message => {
     const messageData = {
       text: message.text,
       createdAt: serverTimestamp(),
       senderId: user.uid,
       senderName: user.displayName,
       senderProfilePhoto: user.photoURL,
     };
      // Fetch all conversations where the current user is a participant
     const conversationsRef = collection(firestore, 'conversations');
     const q = query(conversationsRef, where("participantIds", "array-contains", user.uid));
     const querySnapshot = await getDocs(q);
     let conversationFound = false;
     let existingConversationId = null;
      // Manually check each conversation to find if the recipient is also a participant
     querySnapshot.forEach(doc => {
       const participants = doc.data().participantIds;
       if (participants.includes(recipientId) && participants.length === 2) {
         conversationFound = true;
         existingConversationId = doc.id;
       }
     });
      if (conversationFound && existingConversationId) {
       // Add message to the existing conversation
       await addDoc(collection(firestore, `conversations/${existingConversationId}/messages`), messageData);
       // Update the existing conversation
       await updateDoc(doc(firestore, `conversations/${existingConversationId}`), {
         lastMessage: message.text,
         lastMessageTime: serverTimestamp()
       });
     } else {
       // Create a new conversation if it does not exist
       const newConversationRef = await addDoc(conversationsRef, {
         participantIds: [user.uid, recipientId],
         participantNames: [user.displayName, recipientName],
         lastMessage: message.text,
         lastMessageTime: serverTimestamp()
       });
       // Add the first message to the new conversation
       await addDoc(collection(firestore, `conversations/${newConversationRef.id}/messages`), messageData);
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



