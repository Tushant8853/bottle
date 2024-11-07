import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, Pressable, FlatList } from "react-native";
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../../../../../backend/supabase/supabaseClient";
import styles from "./index.style";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";
import { RootStackParamList } from "../../../../../TabNavigation/navigationTypes";
import Bannericon from "../../../../../assets/svg/SvgCodeFile/bannericon";
import Icon from 'react-native-vector-icons/FontAwesome';
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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [memories, setMemories] = useState<Memory[]>([]);

  useFocusEffect(
    useCallback(() => {
      // Reload data whenever this component gains focus
      fetchMemories();
    }, [])
  );

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


  const handleNavigation = () => {
    navigation.navigate("MemoriesList" as never);
  };

  const renderItem = ({ item }: { item: Memory }) => (
    <Pressable key={item.id} onPress={() => navigation.navigate("MemoriesDetails", { id: item.id })}>
      <TwicImg
        src={item.thumbnail || ""}
        style={styles.cardIcon}
        ratio="16/9"
        mode="cover"
      />
      {item.thumbnail ? null : (
        <Text style={styles.errorText}>Failed to load image</Text>
      )}
      <Text style={styles.cardTitle}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View>
      <View style={styles.bannerContainer}>
        <Pressable onPress={handleNavigation}>
          <View style={styles.headingContainer}>
            <Bannericon width={13} height={32} color="#522F60" />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>my memories</Text>
            </View>
            <View style={styles.bannerarrow} >
              <Icon name="chevron-right" size={16} color="#522F60" />
            </View>
          </View>
        </Pressable>
      </View>

      <View style={styles.card}>
        <FlatList
          data={memories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.cardsContainer}
        />
      </View>
    </View>
  );
};

export default MyMemories;
