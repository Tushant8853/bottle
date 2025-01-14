import { View, Text, Image, Animated, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useState, useRef,useCallback } from "react";
import styles from "./index.style";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useRoute, RouteProp } from "@react-navigation/native";
import { supabase } from "../../../../../../../backend/supabase/supabaseClient";
import { useTranslation } from "react-i18next";
import Bannericon from "../../../../../../assets/svg/SvgCodeFile/bannericon";
import { useNavigation, NavigationProp,useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';
import { RootStackParamList } from "../../../../../../TabNavigation/navigationTypes";

interface Wine {
  image: string;
  year: number;
  brand_name: string;
  varietal_name: string;
  winery_name: string;
  bottleshock_rating: number;
  winery_id: number;
  wines_id: number;
  varietal_id: number;
}

const SkeletonLoader = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
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
      ]).start(() => startAnimation());
    };

    startAnimation();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return Array(3)
    .fill(null)
    .map((_, index) => (
      <View key={index} style={styles.ListOfStoriesContainer}>
        <View style={styles.Stories}>
          <Animated.View style={[styles.StoriesImgContainer, { opacity }]}>
            <View
              style={{
                width: "100%",
                height: "90%",
                backgroundColor: "#E0E0E0",
              }}
            />
          </Animated.View>
          <View style={styles.StoriesText}>
            <View style={styles.StoriesTitle}>
              <Animated.View
                style={[
                  {
                    width: "60%",
                    height: 12,
                    backgroundColor: "#E0E0E0",
                    borderRadius: 4,
                    opacity,
                  },
                ]}
              />
            </View>
            <Animated.View
              style={[
                {
                  width: "80%",
                  height: 14,
                  backgroundColor: "#E0E0E0",
                  borderRadius: 4,
                  marginTop: 8,
                  opacity,
                },
              ]}
            />
            <View style={styles.StoriesDescriptionConatiner}>
              <Animated.View
                style={[
                  {
                    width: "30%",
                    height: 12,
                    backgroundColor: "#E0E0E0",
                    borderRadius: 4,
                    marginTop: 8,
                    opacity,
                  },
                ]}
              />
              <Animated.View
                style={[
                  {
                    width: "40%",
                    height: 12,
                    backgroundColor: "#E0E0E0",
                    borderRadius: 4,
                    marginTop: 8,
                    opacity,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    ));
};

const DiscoverWines: React.FC = () => {
  const route = useRoute<RouteProp<{ params: { id: string } }, "params">>();
  const [wines, setWines] = useState<Wine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const { id, FinalImage }: { id: string; FinalImage?: string } = route.params || {};
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [localImages, setlocalImages] = useState<string[]>([]);
    
    
  useFocusEffect(
     useCallback(() => {
       fetchSavedImages();
     }, [])
   );

   const fetchSavedImages = async () => {
     try {
       const images = JSON.parse(await AsyncStorage.getItem('savedImages') || '[]');
       console.log(images);
       const fileNames = images.map((path: string) => path.split('/').pop());
       console.log('filenames:::::::',fileNames);
       setlocalImages(fileNames);
           console.log('savedImages:::::::',localImages);
     
 
     } catch (error) {
       console.error("Error fetching saved images:", error);
     }
   };

  useEffect(() => {
    const fetchWines = async () => {
      try {
        const { data: bottleshockMemoryWinesData, error: wineriesError } =
          await supabase
            .from("bottleshock_memory_wines")
            .select("wine_id, user_photo, eye_varietal, eye_brand, eye_vintage")
            .eq("memory_id", id);

        if (wineriesError) {
          console.error("🚨 Error fetching wineries:", wineriesError.message);
          return;
        }

        if (bottleshockMemoryWinesData) {
          const bottleshockWinesDetails = await Promise.all(
            bottleshockMemoryWinesData.map(
              async ({
                wine_id,
                eye_varietal,
                eye_brand,
                eye_vintage,
                user_photo,
              }) => {
                if (!wine_id) {
                  // Construct wine details from eye_* fields
                  return {
                    winery_name: eye_brand,
                    brand_name: eye_varietal,
                    year: eye_vintage,
                    bottleshock_rating: null,
                    winery_id: null,
                    wines_id: null,
                    varietal_id: null,
                    image: user_photo, // Placeholder or handle differently if needed
                  };
                }

                // Existing logic for fetching wine details when wine_id is not null
                const { data: bottleshockWinesData, error: wineError } =
                  await supabase
                    .from("bottleshock_wines")
                    .select(
                      "wines_id, year, image, bottleshock_rating, varietal_id"
                    )
                    .eq("wines_id", wine_id)
                    .limit(1);

                if (wineError) {
                  console.error(
                    "Error fetching wine details:",
                    wineError.message
                  );
                  return null;
                }

                if (bottleshockWinesData && bottleshockWinesData.length > 0) {
                  const wine = bottleshockWinesData[0];
                  const { data: varietalsData, error: varietalsError } =
                    await supabase
                      .from("bottleshock_winery_varietals")
                      .select("varietal_name, brand_name, winery_id")
                      .eq("winery_varietals_id", wine.varietal_id)
                      .limit(1);

                  if (varietalsError) {
                    console.error(
                      "Error fetching varietal details:",
                      varietalsError.message
                    );
                    return null;
                  }

                  if (varietalsData && varietalsData.length > 0) {
                    const varietal = varietalsData[0];
                    const { data: wineryData, error: wineryError } =
                      await supabase
                        .from("bottleshock_wineries")
                        .select("winery_name")
                        .eq("wineries_id", varietal.winery_id)
                        .limit(1);

                    if (wineryError) {
                      console.error(
                        "Error fetching winery name:",
                        wineryError.message
                      );
                      return null;
                    }

                    return {
                      wines_id: wine.wines_id,
                      year: wine.year.slice(0, 4),
                      image: wine.image,
                      bottleshock_rating: wine.bottleshock_rating,
                      varietal_id: wine.varietal_id,
                      varietal_name: varietal.varietal_name,
                      brand_name: varietal.brand_name,
                      winery_id: varietal.winery_id,
                      winery_name:
                        wineryData && wineryData.length > 0
                          ? wineryData[0].winery_name
                          : null,
                    };
                  }
                }
                return null;
              }
            )
          );

          const winesData = bottleshockWinesDetails.filter(
            (wine) => wine !== null
          );
          setWines(winesData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        setIsLoading(false);
      }
    };

    fetchWines();
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.TitleContainer}>
        <View style={styles.leftContainer}>
          <Bannericon width={13} height={22} color="#522F60" />
          <Text style={styles.text}>{t("winesenjoyed")}</Text>
        </View>
      </View>
      {isLoading ? (
    <SkeletonLoader />
) : wines.length > 0 ? (
    wines.map((wine, index) => {
        const isWineIdNull = !wine.wines_id;
                       const localImage = localImages.find((image) => image === wine.image);
                       console.log('localImage',localImage)
                   
                       // Dynamic prefix based on the platform
                       const PREFIX = Platform.OS === 'ios'
                         ? FileSystem.documentDirectory
                         : 'file:///data/user/0/host.exp.exponent/files/';
                     
                       const FinalImag = localImage ? `${PREFIX}${localImage}` : null; // Check if wine_id is null

        return isWineIdNull ? (
            // Non-clickable wine details for null wine_id
            <View key={index} style={styles.ListOfStoriesContainer}>
                <View style={styles.Stories}>
                    <View style={styles.StoriesImgContainer1}>
                    {FinalImag ? (
                        <Image source={{ uri: FinalImag }} style={styles.StoriesImage1} />
                    ) : (
                        <Image source={{ uri: imagePrefix + wine.image }} style={styles.StoriesImage} />
                    )}
                    </View>
                    <View style={styles.StoriesText}>
                        <View style={styles.StoriesTitle}>
                            <View style={styles.StoriesTitleTextContainer}>
                                <Text style={styles.StoriesSubtitle} numberOfLines={1}>
                                    {wine.winery_name || 'Unknown brand'}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.StoriesTitleText} numberOfLines={2}>
                            {wine.brand_name ? `${wine.brand_name}` : wine.varietal_name}
                        </Text>
                        <View style={styles.StoriesDescriptionConatiner}>
                            <Text style={styles.StoriesDescription} numberOfLines={1}>
                                {wine.year}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        ) : (
            // Clickable wine details for valid wine_id
            <TouchableOpacity
                key={index}
                style={styles.ListOfStoriesContainer}
                onPress={() => navigation.navigate("WineDetails", {
                    winery_id: wine.winery_id,
                    winery_varietals_id: wine.varietal_id,
                    wine_id: wine.wines_id
                })}
            >
                <View style={styles.Stories}>
                    <View style={styles.StoriesImgContainer}>
                        <Image source={{ uri: imagePrefix + wine.image }} style={styles.StoriesImage} />
                    </View>
                    <View style={styles.StoriesText}>
                        <View style={styles.StoriesTitle}>
                            <View style={styles.StoriesTitleTextContainer}>
                                <Text style={styles.StoriesSubtitle} numberOfLines={1}>
                                    {wine.winery_name || 'Unknown Winery'}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.StoriesTitleText} numberOfLines={2}>
                            {wine.brand_name ? `${wine.brand_name}, ${wine.varietal_name}` : wine.varietal_name}
                        </Text>
                        <View style={styles.StoriesDescriptionConatiner}>
                            <Text style={styles.StoriesDescription} numberOfLines={1}>
                                {wine.year}
                            </Text>
                            <Text style={styles.StoriesDescription} numberOfLines={1}>
                                bottleshock<Text style={styles.boldText}> {wine.bottleshock_rating}</Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    })
) : (
    <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>{t('Nodataavailable')}</Text>
    </View>
)}

    </View>
  );
};

export default DiscoverWines;
