import * as Location from 'expo-location';
import axios from 'axios';
import { supabase } from "../../../../backend/supabase/supabaseClient";

export const getLocation = async () => {
  try {
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const { latitude, longitude } = location.coords;

    // Fetch the location name from Google Maps
    const locationName = await getLocationNameFromGoogleMaps(latitude, longitude);

    // Check for nearby restaurants within a 100m radius
    const restaurantId = await findNearbyRestaurant(latitude, longitude);

    return { latitude, longitude, locationName, restaurantId };
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
};

// Function to fetch the location name using Google Maps API
const getLocationNameFromGoogleMaps = async (latitude: number, longitude: number) => {
  try {
    const GOOGLE_MAPS_API_KEY = 'AIzaSyCmi08U5TNZAx_QLc2ASR7lkEJTT6Z9_Qs'; // Replace with your API key
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(geocodeUrl);
    const data = response.data;

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address; // Extract formatted address
    } else {
      return 'Unknown Location';
    }
  } catch (error) {
    console.error('Error fetching location name from Google Maps:', error);
    return 'Unknown Location';
  }
};

// Function to find nearby restaurants within a 100m radius
const findNearbyRestaurant = async (latitude: number, longitude: number) => {
  try {
    // Fetch all restaurants from the Supabase database
    const { data: restaurants, error } = await supabase
      .from('bottleshock_restaurants')
      .select('Restaurants_id, location_lat, location_long');

    if (error) {
      throw new Error(`Error fetching restaurants: ${error.message}`);
    }

    // Define a function to calculate distance using the Haversine formula
    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const toRadians = (deg: number) => (deg * Math.PI) / 180;
      const R = 6371e3; // Radius of Earth in meters

      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in meters
    };

    // Check each restaurant for proximity
    for (const restaurant of restaurants) {
      const distance = haversineDistance(
        latitude,
        longitude,
        restaurant.location_lat,
        restaurant.location_long
      );

      if (distance <= 100) {
        // Return the restaurant ID if within 100m radius
        return restaurant.Restaurants_id;
      }
    }

    // If no restaurant is within the radius, return null
    return null;
  } catch (error) {
    console.error('Error finding nearby restaurants:', error);
    throw error;
  }
};