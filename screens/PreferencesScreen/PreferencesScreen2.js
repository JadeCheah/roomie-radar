import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, TextInput, Picker, Alert } from 'react-native';
import { auth, firestore } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import FormButton from '../../components/FormButton';


const PreferencesScreen2 = ({ navigation }) => {
    
    return (
        <View>
            <Text>Preferences Screen 2</Text>
            <Button title="GoBack" onPress={() => navigation.goBack()}></Button>
        </View>
    );
}

export default PreferencesScreen2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 20,
        marginTop: 20,
        marginHorizontal: 18,
    },
})