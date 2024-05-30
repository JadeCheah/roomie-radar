import { useState } from "react";
import { StyleSheet, View, TextInput, Button } from "react-native";

function GoalInput(props) {
    const [enteredGoalText, setEnteredGoalText] = useState('');

    function goalInputHandler(enteredText) {
        setEnteredGoalText(enteredText);
      }

      function addGoalHandler() {
        props.onAddGoal(enteredGoalText);
        setEnteredGoalText('');
      }

    return ( 
    <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Your first goal!"
          onChangeText={goalInputHandler}
          value = {enteredGoalText}
        />
        <Button
          style={styles.boobieStyle}
          title="Tap me!"
          onPress={addGoalHandler}/>
      </View>
      );
}

export default GoalInput;

const styles = StyleSheet.create({
    boobieStyle: {
      backgroundColor: "#ffe3e4", 
    },
    inputContainer: {
      backgroundColor: "#ffffff", 
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
      borderBottomWidth: 1,
      borderBlockColor: "#cccccc",
      flex: 1,
    },
    textInput: {
      borderWidth: 1,
      borderColor: "#cccccc",
      width: "60%",
      marginRight: 8,
      padding: 8,
    },
  });