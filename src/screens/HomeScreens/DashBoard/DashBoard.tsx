import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Dimensions, Pressable, ImageBackground } from "react-native";
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

const { width } = Dimensions.get("window");

// Install TwicPics with custom settings
installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

const DashBoard: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [memories, setMemories] = useState<any[]>([]);
  const imagePrefix = "https://bottleshock.twic.pics/file/";

  useEffect(() => {
    const fetchStoriesListForDashBoard = async () => {
      try {
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
            {memories.length > 0 ? (
              memories.map((memory) => {
                const imageUrl = `${imagePrefix}${memory.thumbnail_image}`;
                console.log("Final Image Url is --", imageUrl);
                return (
                  <Pressable
                    key={memory.id}
                    onPress={() =>
                      navigation.navigate("StoriesDetail", { id: memory.id })
                    }
                  >
                    <View style={[styles.HeaderImgContainer, { width }]}>
                      <TwicImg
                        src={imageUrl}
                        style={styles.image}
                        alt={memory.heading || "Default Heading"} // Add alt text for accessibility
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
              <Text style={styles.noMemoriesText}>No memories available.</Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.searchContainer}>
          <Icon
            name="magnifying-glass"
            size={16}
            color="#522F60"
            style={styles.searchIcon}
          />
          {/* Add TextInput here if needed */}
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
