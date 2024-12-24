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


// Configure TwicPics
installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

const SkeletonLoader = () => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const animation = Animated.loop(
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
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.wineryContainer}>
        <View style={styles.wineryInfo}>
          <Animated.View style={[styles.skeletonText, { opacity }]} />
          <Animated.View style={[styles.skeletonSubText, { opacity }]} />
        </View>
        <View style={styles.iconsContainer}>
          {[1, 2, 3].map((_, index) => (
            <Animated.View
              key={index}
              style={[styles.skeletonIcon, { opacity }]}
            />
          ))}
        </View>
        <Animated.View style={[styles.skeletonLogo, { opacity }]} />
      </View>
    </View>
  );
};


const WineriesList = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState('');
  const [wineries, setWineries] = useState<any[]>([]);
  const [savedStatus, setSavedStatus] = useState<boolean[]>([]);
  const [favoriteStatus, setFavoriteStatus] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const { t } = useTranslation();
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const fetchWineries = async () => {
      try {
        const { data, error } = await supabase
          .from("bottleshock_wineries")
          .select("wineries_id, winery_name, address, verified, banner, logo");

        if (error) {
          console.error("Error fetching wineries:", error.message);
          return;
        }

        const formattedWineries = data.map((winery: any) => ({
          id: winery.wineries_id,
          name: winery.winery_name,
          address: winery.address,
          logo: winery.logo ? `${imagePrefix}${winery.logo}` : null,
          verified: winery.verified,
        }));
        await checkSavedWineries(formattedWineries);
        await checkFavoriteWineries(formattedWineries);
        setWineries(formattedWineries);
      } catch (error) {
        console.error("Error in fetchWineries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWineries();
  }, []);

  const checkSavedWineries = async (fetchedWineries: any[]) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found.");
        return;
      }

      const { data: savedWineries, error } = await supabase
        .from('bottleshock_saved_wineries')
        .select('winery_id')
        .eq('user_id', UID);

      if (error) {
        console.error('Error fetching saved wineries:', error.message);
        return;
      }

      const savedIds = savedWineries?.map((winery) => winery.winery_id);
      const updatedSavedStatus = fetchedWineries.map((winery) =>
        savedIds.includes(winery.id)
      );

      setSavedStatus(updatedSavedStatus);
    } catch (error) {
      console.error('Error in checkSavedWineries:', error);
    }
  };

  const checkFavoriteWineries = async (fetchedWineries: any[]) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found.");
        return;
      }

      const { data: favoriteWineries, error } = await supabase
        .from('bottleshock_fav_wineries')
        .select('winery_id')
        .eq('user_id', UID);

      if (error) {
        console.error('Error fetching favorite wineries:', error.message);
        return;
      }

      const favoriteIds = favoriteWineries?.map((winery) => winery.winery_id);
      const updatedFavoriteStatus = fetchedWineries.map((winery) =>
        favoriteIds.includes(winery.id)
      );

      setFavoriteStatus(updatedFavoriteStatus);
    } catch (error) {
      console.error('Error in checkFavoriteWineries:', error);
    }
  };

  const handleSavePress = async (index: number) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found.");
        return;
      }

      const winery = wineries[index];
      const isSaved = savedStatus[index];

      if (isSaved) {
        const { error } = await supabase
          .from('bottleshock_saved_wineries')
          .delete()
          .match({ user_id: UID, winery_id: winery.id });

        if (error) {
          console.error('Error removing winery:', error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('bottleshock_saved_wineries')
          .insert([{ user_id: UID, winery_id: winery.id, created_at: new Date().toISOString() }]);

        if (error) {
          console.error('Error saving winery:', error.message);
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

      const winery = wineries[index];
      const isFavorited = favoriteStatus[index];

      if (isFavorited) {
        const { error } = await supabase
          .from('bottleshock_fav_wineries')
          .delete()
          .match({ user_id: UID, winery_id: winery.id });

        if (error) {
          console.error('Error removing favorite winery:', error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('bottleshock_fav_wineries')
          .insert([{ user_id: UID, winery_id: winery.id, created_at: new Date().toISOString() }]);

        if (error) {
          console.error('Error favoriting winery:', error.message);
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

  // Handle search filtering
  const filteredWineries = wineries.filter((winery) =>
    winery.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>      
      {/* Search Bar */}
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

      {/* List of Wineries */}
      <ScrollView>
        {isLoading ? (
          // Show skeleton loaders while loading
          [...Array(5)].map((_, index) => (
            <SkeletonLoader key={index} />
          ))
        ) : (
          filteredWineries.map((winery, index) => (
            <Pressable onPress={() => navigation.navigate("WineriesDetails", { id: winery.id })} key={winery.id}>
              <View style={styles.wineryContainer}>
                {/* Winery Info */}
                <View style={styles.wineryInfo1}>
                 <View style={styles.wineryInfo}>
                  <Text style={styles.wineryName} numberOfLines={1}>
                    {winery.name}{'  '}
                    </Text>
                   <Text style={styles.verified}>
                        {winery.verified && <MaterialIcons name="verified" size={14} color="#522F60"  />}
                    </Text>
                 </View>
                  <Text style={styles.wineryLocation}>{winery.address}</Text>
                </View>

                {/* Action Icons */}
                <View style={styles.iconsContainer}>
                  <TouchableOpacity 
                    onPress={() => handleSavePress(index)}
                    accessibilityLabel={`Link to ${winery.name}`} 
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
                    accessibilityLabel={`Favorite ${winery.name}`} 
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
                    accessibilityLabel={`Share ${winery.name}`} 
                    accessibilityRole="button"
                  >
                    <Ionicons name="share-outline" size={16} color="gray" style={styles.icon} />
                  </TouchableOpacity>
                </View>

                {/* Winery Logo */}
                {winery.logo ? (
                  <TwicImg 
                    src={winery.logo} 
                    style={styles.logo} 
                  />
                ) : (
                  <View style={styles.logo}>
                    <View style={styles.initialsPlaceholder}>
                      <Text style={styles.initialsText}>{winery.name.slice(0, 2).toUpperCase()}</Text>
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
  wineryContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  wineryInfo: {
    paddingRight: 10,
    flexDirection: 'row',
  },
  wineryInfo1: {
    flex: 1,
    paddingRight: 10,
  },
  wineryName: {
    fontWeight: '600',
    fontSize: 13,
    color: '#3C3C3C',
    
  },
  wineryLocation: {
    fontWeight: '400',
    fontSize: 11,
    color: '#808080',
    paddingTop: 4
   
  },
  verified: {
    marginTop:  2,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 7,
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
    marginRight: 10,
  },
  skeletonContainer: {
    paddingHorizontal: 16,
  },
  skeletonText: {
    height: 14,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: '60%',
    marginBottom: 8,
  },
  skeletonSubText: {
    height: 12,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: '40%',
  },
  skeletonIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#E1E9EE',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  skeletonLogo: {
    width: 60,
    height: 60,
    backgroundColor: '#E1E9EE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E9EE',
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

export default WineriesList;
