import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';

const OnboardingScreen = ({navigation}) => {
    return (
        <Onboarding
        pages={[
            {
                backgroundColor: '#fff',
                image: <Image source={require('../assets/onboarding.webp')} />,
                title: 'Onboarding 1',
                subtitle: 'Done with React Native Onboarding Swiper',
            },
            {
                backgroundColor: '#fff',
                image: <Image source={require('../assets/icon.png')} />,
                title: 'Onboarding 2',
                subtitle: 'Done with React Native Onboarding Swiper',
            },
        ]}
    />
    )
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});