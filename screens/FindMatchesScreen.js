import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { auth, firestore, usersRef } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc, collectionGroup } from 'firebase/firestore';
// import { SearchBar } from 'react-native-elements';
import { defaultProfilePhoto } from '../navigation/UserProfileContext';
import { calculateMatchScore } from '../misc/matchCalculator';
import { RotationGestureHandler } from 'react-native-gesture-handler';


const FindMatchesScreen = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchUserPreferences = async (userId) => {
        try {
            const mainDocRef = doc(firestore, 'users', userId, 'preferences', 'main');
            const sleepDocRef = doc(firestore, 'users', userId, 'preferences', 'sleep');

            const mainDoc = await getDoc(mainDocRef);
            const sleepDoc = await getDoc(sleepDocRef);

            if (!mainDoc.exists() || !sleepDoc.exists()) {
                console.error(`Preferences missing for user: ${userId}`);
                return null;
            }
            console.log(`Fetched preferences for user: ${userId}`);
            return {
                main: mainDoc.data(),
                sleep: sleepDoc.data()
            };
        } catch (error) {
            console.error(`Error fetching preferences for user: ${userId}`, error);
            return null;
        }
    };

    const fetchMatches = async () => {
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) return;

            const userDocRef = doc(firestore, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();

            if (!userData) {
                console.error('User data is missing', user.uid);
                return;
            }

            const userPreferences = await fetchUserPreferences(user.uid);
            if (!userPreferences) {
                console.error('User preferences are missing or malformed:', userData);
                return;
            }

            const { gender, housing } = userPreferences.main;

            if (!gender || !housing) {
                console.error('User main preferences are missing or incomplete:', mainPreferences);
                return;
            }
            
            console.log(`${gender} & ${housing} extracted from userPreferences.main`);

            // const usersRef = collection(firestore, "users");
            // const q = query(usersRef,
            //     where("preferences.main.gender", "==", gender),
            //     where("preferences.main.housing", "==", housing)
            // );

            // console.log("Query created:", q);

            // const querySnapshot = await getDocs(q);

            // console.log("QuerySnapshot size:", querySnapshot.size);
            //-------------------------------------------------------------
            // Query the users collection directly
            const q = query(collection(firestore, 'users'));

            console.log("Query created:", q); // Debugging statement

            const querySnapshot = await getDocs(q);

            console.log("Query snapshot size:", querySnapshot.size); // Debugging statement
            //--------------------------------------------------------------
            const matchesData = [];

            for (const docSnapshot of querySnapshot.docs) {
                const otherUserId = docSnapshot.id;
                console.log("Processing document:", otherUserId); // Debugging statement
                if (otherUserId !== user.uid) {
                    const otherUserData = docSnapshot.data();
                    const otherUserPreferences = await fetchUserPreferences(otherUserId);

                    if (!otherUserPreferences) {
                        console.error('Preferences are missing for user:', otherUserId);
                        continue;
                    }

                    if (otherUserPreferences.main.gender === gender && otherUserPreferences.main.housing === housing) {
                        const matchScore = calculateMatchScore({ ...userData, preferences: userPreferences }, { ...otherUserData, preferences: otherUserPreferences });
                        matchesData.push({
                            userId: otherUserId,
                            userName: otherUserData.userName || 'Unknown',
                            profilePhoto: otherUserData.profilePhoto || defaultProfilePhoto,
                            matchPercentage: matchScore
                        });
                        console.log(`${otherUserId} is pushed to matches with score: ${matchScore}`);
                    }
                }
            }

            matchesData.sort((a, b) => b.matchPercentage - a.matchPercentage);
            setMatches(matchesData);
        } catch (error) {
            console.error('Error finding matches: ', error);
        } finally {
            setLoading(false);
        }
    };

    const renderUserItem = ({ item }) => {
        return (
            <View style={styles.userItem}>
                <Image source={{ uri: item.profilePhoto }} style={styles.profilePic} />
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{item.userName}</Text>
                    {/* <Text>{item.userIntro}</Text> */}
                    <Text>Match: {item.matchPercentage}%</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => { }}>
                    <Text style={styles.addButtonText}>Add Friend</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <ImageBackground
                source={require('../assets/orange-gradient.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.center}>
                    <ActivityIndicator size='large' color='white' />
                    <Text style={styles.caption}>Loading matches.... this might take a while</Text>
                </View>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground
            source={require('../assets/orange-gradient.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                {/* <Text style={styles.title}>Recommended Matches</Text>
            {matches.length === 0 ? (
                <Text style={styles.caption}>No available matches yet!</Text>
            ) : (
                <FlatList data={matches} renderItem={renderUserItem} keyExtractor={item => item.userId} />
            )} */}
                <FlatList data={matches} renderItem={renderUserItem} keyExtractor={item => item.userId} />
            </View>
        </ImageBackground>
    );
};

export default FindMatchesScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent overlay
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#2e64e5',
        fontWeight: 'bold',
        marginBottom: 16,
        alignSelf: 'center',
    },
    caption: {
        fontSize: 18,
        textAlign: 'center',
        color: 'white',
        paddingTop: 25,
    },
    userItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    userInfo: {
        marginLeft: 10,
        justifyContent: 'center'
    },
    username: {
        fontWeight: 'bold'
    },
    addButton: {
        marginLeft: 'auto',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    addButtonText: {
        color: '#fff'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});