import React from 'react';
import { Text, View } from 'react-native';
import { MenuOption } from 'react-native-popup-menu';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const MenuItem = ({ text, action, value, icon }) => {
  return (
      <MenuOption onSelect={() => action(value)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
            <Text style = {{fontSize: hp(1.7)}} className = "font-semibold text-neutral-600">
                {text}
            </Text>
            {icon}
          </View>
      </MenuOption>
  );
};
