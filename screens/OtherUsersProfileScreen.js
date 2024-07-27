import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { firestore } from '../firebaseConfig';
import { doc, getDoc, query, collection, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../navigation/AuthProvider';

const OtherUsersProfileScreen = ({ route }) => {
    const { userId } = route.params;
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { user } = useAuth();

    useEffect(() => {
        const getUserProfile = async () => {
            setLoading(true);
            const userRef = doc(firestore, 'users', userId);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                setUserProfile({ ...docSnap.data(), userId: docSnap.id });
            } else {
                console.log("No such document!");
            }
            setLoading(false);
        };

        getUserProfile();
    }, [userId]);

    const findOrCreateConversation = async (user1Id, user2Id) => {
        if (user1Id === user2Id) {
            Alert.alert("Error", "You can't start a conversation with yourself.");
            return;
        }

        const sortedIds = [user1Id, user2Id].sort();
        const conversationsRef = collection(firestore, 'conversations');
        const q = query(conversationsRef, where("participantIds", '==', sortedIds));

        try {
            const querySnapshot = await getDocs(q);
            let conversationId;
            let recipientName = userProfile.userName;

            if (!querySnapshot.empty) {
                // Conversation exists
                conversationId = querySnapshot.docs[0].id;
            } else {
                // No existing conversation, create a new one
                const newConversationRef = await addDoc(conversationsRef, {
                    participantIds: sortedIds,
                    participantNames: [user.displayName, recipientName],
                    lastMessage: "",
                    lastMessageTime: serverTimestamp()
                });
                conversationId = newConversationRef.id;
            }

            navigation.navigate('ChatScreen', {
                conversationId,
                recipientId: user2Id,
                recipientName
            });
        } catch (error) {
            console.error("Error finding or creating conversation:", error);
            Alert.alert("Error", "Failed to start conversation. Please try again.");
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <ImageBackground 
                source={require('../assets/orange-gradient.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.profileCard}>
                        <Image source={{ uri: userProfile.profilePhoto }} style={styles.userImg} />
                        <Text style={styles.userName}>{userProfile.userName}</Text>
                        <Text style={styles.userTitle}>{userProfile.userIntro || ""}</Text>
                        {user.uid !== userId && (
                            <TouchableOpacity 
                                style={styles.userBtn} 
                                onPress={() => findOrCreateConversation(user.uid, userId)}
                            >
                                <Text style={styles.userBtnText}>Send message</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

// ... (styles remain the same)

export default OtherUsersProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        height  : '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
        marginTop: 50,
    },
    userImg: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginTop: -70,  // Adjust based on the height of the image
        borderWidth: 5,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 4,
    },
    userTitle: {
        fontSize: 16,
        color: '#666',
    },
    userBtn: {
        backgroundColor: '#2e64e5',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    userBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});



//     return (
//         <ScrollView style={styles.container}>
//             <Image source={{ uri: userProfile.profilePhoto }} style={styles.userImg} />
//             <Text style={styles.userName}>{userProfile.userName}</Text>
//             <Text style={styles.userBio}>{userProfile.userBio || "No bio available"}</Text>
//             {/* Add additional user information and interactions as needed */}
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#FFF'
//     },
//     userImg: {
//         width: 120,
//         height: 120,
//         borderRadius: 60,
//         alignSelf: 'center',
//         marginTop: 20
//     },
//     userName: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         marginTop: 10,
//         textAlign: 'center'
//     },
//     userBio: {
//         fontSize: 16,
//         color: '#666',
//         marginTop: 10,
//         textAlign: 'center'
//     }
// });

// export default OtherUsersProfileScreen;