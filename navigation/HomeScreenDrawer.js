import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, Text, View, StyleSheet } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import { useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const navigation = useNavigation();

  const handleAddPostPress = () => {
    navigation.closeDrawer(); // Optional: Close the drawer when navigating
    navigation.navigate('Home', { screen: 'AddPost' }); // Adjust this navigate function based on your navigation structure
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <Pressable style={styles.addButton} onPress={handleAddPostPress}>
        <Text style={styles.addButtonText}>+</ Text>
      </Pressable>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerItemContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  drawerLabel: {
    fontSize: 16,
    color: '#333'
  },
  drawerItem: {
    paddingVertical: 5,
    paddingHorizontal: 15
  }
});

const HomeScreenDrawer = () => {
    return (
      <Drawer.Navigator 
        initialRouteName="Home" 
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        {/* Add other screens as needed */}
      </Drawer.Navigator>
    );
  };

export default HomeScreenDrawer;
