import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../navigation/AuthProvider';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, runTransaction, doc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import CommentItem from '../components/CommentItem';
import { GiftedChat } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CommentScreen = ({ route }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const { user } = useAuth();
  const { postId } = route.params;

  useEffect(() => {
    const commentsRef = collection(firestore, `posts/${postId}/comments`);
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const incomingComments = snapshot.docs.map(doc => ({
        _id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().createdAt,
        userName: doc.data().userName
      }));
      setComments(prevComments => GiftedChat.append(prevComments, incomingComments));
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSend = async () => {
    if (text.trim()) {
      const postRef = doc(firestore, `posts/${postId}`);
      const newCommentRef = doc(collection(firestore, `posts/${postId}/comments`));

      await runTransaction(firestore, async (transaction) => {
        const postSnapshot = await transaction.get(postRef);
        const currentCount = postSnapshot.data().commentsCount || 0;
        transaction.set(newCommentRef, {
          text: text.trim(),
          createdAt: serverTimestamp(),
          userId: user.uid,
          userName: user.displayName || "Anonymous",
        });
        transaction.update(postRef, {
          commentsCount: currentCount + 1
        });
      });

      setText('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <FlatList
        data={comments}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <CommentItem comment={item} />}
        inverted
        style={styles.commentsList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Write a comment..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <MaterialCommunityIcons name="send-circle" size={44} color="#2e64e5" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFA500',  // Orange background
  },
  commentsList: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',  // White input area
    borderTopWidth: 1,
    borderColor: '#ccc',  // Subtle border for the input area
  },
  input: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f0f0f0',  // Light input field background
    borderRadius: 25,  // Rounded corners for the input field
    fontSize: 16,
  },
  sendButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommentScreen;
