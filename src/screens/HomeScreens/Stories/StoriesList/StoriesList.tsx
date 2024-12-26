import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/Ionicons";
import { supabase } from "../../../../../backend/supabase/supabaseClient";
import { RootStackParamList } from "../../../../TabNavigation/navigationTypes";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { shareDeepLink } from '../../../../utils/shareUtils';


installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

interface Story {
  id: number;
  name: string;
  short_description: string;
  image?: string | null;
  description: string;
}
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
    <View style={styles.Stories}>
      <Animated.View style={[styles.SkeletonImage, { opacity }]} />
      <View style={styles.StoriesText}>
        <View style={styles.StoriesTitle}>
          <View style={styles.StoriesTitleTextContainer}>
            <Animated.View style={[styles.SkeletonTitle, { opacity }]} />
          </View>
          <View style={styles.StoriesTitleIMG}>
            <Animated.View style={[styles.SkeletonIcon, { opacity }]} />
            <Animated.View style={[styles.SkeletonIcon, { opacity }]} />
          </View>
        </View>
        <Animated.View style={[styles.SkeletonSubtitle, { opacity }]} />
        <Animated.View style={[styles.SkeletonDescription, { opacity }]} />
        <Animated.View style={[styles.SkeletonDescription, { opacity, width: '60%' }]} />
      </View>
    </View>
  );
};

