import * as Location from 'expo-location';
import axios from 'axios';
import { supabase } from "../../../../backend/supabase/supabaseClient";

interface NearbyRestaurantResult {
    Restaurants_id: string | null;
}

export const getLocation = async () => {
  try {
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }

    // Get the last known location
    const location = await Location.getLastKnownPositionAsync();

    if (!location) {
      throw new Error("No last known location found");
    }

    const { latitude, longitude } = location.coords;

    const [locationName, restaurantId] = await Promise.all([
      getLocationNameFromGoogleMaps(latitude, longitude),
      findNearbyRestaurant(latitude, longitude),
    ]);

    return { latitude, longitude, locationName, restaurantId };
  } catch (error) {
    console.error("Error fetching location:", error);
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
        const { data: restaurants, error } = await supabase
            .rpc('find_nearby_restaurants', {
                lat: latitude,
                lng: longitude,
                radius: 100
            })
            .single<NearbyRestaurantResult>();

        if (error) throw error;
        return restaurants?.Restaurants_id || null;
    } catch (error) {
       // console.error('Error finding nearby restaurants:', error);
        return null;
    }
};