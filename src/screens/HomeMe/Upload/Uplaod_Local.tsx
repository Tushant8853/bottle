import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

/**
 * Saves an image to local storage.
 * @param uri - The URI of the image to save.
 * @returns The destination path where the image is saved.
 */
export const saveImageToLocalStorage = async (uri: string): Promise<string | undefined> => {
  try {
    const uniqueId = uuid.v4();
    const fileName = `${uniqueId}.jpg`;
    const destPath = `${FileSystem.documentDirectory}${fileName}`;
    console.log("Saving image with UUID:", fileName);

    // Move the image to the destination path
    await FileSystem.moveAsync({
      from: uri,
      to: destPath,
    });

    console.log("Image saved to:", destPath);

    // Retrieve previously saved images from AsyncStorage
    const savedImages = JSON.parse(await AsyncStorage.getItem('savedImages') || '[]');
    savedImages.push(destPath);

    // Save updated list back to AsyncStorage
    await AsyncStorage.setItem('savedImages', JSON.stringify(savedImages));

    return destPath;
  } catch (error) {
    console.error("Error saving image:", error);
  }
};
