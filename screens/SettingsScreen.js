import React , {useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from "../navigation/AuthProvider";
import FormButton from '../components/FormButton';

const SettingsScreen = () => {
    const { logout } = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <FormButton buttonTitle="Logout" onPress={() => logout()} />
        </View>
    );
}

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginVertical: '50%',
        marginHorizontal: 20,
    }
})