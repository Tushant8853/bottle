import React, { useEffect, useState } from "react";
import {
    View,
    Text,
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
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DiscoverWines from "./Feature/WineEnjoyes/WineEnjoyed";
import { useRoute, RouteProp } from "@react-navigation/native";
import { supabase } from "../../../../../backend/supabase/supabaseClient";
import { TwicImg, installTwicPics } from '@twicpics/components/react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../TabNavigation/navigationTypes";
const HeaderImg = require("../../../../assets/png/HeaderIcon.png");
import ShareWithFriends from "./Feature/ShareWithFriends/ShareWithFriends";
import { useTranslation } from 'react-i18next';
import SkeletonLoader from "./SkeletonLoader";

installTwicPics({
    domain: 'https://bottleshock.twic.pics/',
    debug: true,
    maxDPR: 3,
});
interface Memory {
    id: string;
    name: string;
    user_id: string;
    description: string;
    short_description: string;
    created_at: string;
    restaurant_id: string;
    location_name: string;
    location_lat: number;
    location_long: number;
    address: string;
    memoryId: string;
    winery_id?: string;
    restaurantORWinesORLocation?: string;
    thumbnails: {
        id: string;
        url: string;
        is_thumbnail: boolean;
    }[];
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });
};
type MemoriesDetailsRouteParams = {
    id: string;
    from: string;
};

