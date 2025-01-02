import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  return (
    <View style={styles.container}>
      {savedImages.length > 0 ? (
        <FlatList
          data={savedImages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
        />
      ) : (
        <Text>No saved images found.</Text>
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
  image: {
    width: '100%',
    height: '100%',
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default DisplaySavedImages;
