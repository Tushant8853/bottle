import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Pressable,
  Linking,
  Alert,
  Dimensions,
  Animated
} from "react-native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../../TabNavigation/navigationTypes";
import { supabase } from "../../../../../backend/supabase/supabaseClient";
import { TwicImg } from "@twicpics/components/react-native";
import DiscoverWines from "./Feature/WineEnjoyed";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from 'react-i18next';
import { shareDeepLink } from "../../../../utils/shareUtils";
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';



const { width } = Dimensions.get("window");

type RestaurantsDetailsRouteProp = RouteProp<
  RootStackParamList,
  "RestaurantsDetails"
>;

interface RestaurantDetails {
  id: string;
  name: string;
  banner: string;
  description: string;
  location: string;
  phone: string;
  working_hours: string;
  star_rating: number;
  seasons_open: string;
  likes: number;
  hashtags: string[];
  location_lat: number;
  location_long: number;
}

interface MemoryData {
  id: string;
  file: string;
}

const SkeletonComponent = () => {
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

    return () => {
      animation.stop();
    };
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.skeletonImage, { opacity }]} />
      <View style={styles.buttonContainer}>
        {[1, 2, 3].map((i) => (
          <Animated.View
            key={i}
            style={[styles.skeletonButton, { opacity }]}
          />
        ))}
      </View>

      <View style={styles.memoriesContainer}>
        <View style={styles.memoriesHeaderContainer}>
          <Animated.View
            style={[styles.skeletonMemoriesHeader, { opacity }]}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.memories}
        >
          {[1, 2, 3, 4].map((i) => (
            <Animated.View
              key={i}
              style={[styles.skeletonMemoryImage, { opacity }]}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.descriptionContainer}>
        {[1, 2, 3].map((i) => (
          <Animated.View
            key={i}
            style={[styles.skeletonDescription, { opacity }]}
          />
        ))}
      </View>

      <Animated.View style={[styles.skeletonMap, { opacity }]} />

      <View style={styles.InfoContainer}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.contactRow}>
            <Animated.View
              style={[styles.skeletonInfoItem, { opacity }]}
            />
            {i === 1 && (
              <Animated.View
                style={[styles.skeletonContactButton, { opacity }]}
              />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const RestaurantsDetails = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RestaurantsDetailsRouteProp>();
  const { id: RestaurantId } = route.params;
  const [Restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [memoriesData, setMemoriesData] = useState<MemoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteStatus, setFavoriteStatus] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const [expandedwinery, setExpandedRestaurant] = useState<string | null>(null);
  const { t } = useTranslation();
  const [localImages, setlocalImages] = useState<string[]>([]);
    
    
  useFocusEffect(
     useCallback(() => {
       fetchSavedImages();
     }, [])
   );

   const fetchSavedImages = async () => {
     try {
       const images = JSON.parse(await AsyncStorage.getItem('savedImages') || '[]');
       console.log(images);
       const fileNames = images.map((path: string) => path.split('/').pop());
       console.log('filenames:::::::',fileNames);
       setlocalImages(fileNames);
           console.log('savedImages:::::::',localImages);
     
 
     } catch (error) {
       console.error("Error fetching saved images:", error);
     }
   };

  const handleToggleDescription = (id: string) => {
    setExpandedRestaurant((prev) => (prev === id ? null : id));
  };

  const handlePhoneCall = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert("Error", "Unable to make the call");
    });
  };

  useEffect(() => {
    const fetchRestaurantAndMemories = async () => {
      try {
        const { data: RestaurantData, error: wineryError } = await supabase
          .from("bottleshock_restaurants")
          .select(
            "Restaurants_id, restro_name, banner, description, address, phone, working_hours,star_rating, seasons_open, likes, hashtags, location_lat, location_long "
          )
          .eq("Restaurants_id", RestaurantId)
          .single();

        if (wineryError) throw new Error(wineryError.message);

        if (RestaurantData) {
          setRestaurant({
            id: RestaurantData.Restaurants_id,
            name: RestaurantData.restro_name,
            banner: `${imagePrefix}${RestaurantData.banner}`,
            description: RestaurantData.description,
            location: RestaurantData.address,
            phone: RestaurantData.phone,
            working_hours: RestaurantData.working_hours,
            star_rating: RestaurantData.star_rating,
            seasons_open: RestaurantData.seasons_open,
            likes: RestaurantData.likes,
            hashtags: RestaurantData.hashtags.split(", "),
            location_lat: RestaurantData.location_lat,
            location_long: RestaurantData.location_long,
          });
          await checkFavoriteStatus(RestaurantData.Restaurants_id);
          await checkSavedStatus(RestaurantData.Restaurants_id);
          const memoryName = RestaurantData.restro_name;
          navigation.setOptions({ headerTitle: memoryName });
        }

        // Fetch memories and related images
        const { data: memoriesDataResponse, error: memoriesError } =
          await supabase
            .from("bottleshock_memories")
            .select("id")
            .eq("is_public", true)
            .eq("restaurant_id", RestaurantId);

        if (memoriesError) throw new Error(memoriesError.message);

        const memoryIds = memoriesDataResponse.map((memory) => memory.id);

        if (memoryIds.length > 0) {
          const { data: imagesData, error: imagesError } = await supabase
            .from("bottleshock_memory_gallery")
            .select("memory_id, file")
            .eq("is_thumbnail", true)
            .in("memory_id", memoryIds);

          if (imagesError) throw new Error(imagesError.message);

          setMemoriesData(
            imagesData.map((img) => ({
              id: img.memory_id,
              file: `${imagePrefix}${img.file}`,
            }))
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching winery and memories details:", error);
        setLoading(false);
      }
    };

    fetchRestaurantAndMemories();
  }, [RestaurantId]);

  const checkFavoriteStatus = async (restaurantId: string) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) return;

      const { data: favorites, error } = await supabase
        .from("bottleshock_fav_restaurants")
        .select("restaurant_id")
        .eq("user_id", UID)
        .eq("restaurant_id", restaurantId);

      if (error) {
        console.error("Error fetching favorite status:", error.message);
        return;
      }

      setFavoriteStatus(favorites.length > 0);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const checkSavedStatus = async (restaurantId: string) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) return;

      const { data: savedRestaurants, error } = await supabase
        .from("bottleshock_saved_restaurants")
        .select("restaurant_id")
        .eq("user_id", UID)
        .eq("restaurant_id", restaurantId);

      if (error) {
        console.error("Error fetching saved status:", error.message);
        return;
      }

      setSavedStatus(savedRestaurants.length > 0);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleFavoritePress = async () => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) return;

      if (favoriteStatus) {
        const { error } = await supabase
          .from("bottleshock_fav_restaurants")
          .delete()
          .match({ user_id: UID, restaurant_id: Restaurant.id });

        if (error) {
          console.error("Error removing favorite restaurant:", error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from("bottleshock_fav_restaurants")
          .insert([
            {
              user_id: UID,
              restaurant_id: Restaurant.id,
              created_at: new Date().toISOString(),
            },
          ]);

        if (error) {
          console.error("Error favoriting restaurant:", error.message);
          return;
        }
      }

      setFavoriteStatus(!favoriteStatus);
    } catch (error) {
      console.error("Error handling favorite press:", error);
    }
  };

  const handleSavePress = async () => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) return;

      if (savedStatus) {
        const { error } = await supabase
          .from("bottleshock_saved_restaurants")
          .delete()
          .match({ user_id: UID, restaurant_id: Restaurant.id });

        if (error) {
          console.error("Error removing saved restaurant:", error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from("bottleshock_saved_restaurants")
          .insert([
            {
              user_id: UID,
              restaurant_id: Restaurant.id,
              created_at: new Date().toISOString(),
            },
          ]);

        if (error) {
          console.error("Error saving restaurant:", error.message);
          return;
        }
      }

      setSavedStatus(!savedStatus);
    } catch (error) {
      console.error("Error handling save press:", error);
    }
  };

  if (loading) {
    return <SkeletonComponent />;
  }

  if (!Restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Restaurant details not found.</Text>
      </View>
    );
  }
    const handleShare = async () => {
        const title = Restaurant.name;
        const message = Restaurant.description;
        const route = `restaurant/${Restaurant.id}`;
        await shareDeepLink(title, message, route);
      };
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {Restaurant.banner ? (
          <TwicImg src={Restaurant.banner} style={styles.headerimage} />
        ) : (
          <Image source={HeaderImg} style={styles.headerimage} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.titletext} numberOfLines={2}>{Restaurant.name}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleSavePress}>
            <Ionicons
              name="attach"
              size={24}
              color={savedStatus ? "#522F60" : "gray"}
              style={styles.rotatedIcon}
            />
          </Pressable>
          <Pressable style={styles.button} onPress={handleFavoritePress}>
            <Ionicons
              name={favoriteStatus ? "heart" : "heart-outline"}
              size={24}
            />
          </Pressable>
          <Pressable style={styles.button} onPress={() => handleShare()}>
            <Ionicons name="share-outline" size={24} />
          </Pressable>
        </View>
      </View>
      <View style={styles.memoriesContainer}>
        <View style={styles.memoriesHeaderContainer}>
          <View style={styles.leftContent}>
            <FontAwesome
              style={styles.memoriesIcons}
              name="image"
              size={16}
              color="#522F60"
            />
            <Text style={styles.memoriesHeadertext}> {t('Memories')}</Text>
          </View>
        </View>

        <View style={styles.memoriesMainContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.memories}
          >
            {memoriesData.length > 0 ? (
              memoriesData.map((memory) => {
                  const filename =memory.file ?memory.file.split('/').pop() : 'No thumbnail available';
                           console.log('Updated filename:', filename);
                               const localImage = localImages.find((image) => image === filename);
                               console.log('localImage',localImage)
                           
                               // Dynamic prefix based on the platform
                               const PREFIX = Platform.OS === 'ios'
                                 ? FileSystem.documentDirectory
                                 : 'file:///data/user/0/host.exp.exponent/files/';
                             
                               const FinalImage = localImage ? `${PREFIX}${localImage}` : null;
                return(
                <Pressable
                  key={memory.id}
                  onPress={() =>
                    navigation.navigate("MemoriesDetails", { id: memory.id })
                  }
                >
                  {FinalImage ? (
                    // Display the locally saved image using FileSystem
                    <Image
                    source={{ uri: FinalImage }}
                      style={styles.memoriesImage}
                    />
                  ) : (
                  <TwicImg src={memory.file} style={styles.memoriesImage} />
                )}
                </Pressable>
               ) })
            ) : (
              <View style={styles.memoriesHeadertex}>
                <Text style={styles.memoriesHeaderte}>
                  {t('nomemoriesavailable')}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <View style={styles.descriptionIconsContainer}>
          <Feather
            style={styles.descriptionIcons}
            name="file-text"
            size={16}
            color="#522F60"
          />
        </View>
        <View style={styles.descriptionTextContainer}>
          <Pressable
            style={[
              styles.descriptiontextContainer,
              expandedwinery === Restaurant.id && { height: "auto" }, // Auto height when expanded
            ]}
            onPress={() => handleToggleDescription(Restaurant.id)}
          >
            <Text
              style={styles.descriptionText}
              numberOfLines={expandedwinery === Restaurant.id ? undefined : 5}
            >
              {Restaurant.description}
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.MapContainer}>
        <MapView
          style={styles.mapSDKContainer}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: Restaurant.location_lat,
            longitude: Restaurant.location_long,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: Restaurant.location_lat,
              longitude: Restaurant.location_long,
            }}
            title={Restaurant.name}
          />
        </MapView>
        <View style={styles.fulladdress}>
          <View style={styles.MapIconsContainer}>
            <Ionicons
              name="pin"
              size={16}
              color="#522F60"
              style={styles.Mapicon}
            />
          </View>
          <View style={styles.fulladdressTextContainer}>
            <Text style={styles.fulladdressText} numberOfLines={1}>
              {Restaurant.location}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.InfoContainer}>
        <View style={styles.contactRow}>
          <View style={styles.infocomponent}>
            <Ionicons
              name="call-outline"
              size={18}
              color="#522F60"
              style={styles.icon}
            />
            <View style={styles.separator} />
            <Text style={styles.contactText}>{Restaurant.phone}</Text>
          </View>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handlePhoneCall(Restaurant.phone)}
          >
            <Ionicons name="call-outline" size={18} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.contactRow}>
          <View style={styles.infocomponent}>
            <Ionicons
              name="time-outline"
              size={18}
              color="#522F60"
              style={styles.icon}
            />
            <View style={styles.separator} />
            <Text style={styles.time}>{Restaurant.working_hours}</Text>
          </View>
          <View style={styles.infocomponent}>
            <MaterialIcons
              name="event"
              size={18}
              color="#522F60"
              style={styles.icon}
            />
            <View style={styles.separator} />
            <Text style={styles.date}>{Restaurant.seasons_open}</Text>
          </View>
        </View>
        <View style={styles.contactRow}>
          <View style={styles.infocomponent}>
            <FontAwesome
              name="star"
              size={18}
              color="#522F60"
              style={styles.icon}
            />
            <View style={styles.separator} />
            <Text style={styles.rating}>{Restaurant.star_rating}</Text>
          </View>
          <View style={styles.infocomponent}>
            <FontAwesome
              name="thumbs-up"
              size={18}
              color="#522F60"
              style={styles.icon}
            />
            <View style={styles.separator} />
            <Text style={styles.likes}>{Restaurant.likes}</Text>
          </View>
        </View>

        <View style={styles.infocomponent}>
          <MaterialIcons
            name="tag"
            size={18}
            color="#522F60"
            style={styles.icon}
          />
          <View style={styles.separator} />
          <Text style={styles.hashtags}>{Restaurant.hashtags}</Text>
        </View>
      </View>
      <View style={styles.bottom}></View>
    </ScrollView>
  );
};

