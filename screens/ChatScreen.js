import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import {useAuth } from '../navigation/AuthProvider';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../components/ChatList';
import { getDocs, query, where } from 'firebase/firestore';
import { auth, firestore, usersRef } from '../firebaseConfig'; 
import {getAuth} from 'firebase/auth';

if (!firestore) {
  console.error("Firestore is undefined");
} else {
  console.log("Firestore is defined");
}


const ChatScreen = () => {
 // const { logout, user } = useAuth();
  const [users, setUsers] = useState([]);
  //const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    console.log('Current user:', user);
    if (user) {
      getUsers();
    } else {
      console.log('No user logged in');
    }
  }, [user]); // Re-run when user state changes
  
  
  const getUsers = async () => {
  
    try {
      const q = query(usersRef, where('uid', '!=', user?.uid)); // Assuming 'userId' correctly points to user IDs in documents.
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data()); // This will help you verify the structure and content of fetched documents.
        data.push({
          id: doc.id,
          profilePhoto: doc.data().profilePhoto,
          userIntro: doc.data().userIntro,
          userName: doc.data().userName,
          ...doc.data() // Add other fields as necessary
        });
      });
      console.log('got users:', data);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }  
  };

  
  

  console.log('user data: ', user);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="light" />
      {users.length > 0 ? (
        <ChatList users={users} />
      ) : (
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

export default ChatScreen;

const styles = StyleSheet.create({
  centeredView: {
    alignItems: 'center', // This replaces 'items-center'
    top: hp(30),           // Moves the View down by 30% of the screen height
  },
});
