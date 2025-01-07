import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const DisplaySavedImages = () => {
  const [savedImages, setSavedImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchSavedImages = async () => {
      try {
        const images = JSON.parse(await AsyncStorage.getItem('savedImages') || '[]');
        setSavedImages(images);
      } catch (error) {
        console.error("Error fetching saved images:", error);
      }
    };
    fetchSavedImages();
  }, []);

  const handleDelete = async (uri: string) => {
    try {
      const updatedImages = savedImages.filter(image => image !== uri);
      await AsyncStorage.setItem('savedImages', JSON.stringify(updatedImages));
      setSavedImages(updatedImages);
      await FileSystem.deleteAsync(uri);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <View style={styles.container}>
      {savedImages.length > 0 ? (
        <FlatList
          data={savedImages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item }} style={styles.image} />
              <Button title="Delete" onPress={() => handleDelete(item)} />
            </View>
          )}
        />
      ) : (
        <Text>No images found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  imageContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default DisplaySavedImages;