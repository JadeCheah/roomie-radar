// import React, { useEffect, useState } from 'react';
// import {
//   StyleSheet, Text, View, TouchableOpacity, Alert, Image,
//   ActivityIndicator, ImageBackground, TouchableWithoutFeedback, Keyboard
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { uploadToFirebase } from '../firebaseConfig';
// import GradualButton from '../components/GradualButton'; // Import the GradualButton component

// const AddPostUploadPhotoScreen = ({ navigation, route }) => {
//   const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
//   const [libraryPermission, requestLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
//   const [imageUri, setImageUri] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const { onPhotoSelected } = route.params;

//   useEffect(() => {
//     (async () => {
//       if (!cameraPermission) {
//         await requestCameraPermission();
//       }
//       if (!libraryPermission) {
//         await requestLibraryPermission();
//       }
//     })();
//   }, []);

//   const takePhotoFromCamera = async () => {
//     try {
//       if (cameraPermission?.granted) {
//         const cameraResponse = await ImagePicker.launchCameraAsync({
//           allowsEditing: true,
//           aspect: [16, 9],
//           mediaTypes: ImagePicker.MediaTypeOptions.All,
//           quality: 1
//         });
//         if (!cameraResponse.canceled) {
//           setImageUri(cameraResponse.assets[0].uri);
//         }
//       } else {
//         Alert.alert('Camera permission not granted');
//       }
//     } catch (e) {
//       Alert.alert("Error Loading Image " + e.message);
//     }
//   };

//   const pickImageFromLibrary = async () => {
//     try {
//       if (libraryPermission?.granted) {
//         const libraryResponse = await ImagePicker.launchImageLibraryAsync({
//           allowsEditing: true,
//           mediaTypes: ImagePicker.MediaTypeOptions.All,
//           quality: 1
//         });
//         if (!libraryResponse.canceled) {
//           setImageUri(libraryResponse.assets[0].uri);
//         }
//       } else {
//         Alert.alert('Library permission not granted');
//       }
//     } catch (e) {
//       Alert.alert("Error Loading Image " + e.message);
//     }
//   };

//   const confirmUpload = async () => {
//     if (imageUri) {
//         setUploading(true);
//         try {
//           const fileName = imageUri.split('/').pop();
//           setUploading(true);
//           const uploadResponse = await uploadToFirebase(imageUri, fileName);
//           console.log(uploadResponse);
//           //------------
//           // updateUserProfile({ ...profile, profilePhoto: uploadResponse.downloadUrl })
//           //------------
//           onPhotoSelected(uploadResponse.downloadUrl);
//           Alert.alert("Image uploaded successfully!");
//           setImageUri(null); //clear the image after upload
//           navigation.goBack();
//         } catch (e) {
//             Alert.alert("Error Uploading Image " + e.message);
//         } finally {
//             setUploading(false);
//         }
//     }
// };


//   const dismissKeyboard = () => Keyboard.dismiss();

//   if (!cameraPermission || !libraryPermission) {
//     return (
//       <View style={styles.container}>
//         <Text>Requesting permissions...</Text>
//       </View>
//     );
//   }

//   if (!cameraPermission.granted || !libraryPermission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text>Permissions not granted</Text>
//         <TouchableOpacity onPress={requestCameraPermission}>
//           <Text>Request Camera Permission</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={requestLibraryPermission}>
//           <Text>Request Library Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <ImageBackground
//       source={require('../assets/orange-gradient.jpg')}
//       style={styles.container}
//       resizeMode="cover"
//     >
//       <TouchableWithoutFeedback onPress={dismissKeyboard}>
//         <View style={styles.inner}>
//           {imageUri ? (
//             <View style={styles.previewContainer}>
//               <Image source={{ uri: imageUri }} style={styles.imagePreview} />
//               {uploading ? (
//                 <View style={styles.progressContainer}>
//                   <ActivityIndicator size="large" color="#007BFF" />
//                 </View>
//               ) : (
//                 <GradualButton title="Confirm Upload" onPress={confirmUpload} />
//               )}
//             </View>
//           ) : (
//             <>
//               <GradualButton title="Take Photo From Camera" onPress={takePhotoFromCamera} />
//               <GradualButton title="Choose Photo From Library" onPress={pickImageFromLibrary} />
//             </>
//             )}
//             <GradualButton title="Go Back" onPress={() => navigation.goBack()} />
//         </View>
//       </TouchableWithoutFeedback>
//     </ImageBackground>
//   );
// };




import React, { useEffect, useState, useContext }from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, Text, View, TouchableOpacity , Alert, Image, ActivityIndicator, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadToFirebase } from '../firebaseConfig';
// import { UserProfileContext } from '../navigation/UserProfileContext';
import GradualButton from '../components/GradualButton'; // Import the GradualButton component


