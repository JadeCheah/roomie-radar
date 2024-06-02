import React, {useContext, useState} from "react";
import { StyleSheet, TouchableOpacity, Image, View, Text } from "react-native";
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
//import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {AuthContext} from '../navigation/AuthProvider';

const LoginScreen = ({navigation}) =>  {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const {login} = useContext(AuthContext);
  
  // const login = () => {
  //   signInWithEmailAndPassword(auth, email, password)
  //     .then(async (userCredential) => {
  //       // Signed in
  //       const user = userCredential.user;
  //       onChangeLoggedInUser(user.email);
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //     });
  // };

  return (
    <View style = {styles.container}>
      <Image source={require('../assets/Roomie-radar-white-background-1.png')}
      style={styles.logo}
      />
      <Text style={styles.text}>Roomie Radar</Text>
      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />
      <FormButton
        buttonTitle="Sign In"
        onPress={() => login(email, password)}
      />
      <TouchableOpacity 
        style={styles.forgotButton} 
        onPress={() => {}}>
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <SocialButton
        buttonTitle="Sign In with Facebook"
        buttonType="facebook"
        color="#4867aa"
        backgroundColor="#e6eaf4"
        onPress={() => {}}
      />
      <SocialButton
        buttonTitle="Sign In with Google"
        buttonType="google"
        color="#de4d41"
        backgroundColor="#f5e7ea"
        onPress={() => {}}
      />
      <TouchableOpacity 
        style={styles.forgotButton} 
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.navButtonText}>Don't have an account? Create here</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: 'cover',
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
});