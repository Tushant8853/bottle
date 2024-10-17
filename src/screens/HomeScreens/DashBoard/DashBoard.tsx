import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from "react-native";
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
import { RootStackParamList } from "../../../TabNavigation/navigationTypes"; // Adjust the path according to your structure

const { width } = Dimensions.get("window");

const DashBoard: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Use defined navigation types

  const updateSearch = (searchValue: string) => {
    setSearch(searchValue);
  };

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
            <Pressable onPress={() => navigation.navigate("StoriesDetail")}>
              <View style={[styles.HeaderImgContainer, { width }]}>
                <ImageBackground
                  source={require("../../../assets/png/HeaderIcon.png")}
                  style={styles.image}
                >
                  <Text style={styles.text}>Raplh Hertelendy</Text>
                  <Text style={styles.subtext}>~New Legend is Born~</Text>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => navigation.navigate("StoriesList")}
                  >
                    <Icons name="library-books" size={27} color="#000" />
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </Pressable>
            <View style={[styles.HeaderImgContainer, { width }]}>
              <ImageBackground
                source={require("../../../assets/png/Headerimage.png")}
                style={styles.image}
              >
                <Text style={styles.text}>Xander Soren</Text>
                <Text style={styles.subtext}>~Tech Exec to Winemaker~</Text>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => navigation.navigate("StoriesList")}
                >
                  <Icons name="library-books" size={27} color="#000" />
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
        </ScrollView>
        <View style={styles.searchContainer}>
          <Icon
            name="magnifying-glass"
            size={16}
            color="#522F60"
            style={styles.searchIcon}
          />
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
