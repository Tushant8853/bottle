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


const Favouritewineries = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [wineries, setWineries] = useState<any[]>([]);
  const [savedStatus, setSavedStatus] = useState<boolean[]>([]);
  const [favoriteStatus, setFavoriteStatus] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const { t } = useTranslation();


  useEffect(() => {
    const fetchSavedwineries = async () => {
      try {
        setIsLoading(true);
        const UID = await AsyncStorage.getItem("UID");
        if (!UID) {
          console.error("User ID not found.");
          return;
        }

        // Fetch saved restaurants
        const { data: savedData, error: savedError } = await supabase
          .from("bottleshock_fav_wineries")
          .select("winery_id")
          .eq("user_id", UID);

        if (savedError) {
          console.error("Error fetching saved wineries:", savedError.message);
          return;
        }

        const savedIds = savedData?.map((item) => item.winery_id);

        // Fetch restaurant details for saved restaurants
        const { data: wineriesData, error: wineriesError } = await supabase
          .from("bottleshock_wineries")
          .select("*")
          .in("wineries_id", savedIds || []);

        if (wineriesError) {
          console.error("Error fetching winery details:", wineriesError.message);
          return;
        }

        const formattedwineries = wineriesData.map((winery: any) => ({
          id: winery.wineries_id,
          name: winery.winery_name,
          location: winery.location,
          address: winery.address,
          logo: winery.logo ? `${imagePrefix}${winery.logo}` : null,
          verified: winery.verified,
          hashtags: winery.hashtags,
        }));

        // Set saved status and update saved restaurants
        setWineries(formattedwineries);
        setSavedStatus(new Array(formattedwineries.length).fill(true));

        // Fetch favorite status for these restaurants
        const { data: favoriteData, error: favoriteError } = await supabase
          .from("bottleshock_saved_wineries")
          .select("winery_id")
          .eq("user_id", UID);

        if (favoriteError) {
          console.error("Error fetching favorite wineries:", favoriteError.message);
          return;
        }

        const favoriteIds = favoriteData?.map((item) => item.winery_id);
        const updatedFavoriteStatus = formattedwineries.map((winery) =>
          favoriteIds.includes(winery.id)
        );

        setFavoriteStatus(updatedFavoriteStatus);
      } catch (error) {
        console.error("Error in fetchSavedWineries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedwineries();
  }, []);

  const handleSavePress = async (index: number) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found.");
        return;
      }

      const winery = wineries[index];
      const isSaved = favoriteStatus[index];

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

      const newStatus = [...favoriteStatus];
      newStatus[index] = !newStatus[index];
      setFavoriteStatus(newStatus);
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
      const isFavorited = savedStatus[index];

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

      const newStatus = [...savedStatus];
      newStatus[index] = !newStatus[index];
      setSavedStatus(newStatus);
    } catch (error) {
      console.error('Error handling favorite press:', error);
    }
  };


  return (
    <View style={styles.container}>
      {/* List of Wineries */}
      <ScrollView>
        {isLoading ? (
          // Show skeleton loaders while loading
          [...Array(5)].map((_, index) => (
            <SkeletonLoader key={index} />
          ))
        ) : wineries.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>{t('Nodataavailable')}</Text>
            </View>
        ) : (
            wineries.map((winery, index) => (
            <Pressable onPress={() => navigation.navigate("WineriesDetails", { id: winery.id })} key={winery.id}>
              <View style={styles.wineryContainer}>
                {/* Winery Info */}
                <View style={styles.wineryInfo}>
                  <Text style={styles.wineryName}>
                    {winery.name} {winery.verified && (
                      <MaterialIcons
                        name="verified"
                        size={13}
                        color="#522F60"
                      />
                    )}
                  </Text>
                  <Text style={styles.wineryLocation}>{winery.location}</Text>
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
                      color={favoriteStatus[index] ? '#522F60' : 'gray'}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleFavoritePress(index)}
                    accessibilityLabel={`Favorite ${winery.name}`} 
                    accessibilityRole="button"
                  >
                    <FontAwesome
                      name={savedStatus[index] ? "heart" : "heart-o"}
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
    paddingBottom: 10,
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
});

export default Favouritewineries;
