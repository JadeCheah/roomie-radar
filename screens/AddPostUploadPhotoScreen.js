

import React, { useEffect, useState, useContext }from 'react';
import { StyleSheet, Text, View, TouchableOpacity , Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadToFirebase } from '../firebaseConfig';
// import { UserProfileContext } from '../navigation/UserProfileContext';

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

    return (
        <View style={styles.container}>
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
                    <TouchableOpacity style={styles.button} onPress={takePhotoFromCamera}>
                        <Text>Take Photo From Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={pickImageFromLibrary}>
                        <Text>Choose Photo From Library</Text>
                    </TouchableOpacity>
                </>

            )}
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
}

export default AddPostUploadPhotoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginBottom: 50,
        paddingHorizontal: 10, 
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    previewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePreview: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    progressContainer: {
        width: '80%',
        alignItems: 'center',
        marginBottom: 10,
    },
});

