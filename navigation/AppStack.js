import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import MyTabs from "./TabStack";

const AppStack = () => {
  return (
    <MyTabs />
  );
};

export default AppStack;







// const FeedStack = ({ navigation }) => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="RN Social"
//       component={HomeScreen}
//       options={{
//         headerTitleAlign: "center",
//         headerTitleStyle: {
//           color: "#2e64e5",
//           fontFamily: "Kufam-SemiBoldItalic",
//           fontSize: 18,
//         },
//         headerStyle: {
//           shadowColor: "#fff",
//           elevation: 0,
//         },
//         headerRight: () => (
//           <View style={{ marginRight: 10 }}>
//             <FontAwesome5.Button
//               name="plus"
//               size={22}
//               backgroundColor="#fff"
//               color="#2e64e5"
//               onPress={() => navigation.navigate("AddPost")}
//             />
//           </View>
//         ),
//       }}
//     />

//   </Stack.Navigator>
// );
