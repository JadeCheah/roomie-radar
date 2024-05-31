import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack.ios';

const Routes = () => {
    return (
        <NavigationContainer>
            <AuthStack/>
        </NavigationContainer>
    );
};

export default Routes;