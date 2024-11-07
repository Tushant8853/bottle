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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/Ionicons";
import { supabase } from "../../../../../backend/supabase/supabaseClient";
import { RootStackParamList } from "../../../../TabNavigation/navigationTypes";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const StoriesList: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const imagePrefix = "https://bottleshock.twic.pics/file/";

  const [search, setSearch] = useState<string>("");
  const [storiesList, setStoriesList] = useState<Story[]>([]);
  const [favoriteStatus, setFavoriteStatus] = useState<boolean[]>([]);

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

      setStoriesList(updatedStories);
      await checkFavoriteStories(updatedStories); // Check favorite status
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.Backbotton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="angle-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stories</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={16} color="#989999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="search"
          placeholderTextColor={"#e5e8e8"}
          value={search}
          onChangeText={updateSearch}
        />
        <Icon name="microphone" size={16} color="#989999" />
      </View>

      {/* Stories List */}
      <View style={styles.StoriesListMain}>
        <ScrollView style={styles.ListOfStoriesContainer}>
          {storiesList.map((story, index) => (
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
                          name={favoriteStatus[index] ? "heart" : "heart-o"}
                          size={16}
                          color="#808080"
                          marginRight={8}
                        />
                      </TouchableOpacity>
                      <Icons name="share-outline" size={17} color="#808080" />
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
          ))}
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
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  StoriesImgContainer: {
    width: 80,
    height: 80,
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
});
