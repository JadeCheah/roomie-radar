import React from 'react';
import { View, Text, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../navigation/AuthProvider';
import Menu, { MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { MenuItem } from './CustomMenuItems';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
  

const ChatHeader = () => {
  const { top } = useSafeAreaInsets();
  const { user, logout } = useAuth();
  console.log('User photo URL:', user?.photoURL); 
  const handleProfile = () => {};


  return (
    <View style={{ paddingTop: top, backgroundColor: '#123456', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
      <Text style={{ fontSize: 20, color: 'white' }}>Chats</Text>
      <View>
        <Menu>
          <MenuTrigger customStyles={{
            triggerWrapper: {
            }
          }}>
          <Image
              source={{ uri: user?.photoURL }}
              style={{ height: 40, width: 40, borderRadius: 20 }}
          />
          </MenuTrigger>
          <MenuOptions>

            <MenuItem text = "profile" 
            action = {handleProfile}
            value ={null}
            icon={<Feather name="user" size={hp(2.5)} color="#737373" />}
            />
        </MenuOptions>
        </Menu>
      </View>
      
    </View>
  );
};

export default ChatHeader;


