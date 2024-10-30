import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { supabase } from "../../../../../../../backend/supabase/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../../TabNavigation/navigationTypes";

interface Memory {
  id: string;
  name: string;
  thumbnail?: string;
  user_id: string;
  description: string;
  handle?: string;
}

installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

const SkeletonLoader: React.FC = () => {
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
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.titleMainContainer}>
          <Animated.View style={[styles.skeletonTitle, { opacity }]} />
          <View style={styles.actionIcons}>
            {[1, 2, 3].map((i) => (
              <Animated.View
                key={i}
                style={[styles.skeletonIcon, { opacity }]}
              />
            ))}
          </View>
        </View>
        <View style={styles.titleSecondMainContainer}>
          <Animated.View style={[styles.skeletonUsername, { opacity }]} />
          <View style={styles.starRating}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Animated.View
                key={i}
                style={[styles.skeletonStar, { opacity }]}
              />
            ))}
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <Animated.View style={[styles.skeletonDescription, { opacity }]} />
          <Animated.View
            style={[styles.skeletonDescription, { width: '60%', opacity }]}
          />
        </View>
      </View>
      <View style={styles.rightContent}>
        <Animated.View style={[styles.skeletonImage, { opacity }]} />
      </View>
    </View>
  );
};

const MyMemories: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const UID = await AsyncStorage.getItem("UID");

        if (!UID) {
          console.error("UID is missing from AsyncStorage");
          setIsLoading(false);
          return;
        }
        const { data: memories, error } = await supabase
          .from("bottleshock_memories")
          .select("id, user_id, name, description")
          .eq("user_id", UID);

        if (error) {
          console.error("Error fetching memories:", error.message);
          setIsLoading(false);
          return;
        }
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
            if (gallery && gallery.length > 0) {
              memory.thumbnail = `${imagePrefix}${gallery[0].file}?twic=v1&resize=60x60`;
            }
            const { data: user, error: userError } = await supabase
              .from("bottleshock_users")
              .select("handle")
              .eq("id", memory.user_id)
              .single();

            if (userError) {
              console.error("Error fetching user handle:", userError.message);
              return memory;
            }
            if (user) {
              memory.handle = user.handle;
            }

            return memory;
          })
        );

        setMemories(updatedMemories);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching memories:", err);
        setIsLoading(false);
      }
    };

    fetchMemories();
  }, []);

  const renderMemoryItem = ({ item: memory }: { item: Memory }) => (
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
              @{memory.handle}
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
                <FontAwesome key={index} name="star" size={11} color="grey" />
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
        <Pressable onPress={() => navigation.navigate("MemoriesDetails", { id: memory.id })}>
          {memory.thumbnail ? (
            <TwicImg
              src={memory.thumbnail}
              style={styles.image}
              ratio="1/1"
              mode="cover"
            />
          ) : (
            <View style={styles.placeholderImage} />
          )}
        </Pressable>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <FlatList
        data={[1, 2, 3, 4, 5]} // Show 5 skeleton items
        renderItem={() => <SkeletonLoader />}
        keyExtractor={(item) => item.toString()}
        contentContainerStyle={styles.scrollContainer}
      />
    );
  }

  return (
    <FlatList
      data={memories}
      renderItem={renderMemoryItem}
      keyExtractor={(memory) => memory.id}
      contentContainerStyle={styles.scrollContainer}
    />
  );
};

const styles = StyleSheet.create({
  // Skeleton styles
  skeletonTitle: {
    height: 16,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: '70%',
  },
  skeletonIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E1E9EE',
    marginHorizontal: 4,
  },
  skeletonUsername: {
    height: 12,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: '40%',
  },
  skeletonStar: {
    width: 11,
    height: 11,
    borderRadius: 2,
    backgroundColor: '#E1E9EE',
    marginHorizontal: 2,
  },
  skeletonDescription: {
    height: 12,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: '100%',
    marginVertical: 4,
  },
  skeletonImage: {
    width: 60,
    height: 60,
    backgroundColor: '#E1E9EE',
    borderRadius: 8,
  },
  // Existing styles
  scrollContainer: {
    paddingBottom: 350,
  },
  container: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
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
  },
  usernameIcon: {
    marginLeft: 1,
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
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
});

export default MyMemories;