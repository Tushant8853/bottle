import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../../../../../../backend/supabase/supabaseClient";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../../TabNavigation/navigationTypes";

interface Memory {
  id: string;
  name: string;
  thumbnail?: string;
  user_id: string;
  description: string;
  handle?: string;
  star_ratings: number;
}

installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

const SkeletonLoader: React.FC = () => {
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
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.titleMainContainer}>
          <Animated.View style={[styles.skeletonTitle, { opacity }]} />
          <View style={styles.actionIcons}>
            {[1, 2, 3].map((i) => (
              <Animated.View
                key={i}
                style={[styles.skeletonIcon, { opacity }]}
              />
            ))}
          </View>
        </View>
        <View style={styles.titleSecondMainContainer}>
          <Animated.View style={[styles.skeletonUsername, { opacity }]} />
          <View style={styles.starRating}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Animated.View
                key={i}
                style={[styles.skeletonStar, { opacity }]}
              />
            ))}
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <Animated.View style={[styles.skeletonDescription, { opacity }]} />
          <Animated.View
            style={[styles.skeletonDescription, { width: '60%', opacity }]}
          />
        </View>
      </View>
      <View style={styles.rightContent}>
        <Animated.View style={[styles.skeletonImage, { opacity }]} />
      </View>
    </View>
  );
};

