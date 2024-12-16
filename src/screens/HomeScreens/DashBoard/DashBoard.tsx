import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Dimensions, Pressable, StyleSheet, Animated } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import styles from "./index.style";
import MyMemories from "./Feature/MyMemories/MyMemories";
import OtherMemories from "./Feature/OtherMemories/OtherMemories";
import Wineries from "./Feature/wineries/wineries";
import Restaurants from "./Feature/Restaurants/Restaurants";
import Stories from "./Feature/Stories/Stories";
import DiscoverWines from "./Feature/DiscoverWines/DiscoverWines";
import Icon from "react-native-vector-icons/FontAwesome6";
import Icons from "react-native-vector-icons/MaterialIcons";
import { supabase } from "../../../../backend/supabase/supabaseClient";
import { RootStackParamList } from "../../../TabNavigation/navigationTypes";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get("window");

// Install TwicPics with custom settings
installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

// Skeleton Component
const HeaderSkeleton: React.FC = () => {
  const shimmerAnimation = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shimmerTranslate = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[skeletonStyles.HeaderImgContainer, { width }]}>
      <View style={skeletonStyles.skeletonImage}>
        <Animated.View 
          style={[
            skeletonStyles.shimmerOverlay,
            { 
              transform: [{ translateX: shimmerTranslate }],
            }
          ]} 
        />
      </View>
      <View style={skeletonStyles.skeletonTextContainer}>
        <View style={skeletonStyles.skeletonHeading}>
          <Animated.View 
            style={[
              skeletonStyles.shimmerOverlay,
              { 
                transform: [{ translateX: shimmerTranslate }],
              }
            ]} 
          />
        </View>
        <View style={skeletonStyles.skeletonSubHeading}>
          <Animated.View 
            style={[
              skeletonStyles.shimmerOverlay,
              { 
                transform: [{ translateX: shimmerTranslate }],
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

// Skeleton Styles
const skeletonStyles = StyleSheet.create({
  HeaderImgContainer: {
    backgroundColor: '#F0F0F0',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  skeletonTextContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  skeletonHeading: {
    height: 24,
    backgroundColor: '#E0E0E0',
    marginBottom: 8,
    overflow: 'hidden',
  },
  skeletonSubHeading: {
    height: 20,
    backgroundColor: '#E0E0E0',
    width: '80%',
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});

// Main DashBoard Component
const DashBoard: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [memories, setMemories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const [showText, setShowText] = useState(false);
  const { t } = useTranslation();

  const handlePress = () => {
    setShowText(!showText);
  };

  useEffect(() => {
    const fetchStoriesListForDashBoard = async () => {
      try {
        setIsLoading(true);
        const { data: heroMemoriesData, error } = await supabase
          .from("bottleshock_stories")
          .select("*")
          .eq("is_hero", true);

        if (error) {
          console.error("Error fetching memories:", error.message);
          return;
        }
        setMemories(heroMemoriesData || []);
        console.log("Number of memories:", (heroMemoriesData || []).length);
      } catch (err) {
        console.error("Error fetching memories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoriesListForDashBoard();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.DashBoardContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.HeaderScrollContainer}
        >
          <View style={styles.HeaderContainer}>
            {isLoading ? (
              <HeaderSkeleton />
            ) : memories.length > 0 ? (
              memories.map((memory) => {
                const imageUrl = `${imagePrefix}${memory.thumbnail_image}`;
                console.log("Final Image Url is --", imageUrl);
                return (
                  <Pressable
                    key={memory.id}
                    onPress={() =>
                      navigation.navigate("StoriesDetail", { memoryId: memory.id })
                    }
                  >
                    <View style={[styles.HeaderImgContainer, { width }]}>
                      <TwicImg
                        src={imageUrl}
                        style={styles.img}
                        alt={memory.heading || "Default Heading"}
                      />
                      <Text style={styles.text}>
                        {memory.heading || "Default Heading"}
                      </Text>
                      <Text style={styles.subtext}>
                        {memory.sub_heading || "Default Sub-heading"}
                      </Text>
                      <Pressable
                        style={styles.saveButton}
                        onPress={() => navigation.navigate("StoriesList")}
                      >
                        <Icons name="library-books" size={27} color="#000" />
                      </Pressable>
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <Text style={styles.noMemoriesText}>{t('nomemoriesavailable')}</Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.searchContainer}>
          <Pressable onPress={handlePress} style={styles.searchIcon}>
            {showText ? (
              <Text style={styles.comingSoonText}>{t('comingsoon')}</Text>
            ) : (
              <Icon name="magnifying-glass" size={16} color="#522F60" style={styles.searchIcon} />
            )}
          </Pressable>
        </View>

        <View style={styles.MyMemoriesDashboardContainer}>
          <MyMemories />
        </View>
        <View style={styles.OtherMemoriesDashboardContainer}>
          <OtherMemories />
        </View>
        <View style={styles.WineriesDashboardContainer}>
          <Wineries />
        </View>
        <View style={styles.RestaurantsDashboardContainer}>
          <Restaurants />
        </View>
        <View style={styles.DiscoverWinesDashboardContainer}>
          <DiscoverWines />
        </View>
        <View style={styles.StoriesDashboardContainer}>
          <Stories />
        </View>
        <View style={styles.bottoms}></View>
      </View>
    </ScrollView>
  );
};

export default DashBoard;