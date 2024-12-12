import { Fontisto, AntDesign } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import React from 'react'
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View, Text } from 'react-native';

const PhotoPreviewSection = ({
  photo,
  handleRetakePhoto,
  handleSavePhoto,
  handleGoBack
}: {
  photo: CameraCapturedPicture;
  handleRetakePhoto: () => void;
  handleSavePhoto: () => void;
  handleGoBack: () => void;
}) => (
  <View style={styles.container}>
    <View style={styles.imageContainer}>
      <Image
        style={styles.previewImage}
        source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
        resizeMode="cover"
      />
    </View>

    <View style={styles.controlsContainer}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <AntDesign name="close" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.bottomControls}>
        <TouchableOpacity onPress={handleSavePhoto} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: -40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  retakeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  retakeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#522F60',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom:100
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "White",
  },
});

export default PhotoPreviewSection;