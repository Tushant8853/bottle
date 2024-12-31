import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid'; 

const DisplaySavedData = () => {
  const [imageUri, setImageUri] = useState(null);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    // Function to load image and metadata
    const loadSavedData = async () => {
      try {
        // Assuming you already have the metadata and image saved
        const metadataPath = `${FileSystem.documentDirectory}${uuid.v4()}_metadata.json`; // Path of the saved metadata file
        const filePath = `${FileSystem.documentDirectory}${uuid.v4()}.jpg`; // Path of the saved image file
        
        // Read the metadata file
        const metadataString = await FileSystem.readAsStringAsync(metadataPath);
        const metadataJson = JSON.parse(metadataString);
        setMetadata(metadataJson);

        // Set the image URI for display
        setImageUri(filePath);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    loadSavedData();
  }, []);

  return (
    <View style={styles.container}>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      {metadata && (
        <View style={styles.metadataContainer}>
          <Text style={styles.metadataText}>File Name: {metadata.fileName}</Text>
          <Text style={styles.metadataText}>File Path: {metadata.filePath}</Text>
          <Text style={styles.metadataText}>Latitude: {metadata.latitude}</Text>
          <Text style={styles.metadataText}>Longitude: {metadata.longitude}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  metadataContainer: {
    alignItems: 'flex-start',
  },
  metadataText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default DisplaySavedData;
