import * as Location from 'expo-location';

export const getLocation = async () => {
  try {
    // Request permissions for location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    // Get the current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const { latitude, longitude } = location.coords;

    // Perform reverse geocoding to get the location name
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    // Extract the name of the location from the reverse geocode result
    const locationName =
      reverseGeocode.length > 0
        ? `${reverseGeocode[0].city || reverseGeocode[0].region}, ${
            reverseGeocode[0].country 
          }, ${
            reverseGeocode[0].postalCode 
          } `
        : 'Unknown location';

    return { latitude, longitude, locationName };
  } catch (error) {
    console.error('Error fetching location: ', error);
    throw error;
  }
};
