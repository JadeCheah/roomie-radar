

import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { firestore } from '../firebaseConfig';
import { query, collection, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../navigation/AuthProvider';


const MessageScreen = ({ navigation }) => {
   const [chats, setChats] = useState([]);
   const { user } = useAuth();


   const initiateConversation = async (email) => {
       const usersRef = collection(firestore, 'users');
       const q = query(usersRef, where('email', '==', email));
       const querySnapshot = await getDocs(q);
      
       if (!querySnapshot.empty) {
           const userData = querySnapshot.docs[0].data();
           const userId = querySnapshot.docs[0].id;
           navigation.navigate('ChatScreen', {
               recipientId: userId,
               recipientName: userData.displayName || "Unknown",
           });
       } else {
           Alert.alert("Invalid email", "No user found with this email address.");
       }
   };


   const promptForEmail = () => {
       Alert.prompt(
           'Start New Conversation',
           'Enter the email address of the user:',
           [
               {
                   text: 'Cancel',
                   style: 'cancel',
               },
               {
                   text: 'OK',
                   onPress: email => initiateConversation(email),
               },
           ],
           'plain-text'
       );
   };


   useEffect(() => {
       if (!user) return;
       const conversationsRef = collection(firestore, 'conversations');
       const q = query(conversationsRef, where("participantIds", "array-contains", user.uid), orderBy("lastMessageTime", "desc"));


       const unsubscribe = onSnapshot(q, snapshot => {
           const fetchedChats = snapshot.docs.map(doc => ({
               id: doc.id,
               userName: doc.data().participantNames.join(', '), // assuming participantNames is an array of names
               lastMessage: doc.data().lastMessage,
               lastMessageTime: doc.data().lastMessageTime ? doc.data().lastMessageTime.toDate() : new Date() // Fallback to current date if null
           }));
           setChats(fetchedChats);
       });


       return () => unsubscribe();
   }, [user]);


   return (
       <View style={styles.container}>
           <TouchableOpacity onPress={promptForEmail} style={styles.addButton}>
               <Text style={styles.addButtonText}>+</Text>
           </TouchableOpacity>
           <FlatList
               data={chats}
               keyExtractor={item => item.id}
               renderItem={({ item }) => (
                   <TouchableOpacity
                       onPress={() => navigation.navigate('ChatScreen', {
                           recipientId: item.id,
                           recipientName: item.userName
                       })}
                   >
                       <Text style={styles.userName}>{item.userName}</Text>
                       <Text style={styles.lastMessage}>{item.lastMessage}</Text>
                   </TouchableOpacity>
               )}
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
