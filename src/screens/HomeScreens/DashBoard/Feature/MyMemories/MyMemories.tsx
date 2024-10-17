import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../../../../../backend/supabase/supabaseClient";
import styles from "./index.style";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";

interface Memory {
  id: string;
  name: string;
  thumbnail?: string;
}

installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

const MyMemories: React.FC = () => {
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const navigation = useNavigation();
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const UID = await AsyncStorage.getItem("UID");

        if (!UID) {
          console.error("UID is missing from AsyncStorage");
          return;
        }

        const { data: memoriesData, error } = await supabase
          .from("bottleshock_memories")
          .select("*")
          .eq("user_id", UID);

        if (error) {
          console.error("Error fetching memories:", error.message);
          return;
        }

        const updatedMemories = await Promise.all(
          memoriesData.map(async (memory: Memory) => {
            const { data: gallery, error: galleryError } = await supabase
              .from("bottleshock_memory_gallery")
              .select("file")
              .eq("memory_id", memory.id)
              .eq("is_thumbnail", true);

            if (galleryError) {
              console.error("Error fetching gallery:", galleryError);
            } else if (gallery.length > 0) {
              memory.thumbnail = imagePrefix + gallery[0].file;
            }
            return memory;
          })
        );

        setMemories(updatedMemories);
      } catch (err) {
        console.error("Error fetching memories:", err);
      }
    };

    fetchMemories();
  }, []);

  const handleNavigation = () => {
    navigation.navigate("StoriesList" as never);
  };

  return (
    <View>
      <View style={styles.bannerContainer}>
        <TouchableOpacity onPress={handleNavigation}>
          <Image source={require('../../../../../assets/png/MymemoriesIcon.png')} style={styles.bannerImage} />
        </TouchableOpacity>
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>my memories</Text>
        </View>
      </View>

      <View style={styles.card}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cardsContainer}
        >
          {memories.map((memory) => (
            <Pressable key={memory.id}>
              <TwicImg
                src={memory.thumbnail || ""}
                style={styles.cardIcon}
                ratio="16/9"
                mode="cover"
              />
              {memory.thumbnail ? null : (
                <Text style={styles.errorText}>Failed to load image</Text>
              )}

              <Text style={styles.cardTitle}>{memory.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default MyMemories;
