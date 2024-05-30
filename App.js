import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TextInput, ScrollView, FlatList } from "react-native";
import GoalItem from "./components/GoalItem";
import GoalInput from "./components/GoalInput";

export default function App() {
    const [courseGoals, setCourseGoals] = useState([]);

  function addGoalHandler(enteredGoalText) {
    setCourseGoals((currentCourseGoals) => [
      ...currentCourseGoals,
      {text: enteredGoalText, id: Math.random().toString()}, 
    ]);
  }
  function deleteGoalHandler(iD) {
    setCourseGoals((currentCourseGoals) => {
      return currentCourseGoals.filter(item => item.id !== iD);
    }
  )
  }

  return (
    <View style={styles.appContainer}>
      <GoalInput onAddGoal = {addGoalHandler}/>
      <View style={styles.goalsContainer}>
      <FlatList 
      data ={courseGoals}
      renderItem={(itemData) => {
        return (
        <GoalItem 
        text = {itemData.item.text}
        id = {itemData.item.id}
        onDeleteItem = {deleteGoalHandler}/>) 
      }
      }
      keyExtractor={(item, index) => item.id}
      alwaysBounceVertical = {false}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  
  appContainer: {
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingHorizontal: 16,
    flex: 1,
  },
  goalsContainer: {
    flex: 5,
  },
  
  goalText: {
    color: "white",
  }
});
