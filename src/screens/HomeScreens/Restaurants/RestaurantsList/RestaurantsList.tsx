import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated
} from 'react-native';
import { Ionicons, Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from "../../../../TabNavigation/navigationTypes";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { supabase } from "../../../../../backend/supabase/supabaseClient";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { shareDeepLink } from '../../../../utils/shareUtils';


// Configure TwicPics
installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

const SkeletonLoader = () => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => shimmer());
    };

    shimmer();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-350, 350],
  });

  const RestaurantSkeleton = () => (
    <View style={styles.restaurantContainer}>
      <View style={styles.restaurantInfo}>
        <View style={styles.skeletonNameContainer}>
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </View>
        <View style={styles.skeletonLocationContainer}>
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.iconsContainer}>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.skeletonIcon}>
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [{ translateX }],
                },
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.skeletonLogo}>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </View>
  );

  return (
    <>
      {[1, 2, 3, 4, 5].map((_, index) => (
        <RestaurantSkeleton key={index} />
      ))}
    </>
  );
};
const RestaurantsList = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [savedStatus, setSavedStatus] = useState<boolean[]>([]);
  const [favoriteStatus, setFavoriteStatus] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const { t } = useTranslation();
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("bottleshock_restaurants")
          .select("*");

        if (error) {
          console.error("Error fetching restaurants:", error.message);
          return;
        }

        const formattedRestaurants = data.map((restaurant: any) => ({
          Restaurants_id: restaurant.Restaurants_id,
          name: restaurant.restro_name,
          location: restaurant.location,
          logo: restaurant.logo ? `${imagePrefix}${restaurant.logo}` : null,
          verified: restaurant.verified,
          hashtags: restaurant.hashtags,
        }));
        await checkSavedRestaurants(formattedRestaurants);
        await checkFavoriteRestaurants(formattedRestaurants);
        setRestaurants(formattedRestaurants);
      } catch (error) {
        console.error("Error in fetchRestaurants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const checkSavedRestaurants = async (fetchedRestaurants: any[]) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found.");
        return;
      }

      const { data: savedRestaurants, error } = await supabase
        .from('bottleshock_saved_restaurants')
        .select('restaurant_id')
        .eq('user_id', UID);

      if (error) {
        console.error('Error fetching saved restaurants:', error.message);
        return;
      }

      const savedIds = savedRestaurants?.map((restaurant) => restaurant.restaurant_id);
      const updatedSavedStatus = fetchedRestaurants.map((restaurant) =>
        savedIds.includes(restaurant.Restaurants_id)
      );

      setSavedStatus(updatedSavedStatus);
    } catch (error) {
      console.error('Error in checkSavedRestaurants:', error);
    }
  };

  const checkFavoriteRestaurants = async (fetchedRestaurants: any[]) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found.");
        return;
      }

      const { data: favoriteRestaurants, error } = await supabase
        .from('bottleshock_fav_restaurants')
        .select('restaurant_id')
        .eq('user_id', UID);

      if (error) {
        console.error('Error fetching favorite restaurants:', error.message);
        return;
      }

      const favoriteIds = favoriteRestaurants?.map((restaurant) => restaurant.restaurant_id);
      const updatedFavoriteStatus = fetchedRestaurants.map((restaurant) =>
        favoriteIds.includes(restaurant.Restaurants_id)
      );

      setFavoriteStatus(updatedFavoriteStatus);
    } catch (error) {
      console.error('Error in checkFavoriteRestaurants:', error);
    }
  };

  const handleSavePress = async (index: number) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found.");
        return;
      }

      const restaurant = restaurants[index];
      const isSaved = savedStatus[index];

      if (isSaved) {
        const { error } = await supabase
          .from('bottleshock_saved_restaurants')
          .delete()
          .match({ user_id: UID, restaurant_id: restaurant.Restaurants_id });

        if (error) {
          console.error('Error removing restaurant:', error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('bottleshock_saved_restaurants')
          .insert([{ user_id: UID, restaurant_id: restaurant.Restaurants_id, created_at: new Date().toISOString() }]);

        if (error) {
          console.error('Error saving restaurant:', error.message);
          return;
        }
      }

      const newStatus = [...savedStatus];
      newStatus[index] = !newStatus[index];
      setSavedStatus(newStatus);
    } catch (error) {
      console.error('Error handling save press:', error);
    }
  };

  const handleFavoritePress = async (index: number) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found.");
        return;
      }

      const restaurant = restaurants[index];
      const isFavorited = favoriteStatus[index];

      if (isFavorited) {
        const { error } = await supabase
          .from('bottleshock_fav_restaurants')
          .delete()
          .match({ user_id: UID, restaurant_id: restaurant.Restaurants_id });

        if (error) {
          console.error('Error removing favorite restaurant:', error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('bottleshock_fav_restaurants')
          .insert([{ user_id: UID, restaurant_id: restaurant.Restaurants_id, created_at: new Date().toISOString() }]);

        if (error) {
          console.error('Error favoriting restaurant:', error.message);
          return;
        }
      }

      const newStatus = [...favoriteStatus];
      newStatus[index] = !newStatus[index];
      setFavoriteStatus(newStatus);
    } catch (error) {
      console.error('Error handling favorite press:', error);
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchText.toLowerCase())
  );
   const handleShare = async (Restaurant: any) => {
          const title = Restaurant.name;
          const message = Restaurant.description;
          const route = `restaurant/${Restaurant.Restaurants_id}`;
          await shareDeepLink(title, message, route);
        };
    

  return (
    <View style={styles.container}>
      
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color="#989999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('search')}
          placeholderTextColor={"#e5e8e8"}
          onFocus={() => setShowComingSoon(true)}
          onBlur={() => setShowComingSoon(false)}
        />
        {showComingSoon && (
          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonText}>{t('comingsoon')}</Text>
          </View>
        )}
        <FontAwesome name="microphone" size={16} color="#989999" />
      </View>

      <ScrollView>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          filteredRestaurants.map((restaurant, index) => (
            <Pressable onPress={() => navigation.navigate("RestaurantsDetails", { id: restaurant.Restaurants_id })} key={restaurant.Restaurants_id}>
              <View style={styles.restaurantContainer}>

               <View style={styles.restaurantInfo1}>
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>
                    {restaurant.name}{'  '}
                    </Text>
                    <Text style={styles.verified}>
                        {restaurant.verified && <MaterialIcons name="verified" size={14} color="#522F60"  />}
                    </Text>
                  </View>
                  <Text style={styles.restaurantLocation} numberOfLines={2}>{restaurant.hashtags}</Text>
                </View>


                <View style={styles.iconsContainer}>
                  <TouchableOpacity 
                    onPress={() => handleSavePress(index)}
                    accessibilityLabel={`Link to ${restaurant.name}`} 
                    accessibilityRole="button"
                  >
                    <Feather
                      name="paperclip"
                      size={16}
                      color={savedStatus[index] ? '#522F60' : 'gray'}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleFavoritePress(index)}
                    accessibilityLabel={`Favorite ${restaurant.name}`} 
                    accessibilityRole="button"
                  >
                    <FontAwesome
                      name={favoriteStatus[index] ? "heart" : "heart-o"}
                      size={16}
                      color='gray'
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    accessibilityLabel={`Share ${restaurant.name}`} 
                    accessibilityRole="button"
                    onPress={() => handleShare(restaurant)}
                  >
                    <Ionicons name="share-outline" size={16} color="gray" style={styles.icon} />
                  </TouchableOpacity>
                </View>

                {restaurant.logo ? (
                  <TwicImg 
                    src={restaurant.logo} 
                    style={styles.logo} 
                  />
                ) : (
                  <View style={styles.logo} >
                    <View style={styles.initialsPlaceholder}>
                      <Text style={styles.initialsText}>{restaurant.name.slice(0, 2).toUpperCase()}</Text>
                    </View>
                  </View>
                )}
              </View>
            </Pressable>
          ))
        )}
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
  skeletonNameContainer: {
    height: 16,
    width: '60%',
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  skeletonLocationContainer: {
    height: 16,
    width: '80%',
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  skeletonIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#E1E9EE',
    borderRadius: 8,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  skeletonLogo: {
    width: 60,
    height: 60,
    backgroundColor: '#E1E9EE',
    borderRadius: 8,
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    opacity: 0.3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 1,
    paddingTop: 55,
    backgroundColor: "white",
    width: "100%",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    flex: 1,
    alignItems: "center",
    width: '100%'
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
  restaurantInfo1: {
    flex: 1,
    paddingRight: 10,
  },
  restaurantInfo: {
    paddingRight: 10,
    flexDirection: 'row',
  },
  restaurantName: {
    fontWeight: '600',
    fontSize: 13,
    color: '#3C3C3C',
  },
  verified: {
    marginTop:  2,
  },
  restaurantLocation: {
    fontWeight: '600',
    fontSize: 13,
    color: '#3C3C3C',
    paddingTop: 4
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 15,
    backgroundColor: '#522F60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginRight: 10, // Add some margin for better spacing
  },
  comingSoonContainer: {
    position: "absolute", // Position relative to the parent container
    top: 0,              // Align at the top of the parent
    left: 18,            // Same padding as the search input
    right: 18,           // Same padding as the search input
    bottom: 0,           // Stretch to the bottom
    justifyContent: "center", // Center the text vertically
    alignItems: "center",     // Center the text horizontally
    backgroundColor: "white", // Match the background color of the input
    borderRadius: 8,          // Match the input's border radius
    zIndex: 1,                // Ensure it's above other elements
  },
  comingSoonText: {
    color: '#522F60',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RestaurantsList;
