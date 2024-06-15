import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatLis, TouchableOpacity} from "react-native";

const AddPostScreen = ({navigation}) => {

    return (
        <TouchableOpacity name="AddPost" onPress={() => {navigation.navigate("AddPostPhoto")}}>
            <Text>Uoload Photo</Text>
        </TouchableOpacity>
    );
};

export default AddPostScreen;

