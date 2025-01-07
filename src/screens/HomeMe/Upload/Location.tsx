import * as Location from 'expo-location';

export const getLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const { latitude, longitude } = location.coords;
    return { latitude, longitude };
  } catch (error) {
    console.error("Error fetching location: ", error);
    throw error;
  }
};
