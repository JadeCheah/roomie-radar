import React , {useContext} from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { AuthContext } from "../navigation/AuthProvider";
import FormButton from '../components/FormButton';

const SettingsScreen = () => {
    const { logout } = useContext(AuthContext);
    return (
        <ImageBackground 
        source={require('../assets/orange-gradient.jpg')}
      style={styles.container1}
      resizeMode="cover">
        <View style={styles.container}>
            <FormButton buttonTitle="Logout" onPress={() => logout()} />
        </View>
        </ImageBackground>
    );
}

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginVertical: '50%',
        marginHorizontal: 20,
    },
        container1: {
          flex: 1, // Ensures the container expands to fill the screen
          backgroundColor: 'transparent' // Ensures the ImageBackground shows through
        
      }
    });