const MemoriesDetails: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<{ params: MemoriesDetailsRouteParams }, 'params'>>();
    const { id, from } = route.params;
    const imagePrefix = "https://bottleshock.twic.pics/file/";
    const [memories, setMemories] = useState<Memory[]>([]);
    const [expandedMemory, setExpandedMemory] = useState<string | null>(null); // State to track expanded description
    const [isLoading, setIsLoading] = useState(true);
    const [checkedImages, setCheckedImages] = useState<{ [key: string]: boolean }>({});
    const [savedStatus, setSavedStatus] = useState<boolean[]>([]);
    const [favoriteStatus, setFavoriteStatus] = useState<boolean[]>([]);
    const [savedItemsStatus, setSavedItemsStatus] = useState<boolean[]>([]);
    const [favoriteItemsStatus, setFavoriteItemsStatus] = useState<boolean[]>([]); // Specify the type as boolean[]

    const [UID, setUID] = useState<string | null>(null);
    const { t } = useTranslation();


    const handleToggleDescription = (id: string) => {
        setExpandedMemory(prev => (prev === id ? null : id));
    };

    useEffect(() => {
        const fetchUID = async () => {
            try {
                const userId = await AsyncStorage.getItem('UID');
                setUID(userId);
            } catch (error) {
                console.error('Error fetching UID from AsyncStorage:', error);
            }
        };

        fetchUID();
    }, []);

    useEffect(() => {
        if (UID) {
            const fetchSavedItemsStatus = async () => {
                try {
                    const savedWineriesResponse = await supabase
                        .from('bottleshock_saved_wineries')
                        .select('winery_id')
                        .eq('user_id', UID);

                    const savedRestaurantsResponse = await supabase
                        .from('bottleshock_saved_restaurants')
                        .select('restaurant_id')
                        .eq('user_id', UID);

                    const savedWineries = savedWineriesResponse.data.map(row => row.winery_id);
                    const savedRestaurants = savedRestaurantsResponse.data.map(row => row.restaurant_id);

                    const status = memories.map((memory) => {
                        if (memory.winery_id) {
                            return savedWineries.includes(memory.winery_id);
                        }
                        if (memory.restaurant_id) {
                            return savedRestaurants.includes(memory.restaurant_id);
                        }
                        return false;
                    });

                    setSavedItemsStatus(status);
                } catch (error) {
                    console.error('Error fetching saved items status from Supabase:', error);
                }
            };

            const fetchFavoriteItemsStatus = async () => {
                try {
                    const favoriteWineriesResponse = await supabase
                        .from('bottleshock_fav_wineries')
                        .select('winery_id')
                        .eq('user_id', UID);

                    const favoriteRestaurantsResponse = await supabase
                        .from('bottleshock_fav_restaurants')
                        .select('restaurant_id')
                        .eq('user_id', UID);

                    const favoriteWineries = favoriteWineriesResponse.data.map(row => row.winery_id);
                    const favoriteRestaurants = favoriteRestaurantsResponse.data.map(row => row.restaurant_id);

                    const favoriteStatus = memories.map((memory) => {
                        if (memory.winery_id) {
                            return favoriteWineries.includes(memory.winery_id);
                        }
                        if (memory.restaurant_id) {
                            return favoriteRestaurants.includes(memory.restaurant_id);
                        }
                        return false;
                    });

                    setFavoriteItemsStatus(favoriteStatus);
                } catch (error) {
                    console.error('Error fetching favorite items status from Supabase:', error);
                }
            };

            fetchSavedItemsStatus();
            fetchFavoriteItemsStatus();
        }
    }, [UID, memories]);

    const handleSavePresswr = async (index: number) => {
        const memory = memories[index];
        const isSaved = savedItemsStatus[index];

        try {
            if (memory.winery_id) {
                if (isSaved) {
                    await deleteWinery(UID, memory.winery_id); // Delete from saved wineries
                    savedItemsStatus[index] = false; // Update local status
                } else {
                    await saveWinery(UID, memory.winery_id); // Save to saved wineries
                    savedItemsStatus[index] = true; // Update local status
                }
            } else if (memory.restaurant_id) {
                if (isSaved) {
                    await deleteRestaurant(UID, memory.restaurant_id); // Delete from saved restaurants
                    savedItemsStatus[index] = false; // Update local status
                } else {
                    await saveRestaurant(UID, memory.restaurant_id); // Save to saved restaurants
                    savedItemsStatus[index] = true; // Update local status
                }
            }
            setSavedItemsStatus([...savedItemsStatus]); // Trigger re-render
        } catch (error) {
            console.error('Error toggling saved status:', error);
        }
    };
    const handleFavoritePresswr = async (index:number) => {
        const memory = memories[index];
        const isFavorite = favoriteItemsStatus[index];

        try {
            if (memory.winery_id) {
                if (isFavorite) {
                    await deleteFavoriteWinery(UID, memory.winery_id);
                    favoriteItemsStatus[index] = false;
                } else {
                    await addFavoriteWinery(UID, memory.winery_id);
                    favoriteItemsStatus[index] = true;
                }
            } else if (memory.restaurant_id) {
                if (isFavorite) {
                    await deleteFavoriteRestaurant(UID, memory.restaurant_id);
                    favoriteItemsStatus[index] = false;
                } else {
                    await addFavoriteRestaurant(UID, memory.restaurant_id);
                    favoriteItemsStatus[index] = true;
                }
            }
            setFavoriteItemsStatus([...favoriteItemsStatus]);
        } catch (error) {
            console.error('Error toggling favorite status:', error);
        }
    };

    // Save Winery to Supabase
    const saveWinery = async (UID: string, wineryId: string) => {
        try {
            const { error } = await supabase
                .from('bottleshock_saved_wineries')
                .insert([
                    { created_at: new Date(), user_id: UID, winery_id: wineryId }
                ]);
            if (error) throw error;
        } catch (error) {
            console.error('Error saving winery to Supabase:', error);
        }
    };
    const addFavoriteWinery = async (UID: string, wineryId: string) => {
        try {
            const { error } = await supabase
                .from('bottleshock_fav_wineries')
                .insert([
                    { created_at: new Date(), user_id: UID, winery_id: wineryId }
                ]);
            if (error) throw error;
        } catch (error) {
            console.error('Error adding winery to favorites:', error);
        }
    };

    // Delete Winery from Favorites
    const deleteFavoriteWinery = async (UID: string, wineryId: string) => {
        try {
            const { error } = await supabase
                .from('bottleshock_fav_wineries')
                .delete()
                .eq('user_id', UID)
                .eq('winery_id', wineryId);
            if (error) throw error;
        } catch (error) {
            console.error('Error deleting winery from favorites:', error);
        }
    };

    // Add Restaurant to Favorites
    const addFavoriteRestaurant = async (UID:string, restaurantId:string) => {
        try {
            const { error } = await supabase
                .from('bottleshock_fav_restaurants')
                .insert([
                    { created_at: new Date(), user_id: UID, restaurant_id: restaurantId }
                ]);
            if (error) throw error;
        } catch (error) {
            console.error('Error adding restaurant to favorites:', error);
        }
    };

    // Delete Restaurant from Favorites
    const deleteFavoriteRestaurant = async (UID:string, restaurantId:string) => {
        try {
            const { error } = await supabase
                .from('bottleshock_fav_restaurants')
                .delete()
                .eq('user_id', UID)
                .eq('restaurant_id', restaurantId);
            if (error) throw error;
        } catch (error) {
            console.error('Error deleting restaurant from favorites:', error);
        }
    };

    // Delete Winery from Supabase
    const deleteWinery = async (UID:string, wineryId:string) => {
        try {
            const { error } = await supabase
                .from('bottleshock_saved_wineries')
                .delete()
                .eq('user_id', UID)
                .eq('winery_id', wineryId);
            if (error) throw error;
        } catch (error) {
            console.error('Error deleting winery from Supabase:', error);
        }
    };

    // Save Restaurant to Supabase
    const saveRestaurant = async (UID, restaurantId) => {
        try {
            const { error } = await supabase
                .from('bottleshock_saved_restaurants')
                .insert([
                    { created_at: new Date(), user_id: UID, restaurant_id: restaurantId }
                ]);
            if (error) throw error;
        } catch (error) {
            console.error('Error saving restaurant to Supabase:', error);
        }
    };

    // Delete Restaurant from Supabase
    const deleteRestaurant = async (UID, restaurantId) => {
        try {
            const { error } = await supabase
                .from('bottleshock_saved_restaurants')
                .delete()
                .eq('user_id', UID)
                .eq('restaurant_id', restaurantId);
            if (error) throw error;
        } catch (error) {
            console.error('Error deleting restaurant from Supabase:', error);
        }
    };


    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const { data: memoriesData, error } = await supabase
                    .from("bottleshock_memories")
                    .select("id, user_id, name, description, short_description, created_at, restaurant_id, location_name, location_lat, location_long, address, winery_id")
                    .eq("id", id);

                if (error) {
                    console.error("Error fetching memories:", error.message);
                    return;
                }
                const updatedMemories = await Promise.all(
                    memoriesData.map(async (memory) => {
                        const { data: gallery, error: galleryError } = await supabase
                            .from("bottleshock_memory_gallery")
                            .select("id, file, is_thumbnail")
                            .eq("memory_id", memory.id);

                        if (galleryError) {
                            console.error("Error fetching gallery:", galleryError.message);
                            return memory;
                        }

                        memory.thumbnails = gallery
                            ? gallery.map(g => ({
                                id: g.id,
                                url: `${imagePrefix}${g.file}?twic=v1&resize=60x60`,
                                is_thumbnail: g.is_thumbnail,
                            }))
                            : [];

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
                                restaurantORWinesORLocation = restaurant?.restro_name || memory.location_name;
                            }
                        }
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
                //console.log("Updated Memories:", JSON.stringify(updatedMemories, null, 2));

                await checkSavedMemories(updatedMemories);
                await checkFavoriteMemories(updatedMemories);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching memories:", err);
            }
        };

        fetchMemories();
    }, [id]);


    const handleThumbnailClick = async (memoryIndex: number, thumbnailIndex: number) => {
        const selectedMemory = memories[memoryIndex];
        if (!selectedMemory.thumbnails) {
            console.error('No thumbnails available');
            return;
        }
        const selectedThumbnail = selectedMemory.thumbnails[thumbnailIndex];
        try {
            const { data, error } = await supabase
                .from('bottleshock_memory_gallery')
                .update({ is_thumbnail: true })
                .eq('id', selectedThumbnail.id);

            if (error) {
                console.error('Error updating the selected thumbnail:', error.message);
                return;
            }
            const { data: resetData, error: resetError } = await supabase
                .from('bottleshock_memory_gallery')
                .update({ is_thumbnail: null })
                .neq('id', selectedThumbnail.id)
                .eq('memory_id', selectedMemory.id);

            if (resetError) {
                console.error('Error resetting other thumbnails:', resetError.message);
                return;
            }
            setMemories((prevMemories) =>
                prevMemories.map((memory, mIndex) => {
                    if (mIndex === memoryIndex && memory.thumbnails) {
                        const updatedThumbnails = memory.thumbnails.map((thumbnail, tIndex) => ({
                            ...thumbnail,
                            is_thumbnail: tIndex === thumbnailIndex ? true : false,
                        }));
                        return { ...memory, thumbnails: updatedThumbnails };
                    }
                    return memory;
                })
            );
            console.log('Thumbnail updated successfully');
        } catch (err) {
            console.error('Error in updating thumbnail:', err.message);
        }
    };

    const checkSavedMemories = async (fetchedMemories: Memory[]) => {
        try {
            const UID = await AsyncStorage.getItem("UID");
            if (!UID) {
                console.error("User ID not found.");
                return;
            }

            const { data: savedMemories, error } = await supabase
                .from('bottleshock_saved_memories')
                .select('memory_id')
                .eq('user_id', UID);

            if (error) {
                console.error('Error fetching saved memories:', error.message);
                return;
            }

            const savedIds = savedMemories?.map((memory) => memory.memory_id);
            const updatedSavedStatus = fetchedMemories.map((memory) =>
                savedIds.includes(memory.id)
            );

            setSavedStatus(updatedSavedStatus);
        } catch (error) {
            console.error('Error in checkSavedMemories:', error);
        }
    };

    const checkFavoriteMemories = async (fetchedMemories: Memory[]) => {
        try {
            const UID = await AsyncStorage.getItem("UID");
            if (!UID) {
                console.error("User ID not found.");
                return;
            }

            const { data: favoriteMemories, error } = await supabase
                .from('bottleshock_fav_memories')
                .select('memory_id')
                .eq('user_id', UID);

            if (error) {
                console.error('Error fetching favorite memories:', error.message);
                return;
            }

            const favoriteIds = favoriteMemories?.map((memory) => memory.memory_id);
            const updatedFavoriteStatus = fetchedMemories.map((memory) =>
                favoriteIds.includes(memory.id)
            );

            setFavoriteStatus(updatedFavoriteStatus);
        } catch (error) {
            console.error('Error in checkFavoriteMemories:', error);
        }
    };

    const handleSavePress = async (index: number) => {
        try {
            const UID = await AsyncStorage.getItem("UID");
            if (!UID) {
                console.error("User ID not found.");
                return;
            }

            const memory = memories[index];
            const isSaved = savedStatus[index];

            if (isSaved) {
                const { error } = await supabase
                    .from('bottleshock_saved_memories')
                    .delete()
                    .match({ user_id: UID, memory_id: memory.id });

                if (error) {
                    console.error('Error removing memory:', error.message);
                    return;
                }
            } else {
                const { error } = await supabase
                    .from('bottleshock_saved_memories')
                    .insert([{ user_id: UID, memory_id: memory.id, created_at: new Date().toISOString() }]);

                if (error) {
                    console.error('Error saving memory:', error.message);
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

            const memory = memories[index];
            const isFavorited = favoriteStatus[index];

            if (isFavorited) {
                const { error } = await supabase
                    .from('bottleshock_fav_memories')
                    .delete()
                    .match({ user_id: UID, memory_id: memory.id });

                if (error) {
                    console.error('Error removing favorite memory:', error.message);
                    return;
                }
            } else {
                const { error } = await supabase
                    .from('bottleshock_fav_memories')
                    .insert([{ user_id: UID, memory_id: memory.id, created_at: new Date().toISOString() }]);

                if (error) {
                    console.error('Error favoriting memory:', error.message);
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

    if (isLoading) {
        return <SkeletonLoader />;
    }

    return (
        <ScrollView style={styles.container}>
            {/* HEADER */}
            {memories.map((memory, index) => {
                const thumbnailImage = memory.thumbnails?.find(thumbnail => thumbnail.is_thumbnail === true);
                return (
                    <View key={`memory-header-${memory.id}`} style={styles.imageContainer}>
                        {thumbnailImage ? (
                            <TwicImg src={thumbnailImage.url} style={styles.image} />
                        ) : (
                            <Image source={HeaderImg} style={styles.image} />
                        )}
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{memory.name}</Text>
                            <Text style={styles.subtext} numberOfLines={1}>{memory.short_description}</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleSavePress(index)}
                            >
                                <Ionicons
                                    name="attach"
                                    size={24}
                                    color={savedStatus[index] ? '#522F60' : 'gray'}
                                    style={styles.rotatedIcon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleFavoritePress(index)}
                            >
                                <Ionicons
                                    name={favoriteStatus[index] ? "heart" : "heart-outline"}
                                    size={24}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Ionicons name="share-outline" size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}
            {/* DESC */}
            {memories.map((memory) => (
                <View key={`memory-desc-${memory.id}`} style={styles.descriptionContainer}>
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
            {/* DATE */}
            {memories.map((memory) => (
                <View key={`memory-date-${memory.id}`} style={styles.datecontainer}>
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
            {/* PICANDVIDEO */}
            {memories.map((memory, memoryIndex) => (
                <View style={styles.picandvideoContainer} key={`memory-pics-${memory.id}`} >
                    <View style={styles.picandvideoHeaderContainer}>
                        <View style={styles.leftContent}>
                            <FontAwesome style={styles.picandvideoIcons} name="image" size={16} color="#522F60" />
                            <Text style={styles.picandvideoHeadertext}> {t('picsandvideos')}</Text>
                        </View>
                        <View style={styles.rightContent}>
                            <Pressable onPress={() => navigation.navigate("Thumbnail", { memoryId: memory.id })}>
                                <AntDesign style={styles.picandvideoArrowIcons} name="arrowright" size={20} color="#522F60" />
                            </Pressable>
                        </View>
                    </View>

                    {memory.thumbnails && memory.thumbnails.length > 0 && (
                        <View style={styles.picandvideoMainContainer}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.picandvideo}
                            >
                                {memory.thumbnails.map((thumbnail, thumbnailIndex) => (
                                    <View key={`thumbnail-${thumbnail.id}`} style={styles.imageContainer}>
                                        <Pressable
                                            onPress={() => handleThumbnailClick(memoryIndex, thumbnailIndex)}
                                            style={styles.picandvideoImage} // Ensure that image is still styled correctly
                                        >
                                            <TwicImg src={thumbnail.url} style={styles.picandvideoImage} />
                                        </Pressable>
                                        <Pressable
                                            onPress={() => handleThumbnailClick(memoryIndex, thumbnailIndex)} // Clicking the circle still triggers the same function
                                            style={styles.circle}
                                        >
                                            {thumbnail.is_thumbnail ? (
                                                <MaterialIcons name="check-circle" size={18} color="#FFFFFF" />
                                            ) : (
                                                <Entypo name="circle" size={18} color="#FFFFFF" />
                                            )}
                                        </Pressable>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            ))}
            {/* MAP */}
            {memories.map((memory, index) => (
                <View style={styles.MapContainer} key={`memory-map-${memory.id}`}>
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
                                    <Text style={styles.locationHeadertext}>
                                        {memory.restaurantORWinesORLocation}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.actionHeaderContainer}>
                            {memory.restaurant_id || memory.winery_id ? ( // Check if either restaurant_id or winery_id is present
                                <>
                                    <View style={styles.twoContent}>
                                        <TouchableOpacity onPress={() => handleSavePresswr(index)}>
                                            <Ionicons
                                                name="attach"
                                                size={18}
                                                color={savedItemsStatus[index] ? '#522F60' : 'gray'}
                                                style={styles.rotatedIcon}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.threeContent}>
                                        <TouchableOpacity onPress={() => handleFavoritePresswr(index)}>
                                            <Ionicons
                                                name={favoriteItemsStatus[index] ? 'heart' : 'heart-outline'}
                                                size={18}
                                                color='gray'
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : null}
                            <View style={styles.fourContent}>
                                <Ionicons name="share-outline" size={18} />
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
                            <Text style={styles.fulladdressText} numberOfLines={1}>
                                {memory.address}
                            </Text>
                        </View>
                    </View>
                </View>
            ))}

            <DiscoverWines id={id} />
            {from === "MyMemories" && <ShareWithFriends id={id} />}
            <View style={styles.bottom}></View>
        </ScrollView >
    );
};

export default MemoriesDetails;
