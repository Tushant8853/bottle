import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from "../../../../TabNavigation/navigationTypes";
import { supabase } from "../../../../../backend/supabase/supabaseClient";
import { TwicImg } from "@twicpics/components/react-native";
import DiscoverWines from "./Feature/WineEnjoyed";
import MapView, { Marker } from 'react-native-maps';

type RestaurantsDetailsRouteProp = RouteProp<RootStackParamList, 'RestaurantsDetails'>;

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

const RestaurantsDetails = () => {
  const route = useRoute<RestaurantsDetailsRouteProp>();
  const { id: RestaurantId } = route.params;
  const [Restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [memoriesImages, setMemoriesImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const [expandedwinery, setExpandedRestaurant] = useState<string | null>(null); // State to track expanded description

  const handleToggleDescription = (id: string) => {
    setExpandedRestaurant(prev => (prev === id ? null : id));
  };
  useEffect(() => {
    const fetchRestaurantAndMemories = async () => {
      try {
        // Fetch winery details
        const { data: RestaurantData, error: wineryError } = await supabase
          .from('bottleshock_restaurants')
          .select('Restaurants_id, restro_name, banner, description, address, phone, working_hours,star_rating, seasons_open, likes, hashtags, location_lat, location_long ')
          .eq('Restaurants_id', RestaurantId)
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
            seasons_open:RestaurantData.seasons_open,
            likes: RestaurantData.likes,
            hashtags: RestaurantData.hashtags.split(', '),
            location_lat: RestaurantData.location_lat,
            location_long: RestaurantData.location_long,
          });
        }

        // Fetch memories and related images
        const { data: memoriesData, error: memoriesError } = await supabase
          .from('bottleshock_memories')
          .select('id')
          .eq("is_public", true)
          .eq('restaurant_id', RestaurantId);

        if (memoriesError) throw new Error(memoriesError.message);

        const memoryIds = memoriesData.map((memory) => memory.id);
        
        // Fetch images from `bottleshock_memory_gallery` for the retrieved memory IDs
        if (memoryIds.length > 0) {
          const { data: imagesData, error: imagesError } = await supabase
            .from('bottleshock_memory_gallery')
            .select('file')
            .eq("is_thumbnail", true)
            .in('memory_id', memoryIds);

          if (imagesError) throw new Error(imagesError.message);

          setMemoriesImages(imagesData.map((img) => `${imagePrefix}${img.file}`));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching winery and memories details:", error);
        setLoading(false);
      }
    };

    fetchRestaurantAndMemories();
  }, [RestaurantId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#522F60" style={styles.loading} />;
  }

  if (!Restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Winery details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {Restaurant.banner ? (
          <TwicImg src={Restaurant.banner} style={styles.headerimage} />
        ) : (
          <Image source={HeaderImg} style={styles.headerimage} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.titletext}>{Restaurant.name}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="attach" size={24} style={styles.rotatedIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="heart-outline" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="share-outline" size={24} />
          </TouchableOpacity>
        </View>
      </View>      
      <View style={styles.memoriesContainer}>
        <View style={styles.memoriesHeaderContainer}>
          <View style={styles.leftContent}>
            <FontAwesome style={styles.memoriesIcons} name="image" size={16} color="#522F60" />
            <Text style={styles.memoriesHeadertext}> Memories</Text>
          </View>
          <View style={styles.rightContent}>
            <AntDesign style={styles.memoriesArrowIcons} name="arrowright" size={20} color="#522F60" />
          </View>
        </View>
        
        <View style={styles.memoriesMainContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.memories}>
            {memoriesImages.length > 0 ? (
              memoriesImages.map((image, index) => (
                <TwicImg key={index} src={image} style={styles.memoriesImage} />
              ))
            ) : (
              <Text>No memories available</Text>
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
                                expandedwinery === Restaurant.id && { height: 'auto' }, // Auto height when expanded
                            ]}
                            onPress={() => handleToggleDescription(Restaurant.id)}
                        >
                            <Text style={styles.descriptionText} numberOfLines={expandedwinery === Restaurant.id ? undefined : 5}>
                                {Restaurant.description}
                            </Text>
                </Pressable>
                </View>
            </View>
            <View style={styles.MapContainer}>
            <MapView
                        style={styles.mapSDKContainer}
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
                            <Text style={styles.fulladdressText} numberOfLines={1}>{Restaurant.location}</Text>
                        </View>
                </View>
            </View>
            <View style={styles.InfoContainer}>
                <View style={styles.contactRow}>
                   <View style={styles.infocomponent}>
                    <Ionicons name="call-outline" size={18} color="#522F60" style={styles.icon} />
                    <View style={styles.separator} />
                    <Text style={styles.contactText}>{Restaurant.phone}</Text>
                   </View> 
                    <TouchableOpacity style={styles.contactButton}>
                        <Ionicons name="call-outline" size={18} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.contactRow}>
                  <View style={styles.infocomponent}>
                    <Ionicons name="time-outline" size={18} color="#522F60" style={styles.icon} />
                    <View style={styles.separator} />
                    <Text style={styles.time}>{Restaurant.working_hours}</Text>
                   </View>
                 <View style={styles.infocomponent}>
                    <MaterialIcons name="event" size={18} color="#522F60" style={styles.icon} />
                    <View style={styles.separator} />
                    <Text style={styles.date}>{Restaurant.seasons_open}</Text>
                </View>
                </View>
                <View style={styles.contactRow}>
                  <View style={styles.infocomponent}>
                  <FontAwesome name="star" size={18} color="#522F60" style={styles.icon} />
                  <View style={styles.separator} />
                 <Text style={styles.rating}>{Restaurant.star_rating}</Text>
                   </View>
                 <View style={styles.infocomponent}>
                 <FontAwesome name="thumbs-up" size={18} color="#522F60" style={styles.icon} />
                 <View style={styles.separator} />
                 <Text style={styles.likes}>{Restaurant.likes}</Text>
                </View>
                </View>

                <View style={styles.infocomponent}>
                    <MaterialIcons name="tag" size={18} color="#522F60" style={styles.icon} />
                    <View style={styles.separator} />
                    <Text style={styles.hashtags}>{Restaurant.hashtags}</Text>
                </View>
            </View>


            <DiscoverWines />
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
    descriptiontextContainer:{},
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
    errorText:{},
    loading:{},
});
