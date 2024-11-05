import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Pressable,
    Animated,
} from "react-native";
import styles from './index.style';
import { Ionicons } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import DiscoverWines from "./Feature/WineEnjoyed";
import { useRoute, RouteProp } from "@react-navigation/native";
import { supabase } from "../../../../../backend/supabase/supabaseClient";
import { TwicImg, installTwicPics } from '@twicpics/components/react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../TabNavigation/navigationTypes";


installTwicPics({
    domain: 'https://bottleshock.twic.pics/',
    debug: true,
    maxDPR: 3,
});
const HeaderImg = require("../../../../assets/png/HeaderIcon.png");
interface Memory {
    id: string;
    name: string;
    thumbnail?: string;
    user_id: string;
    description: string;
    handle?: string;
    short_description: string;
    created_at: string;
    thumbnails?: string[];
    restaurant_id: string;
    restro_name?: string;
    location_name: string;
    winery_id?: string;
    restaurantORWinesORLocation?: string;
    location_lat: number;
    location_long: number;
    address: string;
    memoryId:string;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });
};

const SkeletonLoader: React.FC = () => {
    const animatedValue = new Animated.Value(0);

    React.useEffect(() => {
        const startAnimation = () => {
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
            ]).start(() => startAnimation());
        };

        startAnimation();
    }, []);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-350, 350],
    });

    const shimmerStyle = {
        transform: [{ translateX }],
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <View style={styles.imageSkeleton}>
                    <Animated.View style={[styles.shimmer, shimmerStyle]} />
                </View>
                <View style={styles.buttonContainer}>
                    {[1, 2, 3].map((_, index) => (
                        <View key={index} style={styles.buttonSkeleton}>
                            <Animated.View style={[styles.shimmer, shimmerStyle]} />
                        </View>
                    ))}
                </View>
                <View style={styles.textContainer}>
                    <View style={styles.titleSkeleton}>
                        <Animated.View style={[styles.shimmer, shimmerStyle]} />
                    </View>
                    <View style={styles.subtextSkeleton}>
                        <Animated.View style={[styles.shimmer, shimmerStyle]} />
                    </View>
                </View>
            </View>

            <View style={styles.descriptionContainer}>
                <View style={styles.descriptionIconSkeleton}>
                    <Animated.View style={[styles.shimmer, shimmerStyle]} />
                </View>
                <View style={styles.descriptionTextSkeleton}>
                    <Animated.View style={[styles.shimmer, shimmerStyle]} />
                </View>
            </View>

            <View style={styles.dateContainer}>
                <View style={styles.dateIconSkeleton}>
                    <Animated.View style={[styles.shimmer, shimmerStyle]} />
                </View>
                <View style={styles.dateTextSkeleton}>
                    <Animated.View style={[styles.shimmer, shimmerStyle]} />
                </View>
            </View>

            <View style={styles.picandvideoContainer}>
                <View style={styles.picandvideoHeader}>
                    <View style={styles.headerTextSkeleton}>
                        <Animated.View style={[styles.shimmer, shimmerStyle]} />
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailContainer}>
                    {[1, 2, 3, 4].map((_, index) => (
                        <View key={index} style={styles.thumbnailSkeleton}>
                            <Animated.View style={[styles.shimmer, shimmerStyle]} />
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.mapContainer}>
                <View style={styles.mapHeaderContainer}>
                    <View style={styles.mapHeaderSkeleton}>
                        <Animated.View style={[styles.shimmer, shimmerStyle]} />
                    </View>
                    <View style={styles.mapActionContainer}>
                        {[1, 2, 3].map((_, index) => (
                            <View key={index} style={styles.mapActionSkeleton}>
                                <Animated.View style={[styles.shimmer, shimmerStyle]} />
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.mapViewSkeleton}>
                    <Animated.View style={[styles.shimmer, shimmerStyle]} />
                </View>
                <View style={styles.addressContainer}>
                    <View style={styles.addressIconSkeleton}>
                        <Animated.View style={[styles.shimmer, shimmerStyle]} />
                    </View>
                    <View style={styles.addressTextSkeleton}>
                        <Animated.View style={[styles.shimmer, shimmerStyle]} />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const MemoriesDetails: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<{ params: { id: string } }, 'params'>>();
    const { id } = route.params;
    const imagePrefix = "https://bottleshock.twic.pics/file/";
    const [memories, setMemories] = useState<Memory[]>([]);
    const [expandedMemory, setExpandedMemory] = useState<string | null>(null); // State to track expanded description
    const [isLoading, setIsLoading] = useState(true);
    const handleToggleDescription = (id: string) => {
        setExpandedMemory(prev => (prev === id ? null : id));
    };
    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const { data: memoriesData, error } = await supabase
                    .from("bottleshock_memories")
                    .select("id, user_id, name, description, short_description, created_at, restaurant_id, winery_id, location_name ,location_lat,location_long,address")
                    .eq("id", id);

                if (error) {
                    console.error("Error fetching memories:", error.message);
                    return;
                }

                const updatedMemories = await Promise.all(
                    memoriesData.map(async (memory: any) => {
                        const { data: gallery, error: galleryError } = await supabase
                            .from("bottleshock_memory_gallery")
                            .select("file")
                            .eq("memory_id", memory.id);

                        if (galleryError) {
                            console.error("Error fetching gallery:", galleryError.message);
                            return memory;
                        }

                        memory.thumbnails = gallery ? gallery.map(g => `${imagePrefix}${g.file}?twic=v1&resize=60x60`) : [];
                        let restaurantORWinesORLocation = memory.location_name;

                        if (memory.restaurant_id) {
                            const { data: restaurant, error: restaurantError } = await supabase
                                .from("bottleshock_restaurants")
                                .select("restro_name")
                                .eq("Restaurants_id", memory.restaurant_id)
                                .single();

                            if (restaurantError) {
                                console.error("Error fetching restaurant name:", restaurantError.message);
                            } else {
                                restaurantORWinesORLocation = restaurant?.restro_name || memory.location_name; // Use restaurant name if available
                            }
                        }

                        // Check if winery_id is present
                        if (memory.winery_id) {
                            const { data: winery, error: wineryError } = await supabase
                                .from("bottleshock_wineries")
                                .select("winery_name")
                                .eq("wineries_id", memory.winery_id)
                                .single();

                            if (wineryError) {
                                console.error("Error fetching winery name:", wineryError.message);
                            } else {
                                restaurantORWinesORLocation = winery?.winery_name || restaurantORWinesORLocation;
                            }
                        }
                        memory.restaurantORWinesORLocation = restaurantORWinesORLocation;

                        return memory as Memory;
                    })
                );

                setMemories(updatedMemories);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching memories:", err);
            }
        };

        fetchMemories();
    }, [id]);
    if (isLoading) {
        return <SkeletonLoader />;
    }


    return (
        <ScrollView style={styles.container}>
            {memories.map((memory) => (
                <View key={memory.id} style={styles.imageContainer}>
                    {/* Only render Header Image if there are no thumbnails */}
                    {!memory.thumbnails || memory.thumbnails.length === 0 ? (
                        <Image source={HeaderImg} style={styles.image} />
                    ) : (
                        <TwicImg src={memory.thumbnails[0]} style={styles.image} />
                    )}

                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{memory.name}</Text>
                        <Text style={styles.subtext} numberOfLines={1}>{memory.short_description}</Text>
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
            ))}

            {memories.map((memory) => (
                <View key={memory.id} style={styles.descriptionContainer}>
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
                                expandedMemory === memory.id && { height: 'auto' }, // Auto height when expanded
                            ]}
                            onPress={() => handleToggleDescription(memory.id)}
                        >
                            <Text style={styles.descriptionText} numberOfLines={expandedMemory === memory.id ? undefined : 5}>
                                {memory.description}
                            </Text>
                        </Pressable>

                    </View>
                </View>
            ))}

            {memories.map((memory) => (
                <View key={memory.id} style={styles.datecontainer}>
                    <View style={styles.descriptionIconsContainer}>
                        <Ionicons
                            name="calendar-outline"
                            size={16}
                            color="#522F60"
                            style={styles.icon}
                        />
                    </View>
                    <View style={styles.DateTextContainer}>
                        <Text style={styles.dateText}>{formatDate(memory.created_at)}</Text>
                    </View>
                </View>
            ))}

            {memories.map((memory) => (
                <View style={styles.picandvideoContainer} key={memory.id}>
                    <View style={styles.picandvideoHeaderContainer}>
                        <View style={styles.leftContent}>
                            <FontAwesome style={styles.picandvideoIcons} name="image" size={16} color="#522F60" />
                            <Text style={styles.picandvideoHeadertext}> pics and Videos</Text>
                        </View>
                        <View style={styles.rightContent}>
                            <Pressable onPress={() => navigation.navigate("Thumbnail", { memoryId: memory.id })}>
                                <AntDesign style={styles.picandvideoArrowIcons} name="arrowright" size={20} color="#522F60" />
                            </Pressable>
                        </View>
                    </View>
                    {/* Check if thumbnails exist before rendering */}
                    {memory.thumbnails && memory.thumbnails.length > 0 && (
                        <View style={styles.picandvideoMainContainer}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.picandvideo}
                            >
                                {memory.thumbnails.map((thumbnail, index) => (
                                    <TwicImg key={index} src={thumbnail} style={styles.picandvideoImage} />
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            ))}
            {memories.map((memory) => (
                <View style={styles.MapContainer}>
                    <View style={styles.MapContainerHeader}>
                        <View style={styles.locationHeaderContainer}>
                            <View style={styles.oneContent}>
                                <View style={styles.descriptionIconsContainer}>
                                    <Ionicons
                                        name="pin"
                                        size={16}
                                        color="#522F60"
                                        style={styles.Mapicon}
                                    />
                                </View>
                                <View style={styles.locationTextContainer}>
                                    <Text style={styles.locationHeadertext}>{memory.restaurantORWinesORLocation}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.actionHeaderContainer}>
                            <View style={styles.twoContent}>
                                <Ionicons name="attach" size={14} style={styles.rotatedIcon} />
                            </View>
                            <View style={styles.threeContent}>
                                <Ionicons name="heart-outline" size={14} />
                            </View>
                            <View style={styles.fourContent}>
                                <Ionicons name="share-outline" size={14} />
                            </View>
                        </View>
                    </View>

                    <MapView
                        style={styles.mapSDKContainer}
                        initialRegion={{
                            latitude: memory.location_lat,
                            longitude: memory.location_long,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: memory.location_lat,
                                longitude: memory.location_long,
                            }}
                            title={memory.restaurantORWinesORLocation}
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
                            <Text style={styles.fulladdressText} numberOfLines={1}>{memory.address}</Text>
                        </View>
                    </View>
                </View>
            ))}


            <DiscoverWines />
            <View style={styles.bottom}></View>
        </ScrollView>
    );
};

export default MemoriesDetails;
