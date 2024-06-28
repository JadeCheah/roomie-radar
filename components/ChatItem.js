import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { useLayoutEffect, useRef } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ChatItem = ({ item, router, noBorder }) => {
  return (
    <TouchableOpacity className = "flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 border-b border-b-neutral-200">
      <Image 
      source={require('../assets/onboarding_1.png')} 
      style={{ height: hp(6), width: hp(6)}} 
      className = "rounded-full"
      />

<View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-800">Nomi</Text>
          <Text style={{ fontSize: hp(1.6) }} className="font-medium text-neutral-500">Time</Text>
        </View>
        <Text style={{ fontSize: hp(1.6) }} className="font-medium text-neutral-500">Last message</Text>
      </View>
    </TouchableOpacity>
  );
}
export default ChatItem;

// const ChatItem = ({ item }) => {
//     const itemRef = useRef();
//     useLayoutEffect(() => {
//         itemRef.current.measure((x, y, width, height) => {
//             console.log(`ChatItem dimensions: ${width}x${height}`);
//             if (width === 0 || height === 0) {
//                 console.error('ChatItem has zero dimensions');
//               }
//         });
//     }, []);

//     return (
//         <TouchableOpacity ref={itemRef} style={styles.chatItem}>
//             <Text style={styles.text}>{`User ${item}`}</Text>
//         </TouchableOpacity>
//     );
// };
//   export default ChatItem;
  
//   const styles = StyleSheet.create({
//     chatItem: {
//       padding: 20,
//       margin: 10,
//       backgroundColor: '#ddd',
//       borderRadius: 5,
//     },
//     text: {
//       fontSize: 18,
//     },
//   });
  
