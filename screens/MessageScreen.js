import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet, Alert, Image, ImageBackground } from 'react-native';
import { firestore } from '../firebaseConfig';
import { query, collection, where, onSnapshot, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../navigation/AuthProvider';
import { formatDistanceToNow } from 'date-fns';

const MessageScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({});

  const fetchUserInfo = useCallback(async (userId) => {
    if (userInfo[userId]) return userInfo[userId];

    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const newUserInfo = {
        userName: userData.userName || 'Unknown',
        profilePhoto: userData.profilePhoto || require('../assets/default-photo.jpeg')
      };
      setUserInfo(prev => ({ ...prev, [userId]: newUserInfo }));
      return newUserInfo;
    }
    return { userName: 'Unknown', profilePhoto: require('../assets/default-photo.jpeg') };
  }, [userInfo]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      query(collection(firestore, 'conversations'), where("participantIds", "array-contains", user.uid), orderBy("lastMessageTime", "desc")),
      async (snapshot) => {
        const fetchedChats = await Promise.all(snapshot.docs.map(async doc => {
          const data = doc.data();
          const otherParticipantId = data.participantIds.find(id => id !== user.uid);
          const otherParticipantInfo = await fetchUserInfo(otherParticipantId);
          return {
            id: doc.id,
            ...data,
            otherParticipantInfo,
            lastMessageTime: data.lastMessageTime ? formatDistanceToNow(data.lastMessageTime.toDate()) + ' ago' : 'No date'
          };
        }));
        setChats(fetchedChats);
      }
    );

    return () => unsubscribe();
  }, [user, fetchUserInfo]);

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

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ChatScreen', {
        conversationId: item.id,
        recipientId: item.participantIds.find(id => id !== user.uid),
        recipientName: item.otherParticipantInfo.userName
      })}
      style={styles.chatItem}
    >
      <Image 
        source={typeof item.otherParticipantInfo.profilePhoto === 'string' 
          ? { uri: item.otherParticipantInfo.profilePhoto } 
          : item.otherParticipantInfo.profilePhoto} 
        style={styles.profilePic} 
      />
      <View style={styles.messageContainer}>
        <Text style={styles.userName}>{item.otherParticipantInfo.userName}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage} - {item.lastMessageTime}</Text>
      </View>
    </TouchableOpacity>
  );

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
        renderItem={renderChatItem}
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
    right: 20,
    bottom: 20,  
    zIndex: 1,
    borderRadius: 20,
    backgroundColor: '#2e64e5',  
  },
  addButtonText: {
    fontSize: 40,
    color: '#ffffff'
  },
  chatItem: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
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
    backgroundColor: '#ddd',
    marginLeft: 60
  }
});

export default MessageScreen;

