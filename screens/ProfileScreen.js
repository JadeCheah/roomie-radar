import React, { useContext } from 'react';
import { Button, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { UserProfileContext } from '../navigation/UserProfileContext';
// import migrateUserData from '../misc/migrationScript';

const ProfileScreen = ({ navigation }) => {
    // const handleMigration = async() => {
    //     migrateUserData().then(() => {
    //         console.log("Migration script completed.");
    //       }).catch((error) => {
    //         console.error("Migration script failed:", error);
    //       });
    // }
    
    const { profile, loading } = useContext(UserProfileContext);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    console.log(profile)

    // Example of expanding the fetchUserPreferences function
    const fetchUserPreferences = async (userId) => {
        const mainDocRef = doc(firestore, 'users', userId, 'preferences', 'main');
        const sleepDocRef = doc(firestore, 'users', userId, 'preferences', 'sleep');
        // Fetch documents
        const mainDoc = await getDoc(mainDocRef);
        const sleepDoc = await getDoc(sleepDocRef);
        // Check if documents exist
        if (!mainDoc.exists() || !sleepDoc.exists()) {
            console.error(`Preferences missing for user: ${userId}`);
            return null;
        }
        // Return combined data
        return {
            main: mainDoc.data(),
            sleep: sleepDoc.data(),
        };
    };


    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/orange-gradient.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.profileCard}>
                        <Image source={{ uri: profile.profilePhoto }} style={styles.userImg} />
                        <Text style={styles.userName}>{profile.userName}</Text>
                        <Text style={styles.userTitle}>{profile.userIntro || "No title"}</Text>
                        <TouchableOpacity style={styles.userBtn} onPress={() => navigation.navigate('Edit Profile')}>
                            <Text style={styles.userBtnText}>Edit Profile</Text>
                        </TouchableOpacity>
                        {/* <Button onPress={handleMigration} title='handle migration'></Button> */}
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
        height: '80%',
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
    userInfo: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
});

export default ProfileScreen;
