import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';

const OnboardingScreen = ({navigation}) => {
    const Dots = ({selected}) => {
        let backgroundColor;
    
        backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';
    
        return (
            <View 
                style={{
                    width:6,
                    height: 6,
                    marginHorizontal: 3,
                    backgroundColor,
                    borderRadius: 3
                }}
            />
        );
    }

    const Skip = ({...props}) => (
        <TouchableOpacity
            style={{marginHorizontal:10}}
            {...props}
        >
            <Text style={{fontSize:16}}>Skip</Text>
        </TouchableOpacity>
    );
    
    const Next = ({...props}) => (
        <TouchableOpacity
            style={{marginHorizontal:10}}
            {...props}
        >
            <Text style={{fontSize:16}}>Next</Text>
        </TouchableOpacity>
    );
    
    const Done = ({...props}) => (
        <TouchableOpacity
            style={{marginHorizontal:10}}
            {...props}
        >
            <Text style={{fontSize:16}}>Done</Text>
        </TouchableOpacity>
    );



    return (
        
        <Onboarding
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        DoneButtonComponent={Done}
        DotComponent={Dots}
        onSkip={() => navigation.replace("Login")}
        onDone={() => navigation.navigate("Login")}
        pages={[
            {
                backgroundColor: '#fff',
                image: <Image 
                source={require('../assets/images.jpeg')} // placeholder image for now
                //style = { {width: '100%', height: '100%', resizeMode: 'contain' }} 
                //style={{ flex: 1, width: '100%', resizeMode: 'cover' }}
                />,
                
                title: 'Roomie radar',
                subtitle: 'Find your perfect soulmate',
                
            },
            {
                backgroundColor: '#fff',
                image: <Image source={require('../assets/images.jpeg')} />, // placeholder image for now
                title: 'Roomie radar',
                subtitle: 'jkjk, i meant to say roommate',
                //style: {flex: 10}
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