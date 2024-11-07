import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../TabNavigation/navigationTypes";
import Icon from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/AntDesign";
import { supabase } from "../../../../../../backend/supabase/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from './index.style';
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";
import Bannericon from "../../../../../assets/svg/SvgCodeFile/bannericon";

installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

const Stories: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [likedStatus, setLikedStatus] = useState<boolean[]>([false, false, false, false]);
  const [memories, setMemories] = useState<any[]>([]);
  const imagePrefix = "https://bottleshock.twic.pics/file/";

  const checkIfSaved = async () => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found");
        return;
      }

      // Fetch saved stories for the current user
      const { data: savedStories, error } = await supabase
        .from("bottleshock_saved_stories")
        .select("story_id")
        .eq("user_id", UID);

      if (error) {
        console.error("Error fetching saved stories:", error.message);
        return;
      }

      const savedStoryIds = savedStories?.map((saved) => saved.story_id) || [];

      // Update likedStatus based on whether the story is saved
      const initialLikedStatus = memories.map((memory) =>
        savedStoryIds.includes(memory.id)
      );
      setLikedStatus(initialLikedStatus);
    } catch (err) {
      console.error("Error checking saved stories:", err);
    }
  };

  const handleSavePress = async (index: number) => {
    const newStatus = [...likedStatus];
    newStatus[index] = !newStatus[index];
    setLikedStatus(newStatus);

    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found");
        return;
      }

      const storyId = memories[index].id;

      if (newStatus[index]) {
        const { error } = await supabase
          .from("bottleshock_saved_stories")
          .insert([{ user_id: UID, story_id: storyId }]);

        if (error) {
          console.error("Error saving story:", error.message);
        }
      } else {
        const { error } = await supabase
          .from("bottleshock_saved_stories")
          .delete()
          .eq("user_id", UID)
          .eq("story_id", storyId);

        if (error) {
          console.error("Error unsaving story:", error.message);
        }
      }
    } catch (err) {
      console.error("Error in handleSavePress:", err);
    }
  };

  useEffect(() => {
    const fetchStoriesListForDashBoard = async () => {
      try {
        const { data: heroMemoriesData, error } = await supabase
          .from("bottleshock_stories")
          .select("id,thumbnail_image");

        if (error) {
          console.error("Error fetching memories:", error.message);
          return;
        }

        setMemories(heroMemoriesData?.slice(0, 4) || []);
      } catch (err) {
        console.error("Error fetching memories:", err);
      }
    };

    fetchStoriesListForDashBoard();
  }, []);

  useEffect(() => {
    // Once memories are fetched, check if they are already saved
    if (memories.length > 0) {
      checkIfSaved();
    }
  }, [memories]);

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Bannericon width={13} height={32} color="#522F60" />
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>Featured Stories</Text>
        </View>
        <View>
          <Pressable
            style={styles.bannericonContainer}
            onPress={() => navigation.navigate("StoriesList")}
          >
            <Icons name="arrowright" size={22} color="#522F60" />
          </Pressable>
        </View>
      </View>
      <View style={styles.containerf}>
        {memories.reduce<JSX.Element[][]>((rows, memory, index) => {
          if (index % 2 === 0) {
            rows.push([]);
          }
          rows[rows.length - 1].push(
            <View key={index} style={styles.ComponentContainer}>
              <View style={styles.imageWrapper}>
                <Pressable
                  key={memory.id}
                  onPress={() =>
                    navigation.navigate("StoriesDetail", { memoryId: memory.id })
                  }
                >
                  <TwicImg
                    src={`${imagePrefix}${memory.thumbnail_image}`}
                    style={styles.componentIMGStyle}
                  />
                </Pressable>
                <Pressable onPress={() => handleSavePress(index)} style={styles.saveButton}>
                  <Icon
                    name={likedStatus[index] ? "bookmark" : "bookmark-o"}
                    size={20}
                    color="#30425F"
                  />
                </Pressable>
              </View>
            </View>
          );
          return rows;
        }, []).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Stories;
