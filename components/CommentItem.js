import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CommentItem = ({ comment }) => {
  return (
    <View style={styles.commentContainer}>
      <Text style={styles.userName}>{comment.userName}</Text>
      <Text style={styles.commentText}>{comment.text}</Text>
      <Text style={styles.commentDate}>{new Date(comment.createdAt.seconds * 1000).toLocaleDateString("en-US")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: '#e4f2f7',  // Light blue, similar to chat bubble
    borderRadius: 20,
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    alignSelf: 'flex-start', // Align to one side like typical comments
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2e64e5', // Blue to match send button
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#aaa',
    alignSelf: 'flex-end',
  }
});

export default CommentItem;
