import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";

const LoginScreen = () =>  {
  return (
    <View style = {styles.container}>
      <Text>Login screen</Text>
      <Button
      title ='Click here'
      onPress={() => alert('hi missus!')}
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});