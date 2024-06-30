import React, {useEffect, useState} from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import MyTabs from "./TabStack";

//newly added
import { auth, firestore } from "../firebaseConfig";
import ProfileSetupScreen from "../screens/ProfileSetupScreen";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import SetupStack from "./SetupStack";

const AppStack = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfileCompletion = async (userId) => {
      try {
        const userDocRef = doc(firestore, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          return userData.isProfileComplete;
        }
        return false;

      } catch (error) {
        console.error("Error checking profile completion: ", error);
        return false;
      }
    };

    const subscriber = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const profileComplete = await checkProfileCompletion(user.uid);
        setIsProfileComplete(profileComplete);
      }
      setLoading(false);
    });

    return subscriber; //cleanup subscription on unmount
  }, []);

  if (loading) {
    //render a loading screen or nothing while we determine the initial route 
    return null; //or a loading component
  }

  return (
    isProfileComplete ? <MyTabs /> : <SetupStack />
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
