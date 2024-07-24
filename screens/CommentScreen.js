import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { useAuth } from '../navigation/AuthProvider';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import CommentItem from '../components/CommentItem';

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
      setComments(incomingComments);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSend = async () => {
    if (text) {
      await addDoc(collection(firestore, `posts/${postId}/comments`), {
        text: text,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName || "Anonymous",
      });
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <CommentItem comment={item} />}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Write a comment..."
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    padding: 10,
  },
});


