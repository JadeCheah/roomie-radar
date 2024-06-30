import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { firestore } from '../firebaseConfig';
import { query, collection, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../navigation/AuthProvider';

const MessageScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const { user } = useAuth();
  const [selectedRecipientId, setSelectedRecipientId] = useState(null);  // Manage selected recipient ID

  useEffect(() => {
    console.log("Checking user authentication status...");
    if (!user) {
      console.log("No user authenticated.");
      return;
    }

    console.log("User authenticated. Setting up subscription for chat conversations...");
    const conversationsRef = collection(firestore, 'conversations');
    const participantIds = user && selectedRecipientId ? [user.uid, selectedRecipientId].sort() : [];
    const q = participantIds.length > 0 
      ? query(conversationsRef, where("participantIds", '==', participantIds))
      : query(conversationsRef, where("participantIds", "array-contains", user.uid), orderBy("lastMessageTime", "desc"));

    const unsubscribe = onSnapshot(q, snapshot => {
      console.log(`Received ${snapshot.docs.length} conversations update.`);
      const fetchedChats = snapshot.docs.map(doc => ({
        id: doc.id,
        participantNames: doc.data().participantNames,
        participantIds: doc.data().participantIds,
        lastMessage: doc.data().lastMessage,
        lastMessageTime: doc.data().lastMessageTime ? doc.data().lastMessageTime.toDate() : new Date()
      }));
      console.log("Updated chats state with fetched conversations.");
      setChats(fetchedChats);
    });

    return () => {
      console.log("Unsubscribing from chat conversations...");
      unsubscribe();
    };
  }, [user, selectedRecipientId]);

  const initiateConversation = async (email) => {
    console.log(`Initiating conversation with user by email: ${email}`);
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      const userId = querySnapshot.docs[0].id;
      console.log(`User found: ${userId}. Navigating to ChatScreen.`);
      navigation.navigate('ChatScreen', {
        recipientId: userId,
        recipientName: userData.displayName || "Unknown",
      });
    } else {
      console.log("No user found with the given email.");
      Alert.alert("Invalid email", "No user found with this email address.");
    }
  };

  const promptForEmail = () => {
    console.log("Displaying prompt for user email.");
    Alert.prompt(
      'Start New Conversation',
      'Enter the email address of the user:',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => console.log("User cancelled email input.") },
        { text: 'OK', onPress: email => initiateConversation(email) },
      ],
      'plain-text'
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={promptForEmail} style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const otherParticipantId = item.participantIds.find(id => id !== user.uid);
          const otherParticipantIndex = item.participantIds.indexOf(otherParticipantId);
          const otherParticipantName = item.participantNames[otherParticipantIndex];
          console.log(`Rendering chat with ID: ${item.id}`);
          return (
            <TouchableOpacity
              onPress={() => {
                console.log(`Navigating to ChatScreen with conversation ID: ${item.id}`);
                navigation.navigate('ChatScreen', {
                  conversationId: item.id,
                  recipientId: otherParticipantId,
                  recipientName: otherParticipantName
                })
              }}
            >
              <Text style={styles.userName}>{otherParticipantName}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  addButton: {
    padding: 10,
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1
  },
  addButtonText: {
    fontSize: 24,
    color: '#2e64e5'
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  lastMessage: {
    fontSize: 14,
    color: '#666'
  }
});
