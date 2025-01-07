import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, Pressable, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import CameraConfirmationModal from './Modal/Modal1';
import CameraSVG from '../../assets/svg/SvgCodeFile/camera';
import Icon from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from "../../TabNavigation/navigationTypes";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export default function App() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstValue, setFirstValue] = useState("");
  const cameraRef = useRef(null);
  const searchValues = ["Xander Soren", "Ludeon"];

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.Permissioncontainer}>
        <Text style={styles.message}>We need your permission to access the camera</Text>
        <Pressable onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  interface File {
    uri: string;
    type: string;
    name: string;
  }

  interface WineLabels {
    [key: string]: string;
  }

  interface ObjectRecognitionResponse {
    data: {
      wine_labels: WineLabels;
    };
  }

  const callObjectRecognitionAPI = async (imageUri: string): Promise<ObjectRecognitionResponse | null> => {
    const formData = new FormData();
    const file: File = {
      uri: imageUri,
      type: "image/jpeg",
      name: "photo.jpg",
    };
    formData.append("image", {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);
    try {
      const response = await fetch(
        'https://ehvzjahhgmpwbobyyfwy.supabase.co/functions/v1/objectRecognition',
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodnpqYWhoZ21wd2JvYnl5Znd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzNjQ5MTQsImV4cCI6MjAyNjk0MDkxNH0.nrJFwPUqd1e0BCGkgIh7Lra-HQapr7mU-hWYj6aQeo4`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Error response body:", errorDetails);
      }
      const jsonResponse = await response.json();
      const data = jsonResponse.data as Record<string, string>;

      ////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////
      const matchingValues: string[] = [];
      findValues(jsonResponse, searchValues, matchingValues);

      if (matchingValues.length > 0) {
        ////////////////////////////////////////////////////////////////////////////////
        const firstValue = matchingValues.join(" ");
        setFirstValue(firstValue);
        ////////////////////////////////////////////////////////////////////////////////
      } else {
        ////////////////////////////////////////////////////////////////////////////////
        const firstKey = Object.keys(data)[0];
        const firstValue = data[firstKey]; 
        setFirstValue(firstValue);
        ////////////////////////////////////////////////////////////////////////////////
      }
      return jsonResponse;
      ////////////////////////////////////////////////////////////////////////////////
    } catch (error) {
      console.error("Error recognizing object:", error);
      return null;
    }
  };

  function findValues(response: any, values: string[], results: string[]): void {
    function search(obj: any): void {
      if (typeof obj === "object" && obj !== null) {
        for (const value of Object.values(obj)) {
          if (typeof value === "object") {
            search(value);
          } else if (typeof value === 'string' && values.includes(value)) {
            results.push(value); // Add only the value
          }
        }
      }
    }

    search(response);
  }
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
        setLoading(true);

        ////////////////////////////////////// Object Recognition API////////////////////////////////////////
        await callObjectRecognitionAPI(photo.uri);
        ////////////////////////////////////// Saving image locally////////////////////////////////////////
        // await saveImageToLocalStorage(photo.uri);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        setLoading(false);
        setIsModalVisible(true);
      } catch (error) {
        console.error("Error during recognition:", error);
        setLoading(false);
      }
    }
  };



  const resetImage = () => {
    setCapturedImage(null);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          {loading && (
            <View style={styles.loaderOverlay}>
              <View style={styles.loaderBox}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loaderText}>Loading</Text>
                <Pressable style={styles.loaderCloseButton} onPress={resetImage}>
                  <Text style={styles.loaderCancleText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      ) : (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={cameraType}
        >
          <View style={styles.overlay}>
            <Pressable
              onPress={() => navigation.navigate("UserDashboard")}
              style={[styles.circleButton, styles.closeButton]}>
              <Ionicons name="close" size={20} color="white" />
            </Pressable>

            <View style={styles.cameravideContainer}>
              <Pressable
                style={[styles.circleButtoncamer, styles.cameraButton]}
                onPress={() => {
                  takePicture();
                }}
              >
                <Entypo name="camera" size={47} color="white" />
              </Pressable>

              <Pressable style={[styles.circleButtonvideo, styles.videoButton]}>
                <Icon name="video" size={39} color="white" />
              </Pressable>
            </View>

            <Pressable
              onPress={() => navigation.navigate("DisplaySavedData")}
              style={[styles.circleButton, styles.customButton]}>
              <CameraSVG size={25} color="black" />
            </Pressable>
          </View>
        </CameraView>
      )
      }
      <CameraConfirmationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onRetake={resetImage}
        onCancel={resetImage}
        firstTwoValues={firstValue}
        photoUri={capturedImage}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  Permissioncontainer: {
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  message: {
    fontFamily: 'SF Pro',
    fontSize: 17,
    fontWeight: '400',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#B3B3B3D1', // iOS blue button color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'SF Pro',
    fontSize: 17,
    fontWeight: '400',
    textAlign: 'center',
    color: '#000000'
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  loaderBox: {
    width: 150,
    height: 150,
    borderRadius: 15,
    backgroundColor: '#B3B3B3D1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loaderText: {
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  loaderCloseButton: {
    borderTopWidth: 0.33,
    borderColor: '#3C3C435C',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: 150,
  },
  loaderCancleText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  cameravideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleButtoncamer: {
    zIndex: 50,
    left: 40,
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  circleButtonvideo: {
    marginRight: 20,
    width: 75,
    height: 75,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  closeButton: {
    backgroundColor: 'gray',
    borderWidth: 3,
    borderColor: 'white',
  },
  cameraButton: {
    backgroundColor: '#5C3D7C',
    borderWidth: 3,
    borderColor: 'white',
  },
  videoButton: {
    backgroundColor: '#DBD0E6',
  },
  customButton: {
    borderWidth: 3,
    borderColor: 'white',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
