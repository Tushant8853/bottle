import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../../../../../../backend/supabase/supabaseClient';
import { TwicImg, installTwicPics } from '@twicpics/components/react-native';

// Configure TwicPics
installTwicPics({
  domain: 'https://bottleshock.twic.pics/',
  debug: true,
  maxDPR: 3,
});

const { width } = Dimensions.get('window');

interface RestaurantData {
  id: number;
  restro_name: string;
  location: string;
  banner: string;
  verified: boolean;
}

const Restaurants: React.FC = () => {
  const [likedStatus, setLikedStatus] = useState<boolean[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const navigation = useNavigation(); // Initialize navigation hook

  const imagePrefix = 'https://bottleshock.twic.pics/file/';

  useEffect(() => {
    // Fetch restaurant data from Supabase
    const fetchRestaurants = async () => {
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

      // Limit the displayed restaurants to 4 (2 rows with 2 items each)
      setRestaurants(fetchedRestaurants.slice(0, 4));
      setLikedStatus(new Array(fetchedRestaurants.length).fill(false));
    };

    fetchRestaurants();
  }, []);

  const handleSavePress = (index: number): void => {
    const newStatus = [...likedStatus];
    newStatus[index] = !newStatus[index];
    setLikedStatus(newStatus);
  };

  return (
    <View style={styles.container}>
      <View style={styles.TitleContainer}>
        <View style={styles.leftContainer}>
          <Icons
            name="restaurant"
            size={19}
            color="#522F60"
          />
          <Text style={styles.text}>featured restaurants</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('RestaurantsList')}>
          <Icon name="chevron-right" size={16} color="#522F60" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.gridContainer}>
          {restaurants.map((restaurant, index) => (
            <View key={restaurant.id} style={styles.gridItem}>
              <View style={styles.ComponentContainer}>
                <View style={styles.imageWrapper}>
                  {restaurant.banner && (
                    <TwicImg
                      src={restaurant.banner}
                      style={styles.component}
                      resizeMode="cover"
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
                  {restaurant.verified && <Icons name="verified" size={14} color="#522F60"/>}
                </Text> 
                </View>
                <Text style={styles.subcomponentText} numberOfLines={2}>{restaurant.hashtags}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
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
    width: '48%', // Two items per row with some space between
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
});
