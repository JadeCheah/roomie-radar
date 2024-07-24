import React, { useRef } from 'react';
import { Animated, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GradualButton = ({ onPress, title }) => {
    const backgroundColor = useRef(new Animated.Value(0)).current;

    const animateBackground = () => {
        Animated.timing(backgroundColor, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true // false for color animations
        }).start(() => {
            onPress();
            backgroundColor.setValue(0);
        });
    };

    const backgroundColorInterpolate = backgroundColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['#007BFF', '#0056b3'] // Light blue to darker blue
    });

    return (
        <TouchableOpacity
            onPress={animateBackground}
            style={[styles.button, { backgroundColor: backgroundColorInterpolate }]}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,  // Same roundness as the text input
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        elevation: 2,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: { height: 1, width: 0 },
        width: '100%',  // Full width
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    }
});

export default GradualButton;
