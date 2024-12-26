import React, { useState } from 'react';
import { Button, StyleSheet, Text, Pressable, View, Modal } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CameraSVG from '../../assets/svg/SvgCodeFile/camera';
import Icon from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import CameraConfirmationModal from './Modal/Modal1';
export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isFocused = useIsFocused();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function handleCameraClick() {
    setIsModalVisible(true);
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView style={styles.camera} facing={facing} active={true}>
          <View style={styles.overlay}>
            <Pressable style={[styles.circleButton, styles.closeButton]}>
              <Ionicons name="close" size={20} color="white" />
            </Pressable>

            <View style={styles.cameravideContainer}>
              <Pressable
                style={[styles.circleButtoncamer, styles.cameraButton]}
                onPress={handleCameraClick}
              >
                <Entypo name="camera" size={47} color="white" />
              </Pressable>

              <Pressable style={[styles.circleButtonvideo, styles.videoButton]}>
                <Icon name="video" size={39} color="white" />
              </Pressable>
            </View>

            <Pressable style={[styles.circleButton, styles.customButton]}>
              <CameraSVG size={25} color="black" />
            </Pressable>
          </View>
        </CameraView>
      )}
      <CameraConfirmationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 120,
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
});
