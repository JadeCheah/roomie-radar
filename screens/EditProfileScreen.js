import React, { useContext , useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { UserProfileContext } from '../navigation/UserProfileContext';
import { TextInput } from 'react-native-gesture-handler';

const EditProfileScreen = ({navigation}) => {
    const { profile, updateProfile } = useContext(UserProfileContext);
    const [userName, setUserName] = useState(profile.userName);
    const [userIntro, setUserIntro] = useState(profile.userIntro);

    const saveProfile = () => {
        updateProfile({ userName, userIntro, profilePhoto: profile.profilePhoto });
        navigation.goBack();
    };

    return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
          showsVerticalScrollIndicator={false}>
          
          <Image
            style={styles.userImg}
            source={{ uri: profile.profilePhoto }}
          /> 
          <TouchableOpacity style={styles.userBtn} onPress={() => navigation.navigate('Upload Photo')}>
            <Text style={styles.userBtnText}>Edit Photo</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your name"
          />
          <TextInput
            style={styles.input}
            value={userIntro}
            onChangeText={setUserIntro}
            placeholder="Enter your introduction"
          />
          <TouchableOpacity onPress={saveProfile}>
            <Text style={styles.userBtnText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
    );
}

export default EditProfileScreen;

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
        marginVertical: 10,
    },
    input: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
    userBtnWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
    },
    userBtn: {
        borderColor: '#2e64e5',
        borderWidth: 2, 
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
        marginVertical: 10,
    },
    userBtnText: {
        color: '#2e64e5'
    },
})