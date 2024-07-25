import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { auth, firestore, usersRef } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc, collectionGroup } from 'firebase/firestore';
// import { SearchBar } from 'react-native-elements';
import { defaultProfilePhoto } from '../navigation/UserProfileContext';

// const FindMatchesScreen = () => {
//     const [users, setUsers] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         const user = auth.currentUser;

//         if (user) {
//             const usersRef = firestore.collection('users');
//             const snapshot = await usersRef.where('id', '!=', currentUser.uid).get();

//             const fetchedUsers = snapshot.docs.map(doc => {
//                 const userData = doc.data();
//                 return {
//                     id: doc.id,
//                     username: userData.username || 'Anonymous',
//                     age: userData.age || 'N/A',
//                     gender: userData.gender || 'N/A',
//                     profilePic: userData.profilePic || defaultProfilePhoto,
//                 };
//             });

//             setUsers(fetchedUsers);
//         }
//     };

//     const handleSearch = (query) => {
//         setSearchQuery(query);
//     };

//     const filteredUsers = users.filter(user =>
//         user.username.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const handleAddFriend = (userId) => {
//         // Implement friend request logic here
//         console.log(`Friend request sent to user ${userId}`);
//     };

//     const renderUserItem = ({ item }) => (
//         <View style={styles.userItem}>
//             <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
//             <View style={styles.userInfo}>
//                 <Text style={styles.username}>{item.username}</Text>
//                 <Text>Age: {item.age}, Gender: {item.gender}</Text>
//             </View>
//             <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={() => handleAddFriend(item.id)}
//             >
//                 <Text style={styles.addButtonText}>Add Friend</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     return (
//         <View style={styles.container}>
//             <SearchBar
//                 placeholder="Search users..."
//                 onChangeText={handleSearch}
//                 value={searchQuery}
//                 containerStyle={styles.searchBar}
//             />
//             <FlatList
//                 data={filteredUsers}
//                 renderItem={renderUserItem}
//                 keyExtractor={item => item.id}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5',
//     },
//     searchBar: {
//         backgroundColor: 'transparent',
//         borderTopWidth: 0,
//         borderBottomWidth: 0,
//     },
//     userItem: {
//         flexDirection: 'row',
//         padding: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: '#e0e0e0',
//         alignItems: 'center',
//     },
//     profilePic: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//     },
//     userInfo: {
//         flex: 1,
//         marginLeft: 15,
//     },
//     username: {
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
//     addButton: {
//         backgroundColor: '#4CAF50',
//         padding: 10,
//         borderRadius: 5,
//     },
//     addButtonText: {
//         color: 'white',
//         fontWeight: 'bold',
//     },
// });

// export default FindMatchesScreen;


const FindMatchesScreen = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchUserInfoAndMatches = async () => {
            if (currentUser) {
                try {
                    // Get current user's 'main' preferences document
                    const userMainPreferencesRef = doc(firestore, 'users', currentUser.uid, 'preferences', 'main');
                    const userMainPreferencesSnap = await getDoc(userMainPreferencesRef);
        
                    if (userMainPreferencesSnap.exists()) {
                        const userMainPreferences = userMainPreferencesSnap.data();
                        const { age, gender } = userMainPreferences;
        
                        // Query all user documents
                        const usersQuery = query(
                            collection(firestore, 'users')
                        );
        
                        const querySnapshot = await getDocs(usersQuery);
        
                        const fetchedMatches = [];
                        for (const userDoc of querySnapshot.docs) {
                            // Skip the current user
                            if (userDoc.id === currentUser.uid) continue;
        
                            // Get the 'main' preferences document for this user
                            const mainPreferencesRef = doc(userDoc.ref, 'preferences', 'main');
                            const mainPreferencesSnap = await getDoc(mainPreferencesRef);
        
                            if (mainPreferencesSnap.exists()) {
                                const mainPreferences = mainPreferencesSnap.data();
                                
                                // Check if this user matches the criteria
                                if (mainPreferences.age === age && mainPreferences.gender === gender) {
                                    fetchedMatches.push({
                                        id: userDoc.id,
                                        ...userDoc.data(),
                                        mainPreferences: mainPreferences
                                    });
                                }
                            }
                        }
        
                        setMatches(fetchedMatches);
                        console.log('Matches fetched!');
                    } else {
                        console.log('No main preferences document found for the current user!');
                    }
                } catch (error) {
                    console.error('Error fetching matches: ', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        
        fetchUserInfoAndMatches();
    }, [currentUser]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size='large' color='#0000ff' />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recommended Matches</Text>
            {matches.length === 0 ? (
                <Text style={styles.caption}>No available matches yet!</Text>
            ) : (
                <FlatList
                    data={matches}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.matchItem}>
                            <Text style={styles.matchText}>Name: {item.userName}</Text>
                            <Text style={styles.matchText}>Email: {item.email}</Text>
                            <Text style={styles.matchText}>Housing: {item.housing}</Text>
                            <Text style={styles.matchText}>Gender: {item.gender}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default FindMatchesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        color: '#2e64e5',
        fontWeight: 'bold',
        marginBottom: 16,
        alignSelf: 'center',
    },
    matchItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    matchText: {
        fontSize: 18,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    caption: {
        fontSize: 18,
        textAlign: 'center',
        color: 'gray',
    }
})