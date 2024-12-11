import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, FlatList, Animated } from "react-native";
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../../../../../backend/supabase/supabaseClient";
import styles from "./index.style";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";
import { RootStackParamList } from "../../../../../TabNavigation/navigationTypes";
import Bannericon from "../../../../../assets/svg/SvgCodeFile/bannericon";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

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

const SkeletonLoader = () => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
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

  const renderSkeletonItem = () => (
    <View style={styles.cardContainer}>
      <Animated.View
        style={[
          styles.cardIcon,
          {
            backgroundColor: '#E1E9EE',
            opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          {
            height: 20,
            width: 140,
            backgroundColor: '#E1E9EE',
            marginLeft: 10,
            marginTop: 10,
            borderRadius: 4,
            opacity,
          },
        ]}
      />
    </View>
  );

  return (
    <FlatList
      data={[1, 2, 3]} // Show 3 skeleton items
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.toString()}
      renderItem={renderSkeletonItem}
      style={styles.cardsContainer}
    />
  );
};

const MyMemories: React.FC = () => {
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      fetchMemories();
    }, [])
  );

  const fetchMemories = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = () => {
    navigation.navigate("MemoriesList" as never);
  };

  const renderItem = ({ item }: { item: Memory }) => (
    <Pressable
      key={item.id}
      onPress={() => navigation.navigate("MemoriesDetails", { id: item.id, from: "MyMemories" })}
    >
      <TwicImg
        src={item.thumbnail || ""}
        style={styles.cardIcon}
        ratio="16/9"
        mode="cover"
      />
      {item.thumbnail ? null : (
        <Text style={styles.errorText}>Failed to load image</Text>
      )}
      <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View>
      <View style={styles.bannerContainer}>
        <Pressable onPress={handleNavigation}>
          <View style={styles.headingContainer}>
            <Bannericon width={13} height={32} color="#522F60" />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>{t('mymemories')}</Text>
            </View>
            {/* Conditionally render the arrow icon if there are memories */}
            {memories.length > 0 && (
              <View style={styles.bannerarrow}>
                <Icon name="chevron-right" size={16} color="#522F60" />
              </View>
            )}
          </View>
        </Pressable>
      </View>

      <View style={styles.card}>
        {isLoading ? (
          <SkeletonLoader />
        ) : memories.length === 0 ? (
          // Display message if no memories are available
          <Text style={styles.noMemoriesText}>{t('No Data')}</Text>
        ) : (
          <FlatList
            data={memories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={styles.cardsContainer}
          />
        )}
      </View>
    </View>
  );
};

export default MyMemories;