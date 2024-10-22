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
import styles from './index.style'; // Importing styles from index.style.js
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";

// Install TwicPics configuration
installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

const Stories: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [likedStatus, setLikedStatus] = useState<boolean[]>([false, false, false, false]); // Track if the item is saved or not
  const [memories, setMemories] = useState<any[]>([]);
  const imagePrefix = "https://bottleshock.twic.pics/file/";

  const handleSavePress = (index: number) => {
    const newStatus = [...likedStatus];
    newStatus[index] = !newStatus[index]; // Toggle the like status
    setLikedStatus(newStatus); // Toggle the state on button press
  };

  useEffect(() => {
    const fetchStoriesListForDashBoard = async () => {
      try {
        const { data: heroMemoriesData, error } = await supabase
          .from("bottleshock_stories")
          .select("id,thumbnail_image"); // Selecting only the thumbnail_image field

        if (error) {
          console.error("Error fetching memories:", error.message);
          return;
        }

        // Only keep the first 4 memories
        setMemories(heroMemoriesData?.slice(0, 4) || []);
        console.log("Number of memories:", (heroMemoriesData || []).length);
      } catch (err) {
        console.error("Error fetching memories:", err);
      }
    };

    fetchStoriesListForDashBoard();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image source={require('../../../../../assets/png/MymemoriesIcon.png')} style={styles.bannerImage} />
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>Featured Stories</Text>
        </View>
        <View>
        <Pressable
                        style={styles.saveButton}
                        onPress={() => navigation.navigate("StoriesList")}
                      >
          <Icons name="arrowright" size={22} color="#522F60" />
        </Pressable>
        </View>
      </View>
      <View style={styles.containerf}>
        {memories.reduce((rows, memory, index) => {
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
                  src={`${imagePrefix}${memory.thumbnail_image}`} // Correctly using a string for the src prop
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
