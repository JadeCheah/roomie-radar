import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, ImageBackground, TouchableOpacity } from 'react-native';
import { firestore } from '../firebaseConfig'; // Adjust based on your project structure
import { doc, getDoc, query, collection, where, getDocs} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../navigation/AuthProvider';


const OtherUsersProfileScreen = ({ route }) => {
    const { userId } = route.params;
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { user } = useAuth();


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

const findOrCreateConversation = async (user1Id, user2Id) => {
  const sortedIds = [user1Id, user2Id].sort();
  const conversationsRef = collection(firestore, 'conversations');
  const q = query(conversationsRef, where("participantIds", '==', sortedIds));

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    // Conversation exists
    const conversation = querySnapshot.docs[0];
    return conversation.id;
  } else {
    // No existing conversation, create a new one
    return await initiateConversation(sortedIds);
  }
};

    

    useEffect(() => {
        const getUserProfile = async () => {
            setLoading(true);
            const userRef = doc(firestore, 'users', userId);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                setUserProfile(docSnap.data());
            } else {
                console.log("No such document!");
            }
            setLoading(false);
        };

        getUserProfile();
    }, [userId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }
    console.log(userProfile);
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
                        <TouchableOpacity style={styles.userBtn} onPress={() => navigation.navigate('Edit Profile')}>
                            <Text style={styles.userBtnText}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.userBtn} onPress={() => findOrCreateConversation(userProfile.userId, user.userId)}>
                            <Text style={styles.userBtnText}>Send message</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

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

export default OtherUsersProfileScreen;


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