export default RestaurantsDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  bottom: {
    marginBottom: 200,
  },
  imageContainer: {
    position: "relative",
  },
  headerimage: {
    height: 320,
    width: "100%",
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  buttonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: "white",
    borderRadius: 5,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  rotatedIcon: {
    transform: [{ rotate: "45deg" }],
  },
  titletext: {
    color: "white",
    fontSize: 32,
    fontWeight: "600",
    position: "absolute",
    bottom: 25,
    left: 16,
    width:'90%'
  },
  textContainer: {},
  //////////////////////////////////////////descriptionContainer//////////////////////
  descriptionContainer: {
    borderWidth: 1,
    marginHorizontal: 16,
    borderRadius: 4,
    borderColor: "#522F6080",
    flexDirection: "row",
  },
  descriptionIconsContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    height: 30,
    width: 32,
    borderColor: "#522F6080",
  },
  descriptionTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  descriptionText: {
    fontFamily: "Hiragino Sans",
    fontSize: 14,
    fontWeight: "300",
    lineHeight: 21,
    textAlign: "left",
  },
  descriptionIcons: {},
  descriptiontextContainer: {},
  //////////////////////////////////////////Date and Time //////////////////////////////////////////
  datecontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#522F6080",
    marginTop: 4,
    height: 30,
    borderRadius: 4,
  },
  DateTextContainer: {
    marginLeft: 10,
  },
  dateText: {
    fontFamily: "SF Pro",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 19.09,
    textAlign: "left",
    color: "#522F60",
  },
  //////////////////////////////////////////Pic and Video //////////////////////////////////////////
  memoriesContainer: {
    marginTop: 29,
    borderRadius: 4,
    borderColor: "#522F6080",
    height: 140,
  },
  memoriesHeaderContainer: {
    height: 22,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  memoriesHeadertext: {
    fontFamily: "Hiragino Sans",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 22,
    letterSpacing: 0.02,
    color: "#522F60",
  },
  memoriesHeadertex: {
    color: "grey",
    left: (width / 2) - 90,
    height: 100,
    flex: 1,
    justifyContent: "center", // Centers vertically
    alignItems: "center",
  },
  memoriesHeaderte: {
    fontFamily: "Hiragino Sans",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 22,
    letterSpacing: 0.02,
    color: "grey",
  },
  memoriesMainContainer: {
    marginTop: 4,
    marginLeft: 16,
  },
  memories: {
    flexDirection: "row",
  },
  memoriesImage: {
    width: 100,
    height: 100,
    marginHorizontal: 1,
  },
  selectIcons: {
    position: "absolute",
    top: 7,
    right: 7,
  },
  memoriesIcons: {},
  rightContent: {},
  memoriesArrowIcons: {},
  ///////////////////////////////////// Map ///////////////////////////////////////////
  MapContainer: {
  },
  MapIconsContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    height: 30,
    width: 32,
    borderColor: "#522F6080",
  },
  fulladdress: {
    //marginTop:1,
    marginHorizontal: 16,
    borderRadius: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#522F6080",
    height: 30,
    flexDirection: "row",
  },
  fulladdressTextContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  fulladdressText: {
    fontFamily: "SF Pro",
    fontSize: 14,
    color: "#522F60",
  },
  Mapicon: {},
  ////////////////////////////////
  mapSDKContainer: {
    marginHorizontal: 16,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#522F6080",
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  ////////////////////////////////////////// Contact Info //////////////////////////////////////////
  InfoContainer: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  infocomponent: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#522F6080",
    borderRadius: 4,
    height: 30,
    marginVertical: 4,
    marginRight: 4,
    paddingHorizontal: 8,
    width: 'auto',
    flex: 1
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1
  },
  contactText: {
    fontSize: 14,
    color: "#522F60",
    flex: 1, // This allows the text to take up available space
    paddingLeft: 8,
  },
  time: {
    fontSize: 14,
    color: "#522F60",
    flex: 1, // This allows the text to take up available space
    paddingLeft: 8,
  },
  date: {
    fontSize: 14,
    color: "#522F60",
    flex: 1, // This allows the text to take up available space
    paddingLeft: 8,
  },
  rating: {
    fontSize: 14,
    color: "#522F60",
    flex: 1, // This allows the text to take up available space
    paddingLeft: 8,
  },
  likes: {
    fontSize: 14,
    color: "#522F60",
    flex: 1, // This allows the text to take up available space
    paddingLeft: 8,
  },
  contactButton: {
    backgroundColor: "#522F60",
    borderRadius: 4,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    width: 1,
    height: "100%",
    backgroundColor: "#522F6080",
    marginHorizontal: 5,
  },
  hashtags: {
    fontSize: 14,
    color: "#522F60",
  },
  icon: {},
  errorText: {},
  loading: {},
  skeletonImage: {
    height: 320,
    width: "100%",
    backgroundColor: "#E1E9EE",
  },
  skeletonButton: {
    width: 40,
    height: 40,
    backgroundColor: "#E1E9EE",
    borderRadius: 5,
  },
  skeletonMemoriesHeader: {
    height: 22,
    width: 100,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
  },
  skeletonMemoryImage: {
    width: 100,
    height: 100,
    backgroundColor: "#E1E9EE",
    marginHorizontal: 1,
    borderRadius: 4,
  },
  skeletonDescription: {
    height: 16,
    backgroundColor: "#E1E9EE",
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 4,
  },
  skeletonMap: {
    height: 140,
    marginHorizontal: 16,
    backgroundColor: "#E1E9EE",
    borderRadius: 8,
    marginVertical: 16,
  },
  skeletonInfoItem: {
    height: 30,
    flex: 1,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    marginVertical: 4,
    marginRight: 4,
  },
  skeletonContactButton: {
    width: 30,
    height: 30,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
  },
});
