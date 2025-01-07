import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const saveImageToLocalStorage = async (uri: string): Promise<string | undefined> => {
  try {
    const uniqueId = uuid.v4();
    const fileName = `${uniqueId}.jpg`;
    const destPath = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.moveAsync({
      from: uri,
      to: destPath,
    });
    const savedImages = JSON.parse(await AsyncStorage.getItem('savedImages') || '[]');
    savedImages.push(destPath);
    await AsyncStorage.setItem('savedImages', JSON.stringify(savedImages));
    return destPath;
  } catch (error) {
    console.error("Error saving image:", error);
  }
};
