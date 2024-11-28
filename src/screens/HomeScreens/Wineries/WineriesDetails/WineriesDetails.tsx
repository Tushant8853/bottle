import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity, Pressable, Linking, Alert, Dimensions, Animated } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from "../../../../TabNavigation/navigationTypes";
import { supabase } from "../../../../../backend/supabase/supabaseClient";
import { TwicImg } from "@twicpics/components/react-native";
import DiscoverWines from "./Feature/WineEnjoyed";
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';


const { width } = Dimensions.get("window");

type WineriesDetailsRouteProp = RouteProp<RootStackParamList, 'WineriesDetails'>;

interface WineryDetails {
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
const WineriesDetails = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<WineriesDetailsRouteProp>();
  const { id: wineryId } = route.params;
  const [winery, setWinery] = useState<WineryDetails | null>(null);
  const [memoriesData, setMemoriesData] = useState<MemoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const [expandedwinery, setExpandedwinery] = useState<string | null>(null);
  const [favoriteStatus, setFavoriteStatus] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const { t } = useTranslation();

  const handleToggleDescription = (id: string) => {
    setExpandedwinery(prev => (prev === id ? null : id));
  };

  const handlePhoneCall = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert('Error', 'Unable to make the call');
    });
  };

  useEffect(() => {
    const fetchWineryAndMemories = async () => {
      try {
        // Fetch winery details
        const { data: wineryData, error: wineryError } = await supabase
          .from('bottleshock_wineries')
          .select('wineries_id, winery_name, banner, description, address, phone, working_hours, star_rating, seasons_open, likes, hashtags, location_lat, location_long')
          .eq('wineries_id', wineryId)
          .single();

        if (wineryError) throw new Error(wineryError.message);

        if (wineryData) {
          setWinery({
            id: wineryData.wineries_id,
            name: wineryData.winery_name,
            banner: `${imagePrefix}${wineryData.banner}`,
            description: wineryData.description,
            location: wineryData.address,
            phone: wineryData.phone,
            working_hours: wineryData.working_hours,
            star_rating: wineryData.star_rating,
            seasons_open: wineryData.seasons_open,
            likes: wineryData.likes,
            hashtags: wineryData.hashtags.split(', '),
            location_lat: wineryData.location_lat,
            location_long: wineryData.location_long,
          });
          await checkFavoriteStatus(wineryData.wineries_id);
          await checkSavedStatus(wineryData.wineries_id);
        }

        // Fetch memories
        const { data: memoriesDataResponse, error: memoriesError } = await supabase
          .from('bottleshock_memories')
          .select('id')
          .eq("is_public", true)
          .eq('winery_id', wineryId);

        if (memoriesError) throw new Error(memoriesError.message);

        const memoryIds = memoriesDataResponse.map((memory) => memory.id);

        if (memoryIds.length > 0) {
          const { data: imagesData, error: imagesError } = await supabase
            .from('bottleshock_memory_gallery')
            .select('memory_id, file')
            .eq("is_thumbnail", true)
            .in('memory_id', memoryIds);

          if (imagesError) throw new Error(imagesError.message);

          setMemoriesData(imagesData.map((img) => ({
            id: img.memory_id,
            file: `${imagePrefix}${img.file}`,
          })));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching winery and memories details:", error);
        setLoading(false);
      }
    };

    fetchWineryAndMemories();
  }, [wineryId]);

  const checkFavoriteStatus = async (wineryId: string) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) return;

      const { data: favorites, error } = await supabase
        .from('bottleshock_fav_wineries')
        .select('winery_id')
        .eq('user_id', UID)
        .eq('winery_id', wineryId);

      if (error) {
        console.error('Error fetching favorite status:', error.message);
        return;
      }

      setFavoriteStatus(favorites.length > 0);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const checkSavedStatus = async (wineryId: string) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) return;

      const { data: savedWineries, error } = await supabase
        .from('bottleshock_saved_wineries')
        .select('winery_id')
        .eq('user_id', UID)
        .eq('winery_id', wineryId);

      if (error) {
        console.error('Error fetching saved status:', error.message);
        return;
      }

      setSavedStatus(savedWineries.length > 0);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleFavoritePress = async () => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) return;

      if (favoriteStatus) {
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

      setFavoriteStatus(!favoriteStatus);
    } catch (error) {
      console.error('Error handling favorite press:', error);
    }
  };

  const handleSavePress = async () => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) return;

      if (savedStatus) {
        const { error } = await supabase
          .from('bottleshock_saved_wineries')
          .delete()
          .match({ user_id: UID, winery_id: winery.id });

        if (error) {
          console.error('Error removing saved winery:', error.message);
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

      setSavedStatus(!savedStatus);
    } catch (error) {
      console.error('Error handling save press:', error);
    }
  };

  if (loading) {
    return <SkeletonComponent />;
  }

  if (!winery) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Winery details not found.</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {winery.banner ? (
          <TwicImg src={winery.banner} style={styles.headerimage} />
        ) : (
          <Image source={HeaderImg} style={styles.headerimage} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.titletext}>{winery.name}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleSavePress}>
            <Ionicons name="attach" size={24} color={savedStatus ? "#522F60" : "gray"} style={styles.rotatedIcon} />
          </Pressable>
          <Pressable style={styles.button} onPress={handleFavoritePress}>
            <Ionicons name={favoriteStatus ? "heart" : "heart-outline"} size={24} />
          </Pressable>
          <Pressable style={styles.button}>
            <Ionicons name="share-outline" size={24} />
          </Pressable>
        </View>
      </View>
      <View style={styles.memoriesContainer}>
        <View style={styles.memoriesHeaderContainer}>
          <View style={styles.leftContent}>
            <FontAwesome style={styles.memoriesIcons} name="image" size={16} color="#522F60" />
            <Text style={styles.memoriesHeadertext}> {t('Memories')}</Text>
          </View>
          <View style={styles.rightContent}>
            <AntDesign style={styles.memoriesArrowIcons} name="arrowright" size={20} color="#522F60" />
          </View>
        </View>

        <View style={styles.memoriesMainContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.memories}>
            {memoriesData.length > 0 ? (
              memoriesData.map((memory) => (
                <Pressable key={memory.id} onPress={() => navigation.navigate("MemoriesDetails", { id: memory.id })}>
                  <TwicImg src={memory.file} style={styles.memoriesImage} />
                  <FontAwesome style={styles.selectIcons} name="circle-o" size={18} color="#FFFFFF" selectionColor={'#FFFFFF'} />
                </Pressable>
              ))
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
              expandedwinery === winery.id && { height: 'auto' }, // Auto height when expanded
            ]}
            onPress={() => handleToggleDescription(winery.id)}
          >
            <Text style={styles.descriptionText} numberOfLines={expandedwinery === winery.id ? undefined : 5}>
              {winery.description}
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.MapContainer}>
        <MapView
          style={styles.mapSDKContainer}
          initialRegion={{
            latitude: winery.location_lat,
            longitude: winery.location_long,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: winery.location_lat,
              longitude: winery.location_long,
            }}
            title={winery.name}
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
            <Text style={styles.fulladdressText} numberOfLines={1}>{winery.location}</Text>
          </View>
        </View>
      </View>
      <View style={styles.InfoContainer}>
        <View style={styles.contactRow}>
          <View style={styles.infocomponent}>
            <Ionicons name="call-outline" size={18} color="#522F60" style={styles.icon} />
            <View style={styles.separator} />
            <Text style={styles.contactText}>{winery.phone}</Text>
          </View>
          <TouchableOpacity style={styles.contactButton} onPress={() => handlePhoneCall(winery.phone)}>
            <Ionicons name="call-outline" size={18} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.contactRow}>
          <View style={styles.infocomponent}>
            <Ionicons name="time-outline" size={18} color="#522F60" style={styles.icon} />
            <View style={styles.separator} />
            <Text style={styles.time}>{winery.working_hours}</Text>
          </View>
          <View style={styles.infocomponent}>
            <MaterialIcons name="event" size={18} color="#522F60" style={styles.icon} />
            <View style={styles.separator} />
            <Text style={styles.date}>{winery.seasons_open}</Text>
          </View>
        </View>
        <View style={styles.contactRow}>
          <View style={styles.infocomponent}>
            <FontAwesome name="star" size={18} color="#522F60" style={styles.icon} />
            <View style={styles.separator} />
            <Text style={styles.rating}>{winery.star_rating}</Text>
          </View>
          <View style={styles.infocomponent}>
            <FontAwesome name="thumbs-up" size={18} color="#522F60" style={styles.icon} />
            <View style={styles.separator} />
            <Text style={styles.likes}>{winery.likes}</Text>
          </View>
        </View>

        <View style={styles.infocomponent}>
          <MaterialIcons name="tag" size={18} color="#522F60" style={styles.icon} />
          <View style={styles.separator} />
          <Text style={styles.hashtags}>{winery.hashtags}</Text>
        </View>
      </View>


      <DiscoverWines id={wineryId}/>
      <View style={styles.bottom}></View>
    </ScrollView>
  );
};

export default WineriesDetails;

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
    top: 55,
    right: 15,
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
  },
  textContainer: {},
  //////////////////////////////////////////descriptionContainer//////////////////////
  descriptionContainer: {
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 8,
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
    marginTop: 8,
    borderRadius: 4,
    borderColor: "#522F6080",
    height: 146,
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
