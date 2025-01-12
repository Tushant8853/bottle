import * as Location from 'expo-location';
import axios from 'axios';

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
    const locationName = await getLocationNameFromGoogleMaps(latitude, longitude);
    return { latitude, longitude,locationName };
  } catch (error) {
    console.error("Error fetching location: ", error);
    throw error;
  }
};
const getLocationNameFromGoogleMaps = async (latitude: number, longitude: number) => {
  try {
      const GOOGLE_MAPS_API_KEY = 'AIzaSyCmi08U5TNZAx_QLc2ASR7lkEJTT6Z9_Qs'; // Replace with your API key
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await axios.get(geocodeUrl);
      const data = response.data;
      if (data.status === "OK" && data.results.length > 0) {
          const locationName = data.results[0].formatted_address; // Extract formatted address
          return locationName;
      } else {
          console.warn('Geocoding API returned unexpected status:', data.status);
          return 'Unknown Location'; // Default fallback
      }
  } catch (error) {
      console.error('Error fetching location name from Google Maps:', error);
      return 'Unknown Location'; // Default fallback in case of an error
  }
};