import { View, Text, FlatList } from 'react-native';
import React from 'react';
import ChatItem from './ChatItem';

const ChatList = ({ users }) => {
    console.log('Users in ChatList:', users);
  return (
    <View>
      <FlatList
        data={users}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 25 }}
        keyExtractor={item => Math.random().toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, router, index }) => <ChatItem 
        noBorder={index+1 == users.length}
        router={router}
        item={item} 
        index ={index} />}        
      />
    </View>
  );
}
export default ChatList;
