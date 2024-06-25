// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, initializeAuth} from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection } from "firebase/firestore";

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

// Initialize Firebase app and auth once 
let app;
let auth;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    console.log("Firebase App initialized:", app);
  } catch (error) {
    console.log("Error initializing app: " + error);
  }
} else {
  app = getApp();
  auth = getAuth();
}

//Original Version initialisation ---------------------------------------------//
// const app = initializeApp(firebaseConfig);

// initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });
//----------------------------------------------------------------------------//

const uploadToFirebase = async (uri, name, onProgress) => {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();

  //Initialize cloud storage 
  const storage = getStorage();
  const imageRef = ref(storage, `images/${name}`);

  const uploadTask = uploadBytesResumable(imageRef, theBlob);

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;     
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // Handle unsuccessful uploads
        reject(error);
      }, 
      async () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //   console.log('File available at', downloadURL);
        // });
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ downloadUrl });
      }
    );
  })
}

//Initialize Cloud Firestore and get a reference to the service
const firestore = getFirestore(app);

console.log("Firestore initialized:", firestore);
const usersRef = collection(firestore, "users");

export { app, auth, uploadToFirebase, firestore, usersRef };


