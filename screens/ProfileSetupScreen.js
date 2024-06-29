// import React, { useState } from 'react';
// import { Button, View, Text, TextInput, Alert, StyleSheet } from 'react-native';
// import { auth, firestore } from '../firebaseConfig';

// const ProfileSetupScreen = ({navigation}) => {
//     const [username, setUsername] = useState('');
//     const [age, setAge] = useState('');
//     const [preferences, setPreferences] = useState('');

//     const handleCompleteProfile = async() => {
//         if (!username || !age || !preferences) {
//             Alert.alert('Error', 'All fields are required.');
//             return;
//         }

//         try {
//             const userId = auth.currentUser.uid;
//             await firestore.collection('users').doc(userId).set({
//                 username, 
//                 age, 
//                 preferences, 
//                 isProfileComplete: true,
//             });
//             navigation.replace('Home');
//         } catch (error) {
//             console.error
//         }
//     }
    
//     return (
//         <View>
//             <Text>Profile Setup Screen</Text>
//         </View>
//     );
// }

// export default ProfileSetupScreen;

// const styles = StyleSheet.create({
//     container: {
//         alignItems: 'center',
//     }
// });

//still under construction ignore 
