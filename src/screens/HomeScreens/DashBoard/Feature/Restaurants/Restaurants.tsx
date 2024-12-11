import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Animated,
} from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from "../../../../../TabNavigation/navigationTypes";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../../../../../../backend/supabase/supabaseClient';
import { TwicImg, installTwicPics } from '@twicpics/components/react-native';
import { useTranslation } from 'react-i18next';


installTwicPics({
  domain: 'https://bottleshock.twic.pics/',
  debug: true,
  maxDPR: 3,
});

const { width } = Dimensions.get('window');

interface RestaurantData {
  Restaurants_id: number;
  restro_name: string;
  location: string;
  banner: string;
  verified: boolean;
  hashtags: string[];
}
const SkeletonItem: React.FC = () => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <View style={styles.gridItem}>
      <View style={styles.ComponentContainer}>
        <View style={styles.imageWrapper}>
          <Animated.View style={[styles.skeletonImage, { opacity }]} />
          {/* Skeleton bookmark button */}
          <View style={[styles.saveButton, styles.skeletonSaveButton]}>
            <Animated.View
              style={[styles.skeletonBookmark, { opacity }]}
            />
          </View>
        </View>
        <View style={styles.skeletonContent}>
          <View style={styles.componentTitle}>
            <Animated.View
              style={[styles.skeletonTitle, { opacity }]}
            />
            <Animated.View
              style={[styles.skeletonVerified, { opacity }]}
            />
          </View>
          <Animated.View
            style={[styles.skeletonHashtags, { opacity }]}
          />
        </View>
      </View>
    </View>
  );
};

const SkeletonLoader: React.FC = () => {
  return (
    <View style={styles.gridContainer}>
      {[1, 2, 3, 4].map((item) => (
        <SkeletonItem key={item} />
      ))}
    </View>
  );
};


const Restaurants: React.FC = () => {
  const [likedStatus, setLikedStatus] = useState<boolean[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const imagePrefix = 'https://bottleshock.twic.pics/file/';
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRestaurants();
    }, [])
  );
  const fetchRestaurants = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('bottleshock_restaurants')
      .select('*');

    if (error) {
      console.error('Error fetching restaurants:', error.message);
      return;
    }

    const fetchedRestaurants = data.map((restaurant: RestaurantData) => ({
      ...restaurant,
      banner: restaurant.banner ? `${imagePrefix}${restaurant.banner}` : null,
    }));

    setRestaurants(fetchedRestaurants.slice(0, 4));
    setLikedStatus(new Array(fetchedRestaurants.length).fill(false));
    setIsLoading(false);
  };

  useEffect(() => {
    const checkSavedRestaurants = async () => {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found");
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

      const savedIds = savedRestaurants?.map((item) => item.restaurant_id) || [];
      const initialLikedStatus = restaurants.map((restaurant) =>
        savedIds.includes(restaurant.Restaurants_id)
      );
      setLikedStatus(initialLikedStatus);
    };

    if (restaurants.length > 0) {
      checkSavedRestaurants();
    }
  }, [restaurants]);

  const handleSavePress = async (index: number): void => {
    const UID = await AsyncStorage.getItem("UID");
    const newStatus = [...likedStatus];
    newStatus[index] = !newStatus[index];
    setLikedStatus(newStatus);
    const restaurantId = restaurants[index].Restaurants_id;

    if (newStatus[index]) {
      const { error } = await supabase
        .from('bottleshock_saved_restaurants')
        .insert([{ user_id: UID, restaurant_id: restaurantId }]);
      if (error) {
        console.error('Error saving restaurant:', error.message);
      }
    } else {
      const { error } = await supabase
        .from('bottleshock_saved_restaurants')
        .delete()
        .eq('user_id', UID)
        .eq('restaurant_id', restaurantId);
      if (error) {
        console.error('Error unsaving restaurant:', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.TitleContainer}>
        <View style={styles.leftContainer}>
          <Icons name="restaurant" size={19} color="#522F60" />
          <Text style={styles.text}>{t('featuredrestaurants')}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('RestaurantsList')}>
          <Icon name="chevron-right" size={16} color="#522F60" />
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <View style={styles.gridContainer}>
            {restaurants.map((restaurant, index) => (
              <View key={restaurant.Restaurants_id} style={styles.gridItem}>
                <Pressable onPress={() => navigation.navigate("RestaurantsDetails", { id: restaurant.Restaurants_id })}>
                  <View style={styles.ComponentContainer}>
                    <View style={styles.imageWrapper}>
                      {restaurant.banner && (
                        <TwicImg
                          src={restaurant.banner}
                          style={styles.component}
                        />
                      )}
                      <Pressable onPress={() => handleSavePress(index)} style={styles.saveButton}>
                        <Icon
                          name={likedStatus[index] ? 'bookmark' : 'bookmark-o'}
                          size={20}
                          color="#30425F"
                        />
                      </Pressable>
                    </View>
                    <View>
                      <View style={styles.componentTitle}>
                        <Text style={styles.componentText} numberOfLines={1}>
                          {restaurant.restro_name}{' '}
                        </Text>
                        <Text style={styles.componentText1}>
                          {restaurant.verified && <Icons name="verified" size={14} color="#522F60" />}
                        </Text>
                      </View>
                      <Text style={styles.subcomponentText} numberOfLines={2}>{restaurant.hashtags}</Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Restaurants;

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    width: '100%',
    marginBottom: 5,
    padding: 10,
    paddingBottom: 3,
  },
  TitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#522F60',
    marginLeft: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  gridItem: {
    width: '48%',
    marginBottom: 20,
  },
  imageWrapper: {
    height: 'auto',
    position: 'relative',
    paddingBottom: 1,
  },
  ComponentContainer: {
    borderRadius: 10,
    width: '100%',
    flexDirection: 'column'
  },
  component: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  componentTitle: {
    flexDirection: 'row',
  },
  componentText: {
    fontSize: 16,
    marginTop: 1,
    color: '#000',
    flexWrap: 'wrap',
    maxWidth: '90%',
    textAlign: 'left',
    fontWeight: '600',
  },
  componentText1: {
    marginTop: 5,
    textAlign: 'left',
    fontWeight: '600',
  },
  subcomponentText: {
    fontSize: 12,
    marginTop: 1,
    color: '#66605E',
    flexWrap: 'wrap',
    maxWidth: '100%',
    textAlign: 'left',
    fontWeight: '400',
  },
  saveButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
    width: 32,
    height: 32,
  },
  hashtags: {},
  skeletonImage: {
    width: '100%',
    aspectRatio: 1, // Makes it square like your images
    backgroundColor: '#E1E9EE',
    borderRadius: 10,
  },
  skeletonContent: {
    marginTop: 8,
    width: '100%',
  },
  skeletonTitle: {
    width: '75%',
    height: 16,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  skeletonVerified: {
    width: 14,
    height: 14,
    backgroundColor: '#E1E9EE',
    borderRadius: 7,
    marginLeft: 4,
    marginTop: 5,
  },
  skeletonHashtags: {
    width: '85%',
    height: 12,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginTop: 6,
  },
  skeletonSaveButton: {
    backgroundColor: '#E1E9EE',
  },
  skeletonBookmark: {
    width: 20,
    height: 20,
    backgroundColor: '#D0D9E1',
    borderRadius: 2,
  },
});
