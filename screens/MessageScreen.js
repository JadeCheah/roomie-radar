import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet, Alert, Image, ImageBackground } from 'react-native';
import { firestore } from '../firebaseConfig';
import { query, collection, where, onSnapshot, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../navigation/AuthProvider';
import { formatDistanceToNow } from 'date-fns';

const MessageScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const { user } = useAuth();
  const [userPhotos, setUserPhotos] = useState({});

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      query(collection(firestore, 'conversations'), where("participantIds", "array-contains", user.uid), orderBy("lastMessageTime", "desc")),
      (snapshot) => {
        const fetchedChats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastMessageTime: doc.data().lastMessageTime ? formatDistanceToNow(doc.data().lastMessageTime.toDate()) + ' ago' : 'No date'
        }));
        setChats(fetchedChats);
        fetchUserPhotos(new Set(fetchedChats.flatMap(chat => chat.participantIds.filter(id => id !== user.uid))));
      }
    );

    return () => unsubscribe();
  }, [user]);

  const fetchUserPhotos = async (userIds) => {
    const photos = {};
    await Promise.all(Array.from(userIds).map(async userId => {
      const photoUrl = await fetchPhotoById(userId);
      photos[userId] = photoUrl;
    }));
    setUserPhotos(photos);
  };

  const fetchPhotoById = async (userId) => {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data().profilePhoto || '' : '';
  };

  const promptForEmail = () => {
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

  const initiateConversation = async (email) => {
    const q = query(collection(firestore, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      const userId = querySnapshot.docs[0].id;
      navigation.navigate('ChatScreen', {
        recipientId: userId,
        recipientName: userData?.userName || "Unknown",
      });
    } else {
      Alert.alert("Invalid email", "No user found with this email address.");
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/orange-gradient.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity onPress={promptForEmail} style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const otherParticipantId = item.participantIds.find(id => id !== user.uid);
          const otherParticipantName = item.participantNames[item.participantIds.indexOf(otherParticipantId)];
          const otherParticipantPhoto = userPhotos[otherParticipantId] || '../assets/default-photo.jpeg';
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('ChatScreen', {
                conversationId: item.id,
                recipientId: otherParticipantId,
                recipientName: otherParticipantName
              })}
              style={styles.chatItem}
            >
              <Image source={{ uri: otherParticipantPhoto }} style={styles.profilePic} />
              <View style={styles.messageContainer}>
                <Text style={styles.userName}>{otherParticipantName}</Text>
                <Text style={styles.lastMessage}>{item.lastMessage} - {item.lastMessageTime}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ImageBackground>
  );
};

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
    zIndex: 1,
    borderRadius: 20,
    backgroundColor: '#FF7E5F', // Matching the aesthetic of the '+' button on HomeScreen
  },
  addButtonText: {
    fontSize: 24,
    color: '#ffffff'
  },
  chatItem: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff', // Light grey background for each chat item
    alignItems: 'center',
    borderRadius: 10, // Rounded corners for chat items
    marginBottom: 10, // Space between chat items
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  lastMessage: {
    fontSize: 14,
    color: '#666'
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd', // Separator color
    marginLeft: 60 // Indentation for the separator
  }
});

export default MessageScreen;
