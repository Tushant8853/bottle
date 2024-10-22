import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { supabase } from "../../../../../../backend/supabase/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../TabNavigation/navigationTypes";

// Define Memory interface for TypeScript typing
interface Memory {
  id: string;
  name: string;
  thumbnail?: string;
  user_id: string;
  description: string;
  handle?: string; // Added handle for user
}

installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

const PublicMemories: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const UID = await AsyncStorage.getItem("UID");

        if (!UID) {
          console.error("UID is missing from AsyncStorage");
          return;
        }

        // Fetch memories with user_id
        const { data: memories, error } = await supabase
          .from("bottleshock_memories")
          .select("id, user_id, name, description")
          .eq("user_id", UID); // Corrected the query syntax

        if (error) {
          console.error("Error fetching memories:", error.message);
          return;
        }

        // Fetch gallery files for the memories
        const updatedMemories = await Promise.all(
          memories.map(async (memory: Memory) => {
            const { data: gallery, error: galleryError } = await supabase
              .from("bottleshock_memory_gallery")
              .select("file")
              .eq("memory_id", memory.id);

            if (galleryError) {
              console.error("Error fetching gallery:", galleryError.message);
              return memory;
            }

            // Set thumbnail if available
            if (gallery && gallery.length > 0) {
              memory.thumbnail = `${imagePrefix}${gallery[0].file}?twic=v1&resize=60x60`;
            }

            // Fetch user's handle
            const { data: user, error: userError } = await supabase
              .from("bottleshock_users")
              .select("handle")
              .eq("id", memory.user_id) // Compare user_id to id in users table
              .single(); // Fetch single user since user_id is unique

            if (userError) {
              console.error("Error fetching user handle:", userError.message);
              return memory;
            }

            // Add user's handle to the memory
            if (user) {
              memory.handle = user.handle;
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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View>
        {memories.map((memory) => (
          <View key={memory.id} style={styles.container}>
            <View style={styles.leftContent}>
              <View style={styles.titleMainContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title} numberOfLines={1}>
                    {memory.name}
                  </Text>
                </View>
                <View style={styles.actionIcons}>
                  <TouchableOpacity>
                    <Ionicons
                      style={styles.Icons}
                      name="pencil-outline"
                      size={16}
                      color="grey"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons
                      style={styles.Icons}
                      name="heart-outline"
                      size={16}
                      color="grey"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons
                      style={styles.Icons}
                      name="share-outline"
                      size={16}
                      color="grey"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.titleSecondMainContainer}>
                <View style={styles.usernameContainer}>
                  <Text style={styles.username} numberOfLines={1}>
                    @{memory.handle} {/* Display the user's handle */}
                  </Text>
                  <Ionicons
                    style={styles.usernameIcon}
                    name="checkmark-circle"
                    size={11}
                    color="grey"
                  />
                </View>
                <View style={styles.starRating}>
                  {Array(4)
                    .fill(null)
                    .map((_, index) => (
                      <FontAwesome
                        key={index}
                        name="star"
                        size={11}
                        color="grey"
                      />
                    ))}
                  <FontAwesome name="star-half-full" size={11} color="grey" />
                </View>
              </View>
              <View style={styles.descriptionContainer}>
                <Text style={styles.StoriesDescription} numberOfLines={2}>
                  {memory.description}
                </Text>
              </View>
            </View>

            <View style={styles.rightContent}>
              <Pressable onPress={() => navigation.navigate("MemoriesDetails")}>
                {memory.thumbnail ? (
                  <TwicImg
                    src={memory.thumbnail}
                    style={styles.image}
                    resize="60x60"
                    mode="cover"
                  />
                ) : (
                  <View style={styles.placeholderImage} />
                )}
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 350,
  },
  container: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 4,
    backgroundColor: "white",
    flexDirection: "row",
  },
  leftContent: {
    flex: 8,
  },
  rightContent: {
    flex: 2,
    alignItems: "flex-end",
  },
  titleMainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleContainer: {
    justifyContent: "center",
    flex: 7.5,
    height: 22,
  },
  title: {
    fontWeight: "600",
    fontSize: 13,
    fontFamily: "Hiragino Sans",
  },
  actionIcons: {
    flex: 2.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  Icons: {},
  titleSecondMainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  usernameContainer: {
    flex: 7.5,
    flexDirection: "row",
    alignItems: "center",
  },
  starRating: {
    flex: 2.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  username: {
    fontSize: 11,
    fontWeight: "400",
    fontFamily: "SF Pro",
    color: "#808080",
    width: "30%",
  },
  usernameIcon: {
    marginLeft: 4,
  },
  descriptionContainer: {
    height: 35,
  },
  StoriesDescription: {
    fontSize: 11,
    fontFamily: "Hiragino Sans",
    color: "#522F60",
    lineHeight: 16.5,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    borderRadius: 8,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    backgroundColor: "#e0e0e0", // Light gray placeholder
    borderRadius: 8,
  },
});

export default PublicMemories;
