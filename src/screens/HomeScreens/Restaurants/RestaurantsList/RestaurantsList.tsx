import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from "../../../../TabNavigation/navigationTypes";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { supabase } from "../../../../../backend/supabase/supabaseClient";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";

// Configure TwicPics
installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

const RestaurantsList = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const imagePrefix = "https://bottleshock.twic.pics/file/";

  useEffect(() => {
    const fetchRestaurants = async () => {
      const { data, error } = await supabase
        .from("bottleshock_restaurants")
        .select("*");

      if (error) {
        console.error("Error fetching restaurants:", error.message);
        return;
      }

      const formattedRestaurants = data.map((restaurant: any) => ({
        id: restaurant.id,
        name: restaurant.restro_name,
        location: restaurant.location,
        logo: restaurant.banner ? `${imagePrefix}${restaurant.banner}` : null,
        verified: restaurant.verified,
        hashtags: restaurant.hashtags,
      }));

      setRestaurants(formattedRestaurants);
    };

    fetchRestaurants();
  }, []);

  // Handle search filtering
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="angle-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurants</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color="#989999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={"#e5e8e8"}
          value={searchText}
          onChangeText={setSearchText}
        />
        <FontAwesome name="microphone" size={16} color="#989999" />
      </View>

      {/* List of Restaurants */}
      <ScrollView>
        {filteredRestaurants.map((restaurant) => (
          <View key={restaurant.id} style={styles.restaurantContainer}>
            {/* Restaurant Info */}
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>
                {restaurant.name}  {restaurant.verified && (
                  <MaterialIcons
                    name="verified"
                    size={13}
                    color="#522F60"
                  />
                )}
              </Text>
              <Text style={styles.restaurantLocation} numberOfLines={2}>{restaurant.hashtags}</Text>
            </View>

            {/* Action Icons */}
            <View style={styles.iconsContainer}>
              <TouchableOpacity 
                accessibilityLabel={`Link to ${restaurant.name}`} 
                accessibilityRole="button"
              >
                <Feather name="paperclip" size={16} color="gray" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity 
                accessibilityLabel={`Favorite ${restaurant.name}`} 
                accessibilityRole="button"
              >
                <FontAwesome name="heart-o" size={16} color="gray" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity 
                accessibilityLabel={`Share ${restaurant.name}`} 
                accessibilityRole="button"
              >
                <Ionicons name="share-outline" size={16} color="gray" style={styles.icon} />
              </TouchableOpacity>
            </View>

            {/* Restaurant Logo */}
            {restaurant.logo && (
              <TwicImg 
                src={restaurant.logo} 
                style={styles.logo} 
                resizeMode="contain" // Adjusted to fit the image correctly
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 1,
    paddingTop: 47,
    backgroundColor: "white",
    width: "100%",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#522F60",
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 1,
    marginBottom: 13,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
    height: 40,
  },
  searchIcon: {
    marginRight: 7,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "black",
  },
  restaurantContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the top
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  restaurantInfo: {
    flex: 1,
    paddingRight: 10,
  },
  restaurantName: {
    fontWeight: '600',
    fontSize: 13,
    color: '#3C3C3C',
  },
  restaurantLocation: {
    fontSize: 11,
    color: 'gray',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 7 // Align icons to the top
  },
  icon: {
    marginHorizontal: 4,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#522F60',
  },
  backButton: {
    marginRight: 10, // Add some margin for better spacing
  },
});

export default RestaurantsList;