const PublicMemories: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedStatus, setSavedStatus] = useState<boolean[]>([]);
  const [favoriteStatus, setFavoriteStatus] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const UID = await AsyncStorage.getItem("UID");

        if (!UID) {
          console.error("UID is missing from AsyncStorage");
          setIsLoading(false);
          return;
        }
        const { data: memories, error } = await supabase
          .from("bottleshock_memories")
          .select("id, user_id, name, description,star_ratings");

        if (error) {
          console.error("Error fetching memories:", error.message);
          return;
        }
        const updatedMemories = await Promise.all(
          memories.map(async (memory: Memory) => {
            const { data: gallery, error: galleryError } = await supabase
              .from("bottleshock_memory_gallery")
              .select("file")
              .eq("memory_id", memory.id);

            if (galleryError) {
              return memory;
            }
            if (gallery && gallery.length > 0) {
              memory.thumbnail = `${imagePrefix}${gallery[0].file}?twic=v1&resize=60x60`;
            }
            const { data: user, error: userError } = await supabase
              .from("bottleshock_users")
              .select("handle")
              .eq("id", memory.user_id)
              .single();

            if (userError) {
              console.error("Error fetching user handle:", userError.message);
              return memory;
            }
            if (user) {
              memory.handle = user.handle;
            }
            return memory;
          })
        );
        setMemories(updatedMemories);
        await checkSavedMemories(updatedMemories);
        await checkFavoriteMemories(updatedMemories);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching memories:", err);
        setIsLoading(false);
      }
    };
    fetchMemories();
  }, []);

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
  const renderStars = (rating: number) => {
    const totalStars = 5; // Total number of stars
    const fullStars = Math.floor(rating); // Number of full stars
    const hasHalfStar = rating % 1 >= 0.5; // Check if there's a half star
    const starFillWidth = `${(rating / totalStars) * 100}%`; // Percentage width for the filled stars
  
    return (
      <View style={styles.starRating}>
        {/* Render 5 outlined stars as the background */}
        {Array(totalStars)
          .fill(null)
          .map((_, index) => (
            <FontAwesome
              key={`outline-${index}`}
              name="star-o"
              size={11}
              color="grey" // Outline color for stars
            />
          ))}
  
        {/* Render filled stars based on rating */}
        <View style={[styles.starFillContainer, { width: starFillWidth }]}>
          {Array(totalStars)
            .fill(null)
            .map((_, index) => {
              // If the index is less than the number of full stars, render full star
              if (index < fullStars) {
                return (
                  <FontAwesome
                    key={`filled-${index}`}
                    name="star"
                    size={11}
                    color="grey" // Filled star color
                  />
                );
              }
              // If we have a half star
              else if (index === fullStars && hasHalfStar) {
                return (
                  <FontAwesome
                    key={`half-${index}`}
                    name="star-half-full"
                    size={11}
                    color="grey"
                  />
                );
              }
              return null; // Empty star, not rendered
            })}
        </View>
      </View>
    );
  };

  const renderItem = ({ item: memory, index }: { item: Memory; index: number }) => (
    <View key={memory.id} style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.titleMainContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {memory.name}
            </Text>
          </View>
          <View style={styles.actionIcons}>
          <TouchableOpacity 
                  onPress={() => handleSavePress(index)}
                  accessibilityLabel={`Link to ${memory.name}`} 
                  accessibilityRole="button"
                >
                  <Feather
                    name="paperclip"
                    size={16}
                    color={savedStatus[index] ? '#522F60' : 'gray'}
                    style={styles.Icons}
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleFavoritePress(index)}
                  accessibilityLabel={`Favorite ${memory.name}`} 
                  accessibilityRole="button"
                >
                  <FontAwesome
                    name={favoriteStatus[index] ? "heart" : "heart-o"}
                    size={16}
                    color='gray'
                    style={styles.Icons}
                  />
                </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                style={styles.Icons}
                name="share-outline"
                size={16}
                color="grey"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.titleSecondMainContainer}>
          <View style={styles.usernameContainer}>
            <Text style={styles.username} numberOfLines={1}>
              @{memory.handle}
            </Text>
            <Ionicons
              style={styles.usernameIcon}
              name="checkmark-circle"
              size={11}
              color="grey"
            />
          </View>
          {renderStars(memory.star_ratings)}
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.StoriesDescription} numberOfLines={2}>
            {memory.description}
          </Text>
        </View>
      </View>

      <View style={styles.rightContent}>
        <Pressable onPress={() => navigation.navigate("MemoriesDetails", { id: memory.id })}>
          {memory.thumbnail ? (
            <TwicImg
              src={memory.thumbnail}
              style={styles.image}
              ratio="1/1"
              mode="cover"
            />
          ) : (
            <View style={styles.placeholderImage} />
          )}
        </Pressable>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        data={[1, 2, 3, 4, 5]} // Show 5 skeleton items
        renderItem={() => <SkeletonLoader />}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.scrollContainer}
      data={memories}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...

  // Skeleton styles
  skeletonTitle: {
    height: 16,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: '70%',
  },
  skeletonIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E1E9EE',
    marginHorizontal: 4,
  },
  skeletonUsername: {
    height: 12,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: '40%',
  },
  skeletonStar: {
    width: 11,
    height: 11,
    borderRadius: 2,
    backgroundColor: '#E1E9EE',
    marginHorizontal: 2,
  },
  skeletonDescription: {
    height: 12,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: '100%',
    marginVertical: 4,
  },
  skeletonImage: {
    width: 60,
    height: 60,
    backgroundColor: '#E1E9EE',
    borderRadius: 8,
  },
  scrollContainer: {
    paddingBottom: 350,
  },
  container: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    backgroundColor: "white",
    flexDirection: "row",
  },
  leftContent: {
    flex: 8,
  },
  rightContent: {
    flex: 2,
    alignItems: "flex-end",
  },
  titleMainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleContainer: {
    justifyContent: "center",
    flex: 7.5,
    height: 22,
  },
  title: {
    fontWeight: "600",
    fontSize: 13,
    fontFamily: "Hiragino Sans",
  },
  actionIcons: {
    flex: 2.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  Icons: {},
  titleSecondMainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  usernameContainer: {
    flex: 7.5,
    flexDirection: "row",
    alignItems: "center",
  },
  starRating: {
    flex: 2.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative", // To set a reference for the absolute positioning in starFillContainer
  },
  starFillContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "space-around", // Space out stars equally within the container
    width: "100%", // Ensures the filled stars cover the full width
    height: "100%", // Ensures the filled stars cover the full height of the container
  },
  username: {
    fontSize: 11,
    fontWeight: "400",
    fontFamily: "SF Pro",
    color: "#808080",
  },
  usernameIcon: {
    marginLeft: 1,
  },
  descriptionContainer: {
    height: 35,
  },
  StoriesDescription: {
    fontSize: 11,
    fontFamily: "Hiragino Sans",
    color: "#522F60",
    lineHeight: 16.5,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    borderRadius: 8,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
});

export default PublicMemories;