const AddPostUploadPhotoScreen = ({navigation, route}) => {
    // const { profile, updateUserProfile } = useContext(UserProfileContext);

    const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
    const [libraryPermission, requestLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
    const [imageUri, setImageUri] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { onPhotoSelected } = route.params;  // Make sure to destructure route from props

// Call this function when the photo is confirmed uploaded or selected
const handlePhotoSelected = (uri) => {
    console.log("Selected image URI: ", uri);
    onPhotoSelected(uri);  // This sets the state in AddPostScreen
    navigation.goBack();   // Optionally navigate back after selection
};

    useEffect(() => {
        (async () => {
            if (!cameraPermission) {
                await requestCameraPermission();
            }
            if (!libraryPermission) {
                await requestLibraryPermission();
            }
        })();
    }, []);

    const takePhotoFromCamera = async() => {
        try {
            if (cameraPermission?.granted) {
                const cameraResponse = await ImagePicker.launchCameraAsync({
                    allowsEditing : true,
                    mediaTypes : ImagePicker.MediaTypeOptions.All,
                    qualtiy : 1
                });
                if ( !cameraResponse.canceled ) {
                    const { uri } = cameraResponse.assets[0];
                    setImageUri(uri);
                    handlePhotoSelected(uri)
                }
            } else {
                Alert.alert('Camera permission not granted');
            }
        } catch (e) {
            Alert.alert("Error Loading Image " + e.message);
        }
    };

    const pickImageFromLibrary = async() => {
        try {
            if (libraryPermission?.granted) {
                const libraryResponse = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    quality: 1
                });
                if ( !libraryResponse.canceled ) {
                    const { uri } = libraryResponse.assets[0];
                    setImageUri(uri);
                }
            } else {
                Alert.alert('Library permission not granted');
            }
        } catch(e) {
            Alert.alert("Error Loading Image " + e.message);
        }
    };
    
    const confirmUpload = async() => {
        try {
            if (imageUri) {
                const fileName = imageUri.split('/').pop();
                setUploading(true);
                const uploadResponse = await uploadToFirebase(imageUri, fileName);
                console.log(uploadResponse);
                //------------
                // updateUserProfile({ ...profile, profilePhoto: uploadResponse.downloadUrl })
                //------------
                Alert.alert("Image uploaded successfully!");
                setImageUri(null); //clear the image after upload
                navigation.goBack();
            }
        } catch(e) {
            Alert.alert("Error Uploading Image " + e.message);
        } finally {
            setUploading(false);
        }
    };

    if (!cameraPermission || !libraryPermission) {
        return (
            <View style={styles.container}>
                <Text>Requesting permissions...</Text>
            </View>
        );
    }

    if (!cameraPermission.granted || !libraryPermission.granted) {
        return (
          <View style={styles.container}>
            <Text>Permissions not granted</Text>
            <TouchableOpacity onPress={requestCameraPermission}>
              <Text>Request Camera Permission</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={requestLibraryPermission}>
              <Text>Request Library Permission</Text>
            </TouchableOpacity>
          </View>
        );
      }


//       <TouchableWithoutFeedback onPress={dismissKeyboard}>
//         <View style={styles.inner}>
//           {imageUri ? (
//             <View style={styles.previewContainer}>
//               <Image source={{ uri: imageUri }} style={styles.imagePreview} />
//               {uploading ? (
//                 <View style={styles.progressContainer}>
//                   <ActivityIndicator size="large" color="#007BFF" />
//                 </View>
//               ) : (
//                 <GradualButton title="Confirm Upload" onPress={confirmUpload} />
//               )}
//             </View>
//           ) : (
//             <>
//               <GradualButton title="Take Photo From Camera" onPress={takePhotoFromCamera} />
//               <GradualButton title="Choose Photo From Library" onPress={pickImageFromLibrary} />
//             </>
//             )}
//             <GradualButton title="Go Back" onPress={() => navigation.goBack()} />
//         </View>
//       </TouchableWithoutFeedback>
//     


   const dismissKeyboard = () => Keyboard.dismiss();


    return (
          <ImageBackground
      source={require('../assets/orange-gradient.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.inner}>
            {imageUri ? (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    {uploading? (
                        <View style={styles.progressContainer}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={confirmUpload}>
                            <Text>Confirm Upload</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                          <>
                            <GradualButton title="Take Photo From Camera" onPress={takePhotoFromCamera} />
                            <GradualButton title="Choose Photo From Library" onPress={pickImageFromLibrary} />
                          </>
                          )}
                          <GradualButton title="Go Back" onPress={() => navigation.goBack()} />
                      </View>
                      </TouchableWithoutFeedback>
        </ImageBackground>
    );
}

export default AddPostUploadPhotoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  progressContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
});