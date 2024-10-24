import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, FlatList } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../../../../../backend/supabase/supabaseClient";
import styles from "./index.style";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";
import { RootStackParamList } from "../../../../../TabNavigation/navigationTypes";

interface Memory {
  id: string;
  name: string;
  thumbnail?: string;
}

installTwicPics({
  domain: "https://bottleshock.twic.pics",
  debug: true,
  maxDPR: 3,
});

const OtherMemories: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const [memories, setMemories] = useState<Memory[]>([]);

  // Fetch memories from Supabase
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const UID = await AsyncStorage.getItem("UID");
        if (!UID) {
          console.error("User ID not found");
          return;
        }

        const { data: memories, error } = await supabase
          .from("bottleshock_memories")
          .select("*")
          .neq("user_id", UID);

        if (error) {
          console.error("Error fetching memories:", error.message);
          return;
        }

        const updatedMemories = await Promise.all(
          memories.map(async (memory: Memory) => {
            const { data: gallery, error: galleryError } = await supabase
              .from("bottleshock_memory_gallery")
              .select("file")
              .eq("memory_id", memory.id)
              .eq("is_thumbnail", true);

            if (galleryError) {
              console.error("Error fetching gallery:", galleryError);
            } else if (gallery && gallery.length > 0) {
              memory.thumbnail = `${imagePrefix}${gallery[0].file}?twic=v1&resize=800x600`;
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
      {/* Banner Section */}
      <View style={styles.bannerContainer}>
        <Pressable onPress={handleNavigation}>
          <View style={styles.headingContainer}>
            <Image
              source={require("../../../../../assets/png/MymemoriesIcon.png")}
              style={styles.bannerImage}
            />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Memories from Others</Text>
            </View>
          </View>
        </Pressable>
      </View>

      {/* Cards Section */}
      <View style={styles.card}>
        <FlatList
          data={memories}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          style={styles.cardsContainer}
        />
      </View>
    </View>
  );
};

export default OtherMemories;
