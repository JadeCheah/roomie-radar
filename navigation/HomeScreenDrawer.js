import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';  // Adjust the path as necessary
import { useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

// Custom Drawer Content to add the "Add Post" functionality
function CustomDrawerContent(props) {
  const navigation = useNavigation();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Add Post"
        onPress={() => navigation.navigate('AddPost')} // Assuming 'AddPost' is a screen or a function you want to trigger
      />
    </DrawerContentScrollView>
  );
}

const HomeScreenDrawer = () => {
  return (
    <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      {/* You can add more screens or items here if needed */}
    </Drawer.Navigator>
  );
};

export default HomeScreenDrawer;
