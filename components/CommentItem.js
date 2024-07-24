import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatRelative } from 'date-fns'; // A utility function to format dates relatively

const CommentItem = ({ comment }) => {
    // Format the Firebase timestamp to a JavaScript Date object and then to a relative string
    const commentDate = comment.createdAt ? formatRelative(new Date(comment.createdAt.seconds * 1000), new Date()) : 'just now';

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.userName}>{comment.userName}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
            </View>
            <Text style={styles.dateText}>{commentDate}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        marginRight: 10, // Spacing between the content and the date
    },
    userName: {
        fontWeight: 'bold',
        marginBottom: 4, // Spacing between the username and the comment text
    },
    commentText: {
        color: '#333',
    },
    dateText: {
        fontSize: 12,
        color: '#666',
    }
});

export default CommentItem;
