import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Alert, Image,
  ActivityIndicator, ImageBackground, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadToFirebase } from '../firebaseConfig';
import GradualButton from '../components/GradualButton'; // Import the GradualButton component

const AddPostUploadPhotoScreen = ({ navigation, route }) => {
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [libraryPermission, requestLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const takePhotoFromCamera = async () => {
    try {
      if (cameraPermission?.granted) {
        const cameraResponse = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [16, 9],
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1
        });
        if (!cameraResponse.canceled) {
          setImageUri(cameraResponse.assets[0].uri);
        }
      } else {
        Alert.alert('Camera permission not granted');
      }
    } catch (e) {
      Alert.alert("Error Loading Image " + e.message);
    }
  };

  const pickImageFromLibrary = async () => {
    try {
      if (libraryPermission?.granted) {
        const libraryResponse = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1
        });
        if (!libraryResponse.canceled) {
          setImageUri(libraryResponse.assets[0].uri);
        }
      } else {
        Alert.alert('Library permission not granted');
      }
    } catch (e) {
      Alert.alert("Error Loading Image " + e.message);
    }
  };

  const confirmUpload = async () => {
    if (imageUri) {
        setUploading(true);
        try {
            const response = await uploadToFirebase(imageUri);
            const downloadURL = response.downloadUrl; // Ensure this matches the key returned in the response
            console.log('Image uploaded successfully:', downloadURL);
            Alert.alert("Image uploaded successfully!");
            setImageUri(null); // Clear the image after upload
            navigation.navigate('AddPost', { postImg: downloadURL }); // Ensure you are passing the correct URL
        } catch (e) {
            Alert.alert("Error Uploading Image " + e.message);
        } finally {
            setUploading(false);
        }
    }
};


  const dismissKeyboard = () => Keyboard.dismiss();

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
        <GradualButton title="Request Camera Permission" onPress={requestCameraPermission} />
        <GradualButton title="Request Library Permission" onPress={requestLibraryPermission} />
      </View>
    );
  }

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
              {uploading ? (
                <View style={styles.progressContainer}>
                  <ActivityIndicator size="large" color="#007BFF" />
                </View>
              ) : (
                <GradualButton title="Confirm Upload" onPress={confirmUpload} />
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
};

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
    borderRadius: 10, // Add border radius to match the rounded buttons
  },
  progressContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
});
