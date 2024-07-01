import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { auth, firestore, usersRef } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';


const FindMatchesScreen = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchUserInfoAndMatches = async () => {
            if (currentUser) {
                try {
                    //get current user's document 
                    const userDocRef = doc(firestore, 'users', currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        const { housing, gender } = userData;

                        //Query matches based on current user's housing and gender
                        const userRef = collection(firestore, 'users');
                        const q = query(usersRef, where('housing', '==', housing), where('gender', '==', gender));
                        const querySnapshot = await getDocs(q);

                        const fetchedMatches = [];
                        querySnapshot.forEach(doc => {
                            //exclude current user from the matches
                            if (doc.id !== currentUser.uid) {
                                fetchedMatches.push({ id: doc.id, ...doc.data() });
                            }
                        });
                        setMatches(fetchedMatches);
                        console.log('Matches fetched!');
                    } else {
                        console.log('No such document!');
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