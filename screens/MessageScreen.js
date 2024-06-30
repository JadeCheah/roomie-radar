
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { firestore } from '../firebaseConfig'; 
import { query, collection, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../navigation/AuthProvider';

const MessageScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const { user } = useAuth();  // Fetching the current authenticated user

    const initiateConversation = async (email) => {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', email));
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const userId = querySnapshot.docs[0].id;
            
            // Optionally check for an existing conversation or create a new one
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

        const q = query(collection(firestore, 'users'), orderBy('userName', 'desc'));


        // const q = query(
        //     conversationsRef,
        //     where("participantIds", "array-contains", user.uid),
        //     orderBy("lastMessageTime", "desc")
        // );
    
        const unsubscribe = onSnapshot(q, snapshot => {
            const fetchedChats = snapshot.docs.map(doc => ({
                id: doc.id,
                userName: "Conversation", // You need another query to fetch user details unless stored in each conversation
                lastMessage: doc.data().lastMessage,
                lastMessageTime: doc.data().lastMessageTime
            }));
            setChats(fetchedChats);
        });
    
        return () => unsubscribe();
    }, [user]);

    const goToChat = (userId, userName) => {
        navigation.navigate('ChatScreen', {
            recipientId: userId,
            recipientName: userName
        });
    };
    

    return (
        <View style={StyleSheet.container}>
            <TouchableOpacity onPress={promptForEmail} style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        <FlatList
            data={chats}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Chat', {
                        recipientId: item.id,
                        recipientName: item.userName
                    })}
                >
                    <Text>{item.userName}</Text>
                    <Text>{item.lastMessage}</Text>
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
