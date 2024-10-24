import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { supabase } from "../../../../../backend/supabase/supabaseClient";
import { useRoute } from "@react-navigation/native";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons'; // Import icon library

installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

interface RouteParams {
  memoryId: number;
}

const StoriesDetail: React.FC = () => {
  const route = useRoute();
  const { memoryId } = route.params as RouteParams;

  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchStoryDetails = async () => {
      setLoading(true); // Start loading
      const { data, error } = await supabase
        .from("bottleshock_stories")
        .select("id, heading, sub_heading, content, thumbnail_image")
        .eq("id", memoryId)
        .single();

      if (error) {
        console.error("Error fetching story details:", error.message);
      } else {
        setStory(data);
      }
      setLoading(false); // Stop loading
    };

    fetchStoryDetails();
  }, [memoryId]);

  // Function to extract content after the first image in Markdown
  const extractContentAfterFirstImage = (content: string) => {
    const imagePattern = /!\[.*?\]\(.*?\)/;
    const modifiedContent = content.replace(imagePattern, "").trim();
    return modifiedContent;
  };

  // Show a loading spinner while data is being fetched
  if (loading) {
    return <ActivityIndicator size="large" color="#522F60" style={styles.loader} />;
  }

  if (!story) {
    return <Text>Story not found.</Text>; // Handle the case where no story is found
  }

  // Extract content without the first image
  const contentWithoutFirstImage = extractContentAfterFirstImage(story.content);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <TwicImg
          src={`https://bottleshock.twic.pics/file/${story.thumbnail_image}`} // Display thumbnail image
          style={styles.image}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="attach" size={24} style={styles.rotatedIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="heart-outline" size={24}  />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="share-outline" size={24}  />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <Markdown style={markdownStyles}>{contentWithoutFirstImage}</Markdown>
      </View>
    </ScrollView>
  );
};

export default StoriesDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: "100%",
    height: 330,
  },
  buttonContainer: {
    position: 'absolute',
    top: 25,
    right: 15,
    flexDirection: 'row',
    gap: 10, // Space between buttons
  },
  button: {
    backgroundColor: 'white', // Semi-transparent background
    borderRadius: 5,
    alignContent: 'center',
    alignItems:'center',
    justifyContent: 'center',
    width: 40,
    height: 40
  },
  rotatedIcon: {
    transform: [{ rotate: '45deg' }], // Rotate the icon 45 degrees
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "gray",
    marginBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

// Custom styles for Markdown rendering
const markdownStyles = {
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
};
