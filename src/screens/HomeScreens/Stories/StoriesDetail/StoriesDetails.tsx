import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Pressable ,Animated} from "react-native";
import { supabase } from "../../../../../backend/supabase/supabaseClient";
import { useRoute } from "@react-navigation/native";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shareDeepLink } from '../../../../utils/shareUtils';

installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

interface RouteParams {
  memoryId: number;
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
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Animated.View style={[styles.skeletonImage, { opacity }]} />
        <View style={styles.buttonContainer}>
          {[1, 2, 3].map((_, index) => (
            <Animated.View
              key={index}
              style={[styles.button, styles.skeletonButton, { opacity }]}
            />
          ))}
        </View>
      </View>
      <View style={styles.content}>
        <Animated.View style={[styles.skeletonHeading, { opacity }]} />
        {[1, 2, 3, 4].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.skeletonParagraph,
              { opacity, width: `${Math.random() * 20 + 80}%` }
            ]}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const StoriesDetail: React.FC = () => {
  const route = useRoute();
  const { memoryId } = route.params as RouteParams;

  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteStatus, setFavoriteStatus] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    const fetchStoryDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("bottleshock_stories")
        .select("id, heading, sub_heading, content, thumbnail_image")
        .eq("id", memoryId)
        .single();

      if (error) {
        console.error("Error fetching story details:", error.message);
      } else {
        setStory(data);
        await checkFavoriteStatus(data.id);
        await checkSavedStatus(data.id);
      }
      setLoading(false);
    };

    fetchStoryDetails();
  }, [memoryId]);

  const checkFavoriteStatus = async (storyId: number) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) return;

      const { data: favorites, error } = await supabase
        .from('bottleshock_fav_stories')
        .select('story_id')
        .eq('user_id', UID)
        .eq('story_id', storyId);

      if (error) {
        console.error('Error fetching favorite status:', error.message);
        return;
      }

      setFavoriteStatus(favorites.length > 0);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const checkSavedStatus = async (storyId: number) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) return;

      const { data: savedStories, error } = await supabase
        .from('bottleshock_saved_stories')
        .select('story_id')
        .eq('user_id', UID)
        .eq('story_id', storyId);

      if (error) {
        console.error('Error fetching saved status:', error.message);
        return;
      }

      setSavedStatus(savedStories.length > 0);
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
          .from('bottleshock_saved_stories')
          .delete()
          .match({ user_id: UID, story_id: story.id });

        if (error) {
          console.error('Error removing saved story:', error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('bottleshock_saved_stories')
          .insert([{ user_id: UID, story_id: story.id, created_at: new Date().toISOString() }]);

        if (error) {
          console.error('Error saving story:', error.message);
          return;
        }
      }

      setSavedStatus(!savedStatus);
    } catch (error) {
      console.error('Error handling save press:', error);
    }
  };
  const handleShare = async (index: number) => {
  //  const story = story;
    const title = story.name;
    const message = story.short_description;
    const route = `/app/story/${story.id}`;

    await shareDeepLink(title, message, route);
  };

  const extractContentAfterFirstImage = (content: string) => {
    const imagePattern = /!\[.*?\]\(.*?\)/;
    return content.replace(imagePattern, "").trim();
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!story) {
    return <Text>Story not found.</Text>;
  }

  const contentWithoutFirstImage = extractContentAfterFirstImage(story.content);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <TwicImg
          src={`https://bottleshock.twic.pics/file/${story.thumbnail_image}`}
          style={styles.image}
        />
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleSavePress}>
            <Ionicons name="attach" size={24} color={savedStatus ? "#522F60" : "gray"} style={styles.rotatedIcon} />
          </Pressable>
          <Pressable style={styles.button} onPress={handleFavoritePress}>
            <Ionicons name={favoriteStatus ? "heart" : "heart-outline"} size={24} />
          </Pressable>
          <Pressable style={styles.button} onPress={() => handleShare(story.id)}>
            <Ionicons name="share-outline" size={24} />
          </Pressable>
        </View>
      </View>
      <View style={styles.content}>
        <Markdown style={markdownStyles}>{contentWithoutFirstImage}</Markdown>
      </View>
      <View style={styles.bottom}></View>
    </ScrollView>
  );
};

export default StoriesDetail;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    paddingBottom: 400
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
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 5,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40
  },
  content: {
    padding: 16,
  },
  rotatedIcon: {
    transform: [{ rotate: '45deg' }],
  },
  // New skeleton styles
  skeletonImage: {
    width: "100%",
    height: 330,
    backgroundColor: '#E1E1E1',
  },
  skeletonButton: {
    backgroundColor: '#E1E1E1',
  },
  skeletonHeading: {
    height: 32,
    backgroundColor: '#E1E1E1',
    borderRadius: 4,
    marginBottom: 20,
    width: '90%',
  },
  skeletonParagraph: {
    height: 16,
    backgroundColor: '#E1E1E1',
    borderRadius: 4,
    marginVertical: 8,
  },
  bottom:{
    marginBottom:100,
  },
});

// Custom styles for Markdown rendering
const markdownStyles = {
  heading1: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 10,
    lineHeight: 36,
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600',
    color: "#000000",
    marginVertical: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
    fontWeight: '300',
  },
};
