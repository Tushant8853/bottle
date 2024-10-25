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
        // Use the existing thumbnail_image field for the story image
        const image = story.thumbnail_image ? imagePrefix + story.thumbnail_image : null;

        // Extract text after the heading
        const content = story.content;
        const textAfterHeading = extractTextAfterHeading(content);

        return {
          id: story.id,
          name: story.heading,
          short_description: story.sub_heading,
          image, // This is the thumbnail_image
          description: textAfterHeading,
        };
      });

      setStoriesList(updatedStories);
    };

    fetchStories();
  }, []);

  // Function to extract text after the heading
  const extractTextAfterHeading = (content: string) => {
    // Regular expression to match the heading (assuming it's marked with a leading #)
    const headingPattern = /# (.*)/;
    const imagePattern = /!\[.*?\]\(.*?\)/g; // Matches markdown image syntax

    // Remove all images from content
    const contentWithoutImages = content.replace(imagePattern, "");

    // Find the heading in the content
    const headingMatch = contentWithoutImages.match(headingPattern);

    if (headingMatch) {
      // Get the index of the end of the heading match
      const indexAfterHeading = contentWithoutImages.indexOf(headingMatch[0]) + headingMatch[0].length;

      // Extract the text after the heading
      return contentWithoutImages.substring(indexAfterHeading).trim();
    }

    // If no heading is found, return the original content
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
                    src={story.image} // This will now refer to the thumbnail_image
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
                      <Icon
                        name="heart-o"
                        size={16}
                        color="#808080"
                        marginRight={8}
                      />
                      <Icons name="share-outline" size={17} color="#808080" />
                    </View>
                  </View>
                  <View>
                    <Text style={styles.StoriesSubtitle}>
                      {story.short_description}
                    </Text>
                  </View>
                  {/* Display the new description without the heading or image */}
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
  StoriesListContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    backgroundColor: "white",
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
    textAlignVertical: "center",
    width: "100%",
    paddingRight: 40,
    color: "#333",
    textAlign: "center",
    alignItems: "center",
  },
  searchIcon: {
    marginRight: 7,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "black",
  },
  ListOfStoriesContainer: {
    borderTopWidth: 1.1,
    borderColor: "#808080",
    paddingHorizontal: 16,
  },
  Stories: {
    flexDirection: "row",
    marginBottom: 4,
    marginTop: 4,
    height: 108,
  },
  StoriesListMain: {
    marginTop: 8,
  },
  StoriesImgContainer: {
    justifyContent: "center",
    marginRight: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  StoriesImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  StoriesText: {
    flex: 1,
    height: 60,
  },
  StoriesTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  StoriesTitleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "black",
    paddingTop: 5,
  },
  StoriesSubtitle: {
    fontSize: 11,
    color: "gray",
  },
  StoriesDescription: {
    fontSize: 11,
    color: "#522F60",
    lineHeight: 16.5,
    paddingTop: 5,
  },
  StoriesTitleIMG: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
  },
  StoriesTitleTextContainer: {
    width: "75%",
  },
});

