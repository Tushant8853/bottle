import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const saveImageToLocalStorage = async (uri: string): Promise<string | undefined> => {
  console.log('Saving image to local storage');
  console.log('URI:::::::', uri);
  try {
    const uniqueId = uuid.v4();
    const fileName = `${uniqueId}.jpg`;
    const destPath = `${FileSystem.documentDirectory}${fileName}`;
    console.log("Saving image with UUID:", fileName);
    await FileSystem.moveAsync({
      from: uri,
      to: destPath,
    });
    console.log("Image saved to:", destPath);
    const savedImages = JSON.parse(await AsyncStorage.getItem('savedImages') || '[]');
    savedImages.push(destPath);
    await AsyncStorage.setItem('savedImages', JSON.stringify(savedImages));
    return destPath;
  } catch (error) {
    console.error("Error saving image:", error);
  }
};
