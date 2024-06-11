// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5FCD06tn9kFO7_kBktlDqxtegMsaJ8p8",
  authDomain: "roomie-radar-e60d0.firebaseapp.com",
  projectId: "roomie-radar-e60d0",
  storageBucket: "roomie-radar-e60d0.appspot.com",
  messagingSenderId: "464398305574",
  appId: "1:464398305574:web:268fef49151894008159e7",
  measurementId: "G-81HLXXQHF3"
};

// Initialize Firebase app
// let app;
// let auth;

// if (!getApps().length) {
//   app = initializeApp(firebaseConfig);
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage),
//   });
// } else {
//   app = getApp();
//   auth = getAuth(app);
// }
const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;


