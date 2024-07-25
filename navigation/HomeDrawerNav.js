import React from 'react';
import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen'; // Adjust the import path as needed
import AddPostScreen from '../screens/AddPostScreen'; // Adjust the import path as needed
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();

const HomeDrawerNav = () => {
    return (
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={({ navigation }) => ({
              headerRight: () => (
                  <Button
                      onPress={() => navigation.navigate('AddPost')}
                      title="+"
                      color="#000" // Customize color
                  />
              ),
              headerTitle: "Home"
          })}
      />
      <Stack.Screen name="AddPost" component={AddPostScreen} />
  </Stack.Navigator>
    );
}

export default HomeDrawerNav;
