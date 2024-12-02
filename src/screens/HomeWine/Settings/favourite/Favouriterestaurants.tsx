import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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

const Favouriterestaurants = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [savedRestaurants, setSavedRestaurants] = useState<any[]>([]);
    const [savedStatus, setSavedStatus] = useState<boolean[]>([]);
    const [favoriteStatus, setFavoriteStatus] = useState<boolean[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const imagePrefix = "https://bottleshock.twic.pics/file/";
    const { t } = useTranslation();
  
    useEffect(() => {
      const fetchSavedRestaurants = async () => {
        try {
          setIsLoading(true);
          const UID = await AsyncStorage.getItem("UID");
          if (!UID) {
            console.error("User ID not found.");
            return;
          }
  
          // Fetch saved restaurants
          const { data: savedData, error: savedError } = await supabase
            .from("bottleshock_fav_restaurants")
            .select("restaurant_id")
            .eq("user_id", UID);
  
          if (savedError) {
            console.error("Error fetching saved restaurants:", savedError.message);
            return;
          }
  
          const savedIds = savedData?.map((item) => item.restaurant_id);
  
          // Fetch restaurant details for saved restaurants
          const { data: restaurantsData, error: restaurantsError } = await supabase
            .from("bottleshock_restaurants")
            .select("*")
            .in("Restaurants_id", savedIds || []);
  
          if (restaurantsError) {
            console.error("Error fetching restaurant details:", restaurantsError.message);
            return;
          }
  
          const formattedRestaurants = restaurantsData.map((restaurant: any) => ({
            Restaurants_id: restaurant.Restaurants_id,
            name: restaurant.restro_name,
            location: restaurant.location,
            logo: restaurant.logo ? `${imagePrefix}${restaurant.logo}` : null,
            verified: restaurant.verified,
            hashtags: restaurant.hashtags,
          }));
  
          // Set saved status and update saved restaurants
          setSavedRestaurants(formattedRestaurants);
          setSavedStatus(new Array(formattedRestaurants.length).fill(true));
  
          // Fetch favorite status for these restaurants
          const { data: favoriteData, error: favoriteError } = await supabase
            .from("bottleshock_saved_restaurants")
            .select("restaurant_id")
            .eq("user_id", UID);
  
          if (favoriteError) {
            console.error("Error fetching favorite restaurants:", favoriteError.message);
            return;
          }
  
          const favoriteIds = favoriteData?.map((item) => item.restaurant_id);
          const updatedFavoriteStatus = formattedRestaurants.map((restaurant) =>
            favoriteIds.includes(restaurant.Restaurants_id)
          );
  
          setFavoriteStatus(updatedFavoriteStatus);
        } catch (error) {
          console.error("Error in fetchSavedRestaurants:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchSavedRestaurants();
    }, []);
  
    const handleSavePress = async (index: number) => {
      try {
        const UID = await AsyncStorage.getItem("UID");
        if (!UID) {
          console.error("User ID not found.");
          return;
        }
  
        const restaurant = savedRestaurants[index];
        const isSaved = favoriteStatus[index];
  
        if (isSaved) {
          const { error } = await supabase
            .from("bottleshock_saved_restaurants")
            .delete()
            .match({ user_id: UID, restaurant_id: restaurant.Restaurants_id });
  
          if (error) {
            console.error("Error removing restaurant:", error.message);
            return;
          }
        } else {
          const { error } = await supabase
            .from("bottleshock_saved_restaurants")
            .insert([{ user_id: UID, restaurant_id: restaurant.Restaurants_id, created_at: new Date().toISOString() }]);
  
          if (error) {
            console.error("Error saving restaurant:", error.message);
            return;
          }
        }
  
        const newStatus = [...favoriteStatus];
        newStatus[index] = !newStatus[index];
        setFavoriteStatus(newStatus);
      } catch (error) {
        console.error("Error handling save press:", error);
      }
    };
  
    const handleFavoritePress = async (index: number) => {
      try {
        const UID = await AsyncStorage.getItem("UID");
        if (!UID) {
          console.error("User ID not found.");
          return;
        }
  
        const restaurant = savedRestaurants[index];
        const isFavorited = savedStatus[index];
  
        if (isFavorited) {
          const { error } = await supabase
            .from("bottleshock_fav_restaurants")
            .delete()
            .match({ user_id: UID, restaurant_id: restaurant.Restaurants_id });
  
          if (error) {
            console.error("Error removing favorite restaurant:", error.message);
            return;
          }
        } else {
          const { error } = await supabase
            .from("bottleshock_fav_restaurants")
            .insert([{ user_id: UID, restaurant_id: restaurant.Restaurants_id, created_at: new Date().toISOString() }]);
  
          if (error) {
            console.error("Error favoriting restaurant:", error.message);
            return;
          }
        }
  
        const newStatus = [...savedStatus];
        newStatus[index] = !newStatus[index];
        setSavedStatus(newStatus);
      } catch (error) {
        console.error("Error handling favorite press:", error);
      }
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <FontAwesome name="angle-left" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('favourite_restaurants')}</Text>
        </View>
  
        <ScrollView>
          {isLoading ? (
            <SkeletonLoader />
        ) : savedRestaurants.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>{t('Nodataavailable')}</Text>
            </View>
          ) : (
            savedRestaurants.map((restaurant, index) => (
              <Pressable
                onPress={() => navigation.navigate("RestaurantsDetails", { id: restaurant.Restaurants_id })}
                key={restaurant.Restaurants_id}
              >
                <View style={styles.restaurantContainer}>
                  <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>
                      {restaurant.name}{" "}
                      {restaurant.verified && <MaterialIcons name="verified" size={13} color="#522F60" />}
                    </Text>
                    <Text style={styles.restaurantLocation} numberOfLines={2}>
                      {restaurant.hashtags}
                    </Text>
                  </View>
                  <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={() => handleSavePress(index)}>
                      <Feather
                        name="paperclip"
                        size={16}
                        color={favoriteStatus[index] ? "#522F60" : "gray"}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleFavoritePress(index)}>
                      <FontAwesome
                        name={ savedStatus[index] ? "heart" : "heart-o"}
                        size={16}
                        color="gray"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Ionicons name="share-outline" size={16} color="gray" style={styles.icon} />
                    </TouchableOpacity>
                  </View>
                  {restaurant.logo ? (
                    <TwicImg src={restaurant.logo} style={styles.logo} />
                  ) : (
                    <View style={styles.logo}>
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
      fontWeight: '600',
      fontSize: 13,
      color: '#3C3C3C',
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
    noDataContainer: {
   
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 120,
      },
      noDataText: {
        fontSize: 16,
        color: '#808080',
        textAlign: 'center',
      },
  });

export default Favouriterestaurants;