const StoriesList: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const [search, setSearch] = useState<string>("");
  const [storiesList, setStoriesList] = useState<Story[]>([]);
  const [favoriteStatus, setFavoriteStatus] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const [showComingSoon, setShowComingSoon] = useState(false);

  const updateSearch = (searchValue: string) => {
    setSearch(searchValue);
  };

  useEffect(() => {
    const fetchStories = async () => {
      const { data: storiesData, error } = await supabase
        .from("bottleshock_stories")
        .select("id, heading, sub_heading, content, thumbnail_image");

      if (error) {
        console.error("Error fetching stories:", error.message);
        return;
      }

      const updatedStories = storiesData.map((story: any) => {
        const image = story.thumbnail_image ? imagePrefix + story.thumbnail_image : null;
        const content = story.content;
        const textAfterHeading = extractTextAfterHeading(content);

        return {
          id: story.id,
          name: story.heading,
          short_description: story.sub_heading,
          image,
          description: textAfterHeading,
        };
      });
      await checkFavoriteStories(updatedStories); // Check favorite status
      setStoriesList(updatedStories);
      setIsLoading(false);
    };

    fetchStories();
  }, []);

  const checkFavoriteStories = async (fetchedStories: Story[]) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found.");
        return;
      }

      const { data: favoriteStories, error } = await supabase
        .from('bottleshock_fav_stories')
        .select('story_id')
        .eq('user_id', UID);

      if (error) {
        console.error('Error fetching favorite stories:', error.message);
        return;
      }

      const favoriteIds = favoriteStories?.map((story) => story.story_id);
      const updatedFavoriteStatus = fetchedStories.map((story) =>
        favoriteIds.includes(story.id)
      );

      setFavoriteStatus(updatedFavoriteStatus);
    } catch (error) {
      console.error('Error in checkFavoriteStories:', error);
    }
  };

  const handleFavoritePress = async (index: number) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found.");
        return;
      }

      const story = storiesList[index];
      const isFavorited = favoriteStatus[index];

      if (isFavorited) {
        const { error } = await supabase
          .from('bottleshock_fav_stories')
          .delete()
          .match({ user_id: UID, story_id: story.id });

        if (error) {
          console.error('Error removing favorite story:', error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('bottleshock_fav_stories')
          .insert([{ user_id: UID, story_id: story.id, created_at: new Date().toISOString() }]);

        if (error) {
          console.error('Error favoriting story:', error.message);
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

  // Function to extract text after the heading
  const extractTextAfterHeading = (content: string) => {
    const headingPattern = /# (.*)/;
    const imagePattern = /!\[.*?\]\(.*?\)/g;

    const contentWithoutImages = content.replace(imagePattern, "");
    const headingMatch = contentWithoutImages.match(headingPattern);

    if (headingMatch) {
      const indexAfterHeading = contentWithoutImages.indexOf(headingMatch[0]) + headingMatch[0].length;
      return contentWithoutImages.substring(indexAfterHeading).trim();
    }

    return contentWithoutImages.trim();
  };

  const handleShare = async (index: number) => {
    const story = storiesList[index];
    const title = story.name;
    const message = story.short_description;
    const route = `stories`;
    await shareDeepLink(title, message, route);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={16} color="#989999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('search')}
          placeholderTextColor={"#e5e8e8"}
          onFocus={() => setShowComingSoon(true)} // Show "Coming soon" message on focus
          onBlur={() => setShowComingSoon(false)} // Hide the message when focus is lost
        />
        {showComingSoon && (
          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonText}>{t('comingsoon')}</Text>
          </View>
        )}
        <Icon name="microphone" size={16} color="#989999" />
      </View>

      {/* Stories List */}
      <View style={styles.StoriesListMain}>
        <ScrollView style={styles.ListOfStoriesContainer}>
          {isLoading ? (
            // Show multiple skeleton loaders while loading
            [...Array(5)].map((_, index) => (
              <SkeletonLoader key={`skeleton-${index}`} />
            ))
          ) : (
            storiesList.map((story, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  navigation.navigate("StoriesDetail", { memoryId: story.id })
                }
              >
                <View style={styles.Stories}>
                  <View style={styles.StoriesImgContainer}>
                    <TwicImg
                      src={story.image}
                      style={styles.StoriesImage}
                    />
                  </View>
                  <View style={styles.StoriesText}>
                    <View style={styles.StoriesTitle}>
                      <View style={styles.StoriesTitleTextContainer}>
                        <Text style={styles.StoriesTitleText} numberOfLines={1}>
                          {story.name}
                        </Text>
                      </View>
                      <View style={styles.StoriesTitleIMG}>
                        <TouchableOpacity onPress={() => handleFavoritePress(index)}>
                          <Icon
                            style={styles.IconMarginRight}
                            name={favoriteStatus[index] ? "heart" : "heart-o"}
                            size={16}
                            color="#808080"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleShare(index)}>
                          <Icons name="share-outline" size={17} color="#808080" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.StoriesSubtitle}>
                        {story.short_description}
                      </Text>
                    </View>
                    <Text style={styles.StoriesDescription} numberOfLines={3}>
                      {story.description}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default StoriesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
    marginHorizontal: 16,
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
    height: 40,
  },
  StoriesListMain: {
    flex: 1,
  },
  ListOfStoriesContainer: {
    flexGrow: 1,
  },
  Stories: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  StoriesImgContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
  },
  StoriesImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  StoriesText: {
    flex: 1,
    marginLeft: 10,
  },
  StoriesTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  StoriesTitleTextContainer: {
    flex: 1,
  },
  StoriesTitleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  StoriesTitleIMG: {
    flexDirection: "row",
    alignItems: "center",
  },
  StoriesSubtitle: {
    fontSize: 14,
    color: "#808080",
  },
  StoriesDescription: {
    fontSize: 12,
    color: "#333",
    marginTop: 4,
  },
  Backbotton: {},
  IconMarginRight: {
    marginRight: 8,
  },
  // New skeleton styles
  SkeletonImage: {
    width: 80,
    height: 80,
    backgroundColor: '#E1E1E1',
    borderRadius: 8,
  },
  SkeletonTitle: {
    height: 20,
    backgroundColor: '#E1E1E1',
    borderRadius: 4,
    width: '80%',
    marginBottom: 8,
  },
  SkeletonSubtitle: {
    height: 16,
    backgroundColor: '#E1E1E1',
    borderRadius: 4,
    width: '60%',
    marginVertical: 8,
  },
  SkeletonDescription: {
    height: 12,
    backgroundColor: '#E1E1E1',
    borderRadius: 4,
    width: '90%',
    marginVertical: 4,
  },
  SkeletonIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#E1E1E1',
    borderRadius: 8,
    marginHorizontal: 4,
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
