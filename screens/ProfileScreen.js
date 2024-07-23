import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { UserProfileContext } from '../navigation/UserProfileContext';
import { AuthContext } from "../navigation/AuthProvider";
import FormButton from '../components/FormButton';
import { ActivityIndicator } from 'react-native-paper';

const ProfileScreen = ({ navigation }) => {
    const { profile, loading } = useContext(UserProfileContext);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
            showsVerticalScrollIndicator={false}>

          <Image source={{ uri: profile.profilePhoto }} style={styles.userImg} /> 
          <Text style={styles.userName}>{profile.userName}</Text> 
          <Text style={styles.aboutUser}>{profile.userIntro}</Text>

            <View style={styles.userBtnWrapper}>
                <TouchableOpacity style={styles.userBtn} onPress={() => navigation.navigate('Edit Profile')}>
                    <Text style={styles.userBtnText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.userBtn} onPress={() => navigation.navigate('Find Matches')}>
                    <Text style={styles.userBtnText}>Find Matches</Text>
                </TouchableOpacity>
            </View>

            {/* <View style={styles.userInfoContainer}>
                <View style={styles.userInfoItem}>
                    <Text style={styles.userInfoTitle}>22</Text>
                    <Text style={styles.userInfoSubtitle}>Posts</Text>
                </View>
                <View style={styles.userInfoItem}>
                    <Text style={styles.userInfoTitle}>100</Text>
                    <Text style={styles.userInfoSubtitle}>Followers</Text>
                </View>
                <View style={styles.userInfoItem}>
                    <Text style={styles.userInfoTitle}>50</Text>
                    <Text style={styles.userInfoSubtitle}>Following</Text>
                </View>
            </View> */}
        </ScrollView>

    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    aboutUser: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    userBtnWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
    },
    userBtn: {
        backgroundColor: '#2e64e5',
        borderRadius: 10,
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginHorizontal: 8,
    },
    userBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 5,
        fontFamily: 'Lato-Regular',
    },
    userInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 20,
    },
    userInfoItem: {
        justifyContent: 'center',
    },
    userInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    userInfoSubtitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center'
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
