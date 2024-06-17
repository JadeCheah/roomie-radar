import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity} from "react-native";
import FormButton from '../components/FormButton';

const AddPostScreen = ({navigation}) => {

    return (
        <View style={styles.container}>
            <Text style={styles.text}>What's On Your Mind?</Text>
            <FormButton buttonTitle="Add Photo" onPress={() => navigation.navigate("AddPostPhoto")}></FormButton>
        </View>
    );
};

export default AddPostScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 20
    },
    text: {
        font: 1,
        marginTop: 100
    }
})