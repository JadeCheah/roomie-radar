import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {windowWidth, windowHeight} from '../utils/Dimensions';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SocialButton = ({buttonTitle, buttonType, color, backgroundColor, ...rest}) => {
    return (
        <TouchableOpacity 
            style={[styles.buttonContainer, {backgroundColor: backgroundColor}]}
            {... rest}>
            <View style={styles.iconWrapper}>
                <FontAwesome name={buttonType} style={styles.icon} size={22} color={color} />
            </View>
            <View style={styles.btnTxtWrapper}>
                <Text style={[styles.buttonText, {color: color}]}>{buttonTitle}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default SocialButton;

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 10,
        width: '100%',
        height: windowHeight / 15,
        padding: 10,
        flexDirection: 'row',
        borderRadius: 3,
      },
      iconWrapper: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
      },
      icon: {
        fontWeight: 'bold',
      },
      btnTxtWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Lato-Regular',
      },
});