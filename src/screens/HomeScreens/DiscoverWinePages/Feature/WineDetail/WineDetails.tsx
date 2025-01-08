import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./index.style";
import { useRoute, RouteProp } from "@react-navigation/native";
import { supabase } from "../../../../../../backend/supabase/supabaseClient";
import Markdown from "react-native-markdown-display";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../TabNavigation/navigationTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import WineDetailsSkeleton from "./WineDetailsSkeleton";
import { shareDeepLink } from "../../../../../utils/shareUtils";
import QRCode from "react-native-qrcode-svg";

type WineDetailsRouteProp = RouteProp<
  {
    params: {
      winery_id: number;
      winery_varietals_id: number;
      wine_id: number;
    };
  },
  "params"
>;

type Wine = {
  winery_name: string;
  brand_name: string;
  varietal_name: string;
  image: string;
  jd_rating: number;
  rp_rating: number;
  varietal_id: number;
  we_rating: number;
  wines_id: number;
  ws_rating: number;
  year: string;
  description: string;
  jp_winery_name: string;
  jp_name: string;
  jp_vintage_name: string;
};

const WineDetails: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<WineDetailsRouteProp>();
  const { winery_id, winery_varietals_id, wine_id } = route.params;
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const [wines, setWines] = useState<Wine[]>([]);
  const [savedStatus, setSavedStatus] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState(false);
  const { wine_id: wineId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const [showText, setShowText] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const handlePress = () => {
    setShowText(!showText);
  };
  const handlePress2 = () => {
    setShowText2(!showText2);
  };

  useEffect(() => {
    const fetchWines = async () => {
      setIsLoading(true);
      try {
        const { data: bottleshock_wineries_Data, error: wineriesError } =
          await supabase
            .from("bottleshock_wineries")
            .select("wineries_id, winery_name ,jp_winery_name")
            .eq("wineries_id", winery_id);
        if (wineriesError) {
          console.error("Error fetching wineries:", wineriesError.message);
          return;
        }
        if (bottleshock_wineries_Data) {
          const bottleshock_winery_varietals_Details = await Promise.all(
            bottleshock_wineries_Data.map(async (winery) => {
              const { data: varietalsData, error: varietalsError } =
                await supabase
                  .from("bottleshock_winery_varietals")
                  .select(
                    "varietal_name, brand_name, winery_varietals_id , jp_name"
                  )
                  .eq("winery_id", winery.wineries_id)
                  .eq("winery_varietals_id", winery_varietals_id);
              if (varietalsError) {
                console.error(
                  "Error fetching varietals:",
                  varietalsError.message
                );
                return [];
              }
              const winesData = await Promise.all(
                (varietalsData || []).map(async (varietal) => {
                  const { data: wineDetails, error: wineError } = await supabase
                    .from("bottleshock_wines")
                    .select(
                      "year, image, wines_id, varietal_id, rp_rating, jd_rating, we_rating, ws_rating ,description , jp_vintage_name"
                    )
                    .eq("varietal_id", varietal.winery_varietals_id)
                    .eq("wines_id", wine_id);
                  if (wineError) {
                    console.error(
                      `Error fetching wine details for varietal_id ${varietal.winery_varietals_id}:`,
                      wineError.message
                    );
                    return [];
                  }
                  return (wineDetails || []).map((wine) => ({
                    winery_name: winery.winery_name,
                    brand_name: varietal.brand_name,
                    varietal_name: varietal.varietal_name,
                    image: `${imagePrefix}${wine.image}`,
                    jd_rating: wine.jd_rating,
                    rp_rating: wine.rp_rating,
                    varietal_id: wine.varietal_id,
                    we_rating: wine.we_rating,
                    wines_id: wine.wines_id,
                    ws_rating: wine.ws_rating,
                    year: wine.year.slice(0, 4),
                    description: wine.description,
                    jp_winery_name: winery.jp_winery_name,
                    jp_name: varietal.jp_name,
                    jp_vintage_name: wine.jp_vintage_name,
                  }));
                })
              );
              return winesData.flat();
            })
          );
          setWines(bottleshock_winery_varietals_Details.flat());
          checkFavoriteStatus();
          checkSavedStatus();
        }
      } catch (error) {
        console.error("Error fetching wines data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const checkFavoriteStatus = async () => {
      try {
        const UID = await AsyncStorage.getItem("UID");
        if (!UID) return;

        const { data: favorites, error } = await supabase
          .from("bottleshock_fav_wines")
          .select("wine_id")
          .eq("user_id", UID)
          .eq("wine_id", wine_id);

        if (error) {
          console.error("Error fetching favorite status:", error.message);
          return;
        }

        setFavoriteStatus(favorites.length > 0);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    const checkSavedStatus = async () => {
      try {
        const UID = await AsyncStorage.getItem("UID");
        if (!UID) return;

        const { data: savedWines, error } = await supabase
          .from("bottleshock_saved_wines")
          .select("wine_id")
          .eq("user_id", UID)
          .eq("wine_id", wine_id);

        if (error) {
          console.error("Error fetching saved status:", error.message);
          return;
        }

        setSavedStatus(savedWines.length > 0);
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    fetchWines();
  }, [winery_id, winery_varietals_id, wine_id, imagePrefix]);

  const handleFavoritePress = async () => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) return;

      if (favoriteStatus) {
        const { error } = await supabase
          .from("bottleshock_fav_wines")
          .delete()
          .match({ user_id: UID, wine_id });

        if (error) {
          console.error("Error removing favorite wine:", error.message);
          return;
        }
      } else {
        const { error } = await supabase.from("bottleshock_fav_wines").insert([
          {
            user_id: UID,
            wine_id,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) {
          console.error("Error favoriting wine:", error.message);
          return;
        }
      }

      setFavoriteStatus(!favoriteStatus);
    } catch (error) {
      console.error("Error handling favorite press:", error);
    }
  };

  const handleSavePress = async () => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) return;

      if (savedStatus) {
        const { error } = await supabase
          .from("bottleshock_saved_wines")
          .delete()
          .match({ user_id: UID, wine_id });

        if (error) {
          console.error("Error removing saved wine:", error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from("bottleshock_saved_wines")
          .insert([
            {
              user_id: UID,
              wine_id,
              created_at: new Date().toISOString(),
            },
          ]);

        if (error) {
          console.error("Error saving wine:", error.message);
          return;
        }
      }

      setSavedStatus(!savedStatus);
    } catch (error) {
      console.error("Error handling save press:", error);
    }
  };
  if (isLoading) {
    return <WineDetailsSkeleton />;
  }
  const handleShare = async () => {
    const title = t("Wine_Details"); // Use translation for the title if applicable
    const message = t("Check_out_this_wine"); // Use translation for the message if applicable
    const route = `wine/${winery_id}/${winery_varietals_id}/${wine_id}`;

    await shareDeepLink(title, message, route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back Arrow */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.spacer} />
        {/* Attachment Icon */}
        <Pressable style={styles.iconContainer} onPress={handleSavePress}>
          <Ionicons
            name="attach"
            size={24}
            color={savedStatus ? "#522F60" : "gray"}
            style={styles.rotatedIcon}
          />
        </Pressable>
        <Pressable style={styles.iconContainer} onPress={handleFavoritePress}>
          <Ionicons
            name={favoriteStatus ? "heart" : "heart-outline"}
            size={24}
          />
        </Pressable>
        {/* Share Icon */}
        <TouchableOpacity style={styles.iconContainer} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {wines.map((wine, index) => (
        <View style={styles.SubContainer} key={wine.wines_id}>
          <View style={styles.ImgContainer}>
            <Image source={{ uri: wine.image }} style={styles.image} />
          </View>
          <ScrollView>
            <View style={styles.ScrollViewContainer}>
              <View style={styles.detailsContainer}>
                <View style={styles.wineryNameContainer}>
                  <Text style={styles.wineryName}>{wine.winery_name}</Text>
                  <Text style={styles.wineryNameJapanese}>
                    {wine.jp_winery_name}
                  </Text>
                </View>
                <View style={styles.wineNameContainer}>
                  <Text style={styles.wineName} numberOfLines={2}>
                    {wine.varietal_name}
                    {wine.brand_name ? `, ${wine.brand_name}` : ""}
                  </Text>
                  <Text style={styles.wineNameJapanese}>
                    {wine.jp_vintage_name}
                  </Text>
                </View>
                <View style={styles.vintageContainer}>
                  <Text style={styles.vintage}>{wine.year}</Text>
                  <Text style={styles.vintageJapanese}>{wine.jp_name}</Text>
                </View>
                <View style={styles.wineTypeConatiner}>
                  <Text style={styles.wineType}>{wine.varietal_name}</Text>
                </View>

                {/* Star Ratings */}
                <View style={styles.starsContainer}>
                  <Text style={styles.stars}>★★★★★</Text>
                </View>

                {/* Ratings */}
                <View style={styles.ratingsContainer}>
                  <View style={styles.ratingBox}>
                    <Text style={styles.ratingText}>RP{wine.rp_rating}</Text>
                  </View>
                  <View style={styles.ratingBox}>
                    <Text style={styles.ratingText}>JD{wine.jd_rating}</Text>
                  </View>
                  <View style={styles.ratingBox}>
                    <Text style={styles.ratingText}>WE{wine.we_rating}</Text>
                  </View>
                  <View style={styles.ratingBox}>
                    <Text style={styles.ratingText}>WS{wine.ws_rating}</Text>
                  </View>
                </View>
              </View>
            </View>
            {/* Discription */}
            <View style={styles.ScrollDiscriptionContainer}>
              <Markdown style={markdownStyles}>{wine.description}</Markdown>
            </View>
            {/* box and scanner */}
            <View style={styles.BoxAndScannerContainer}>
              <Pressable onPress={handlePress} style={styles.Box1Container}>
                <View>
                  {showText ? (
                    <Text style={styles.comingSoonText}>{t("comingsoon")}</Text>
                  ) : (
                    <Text style={styles.bottomText}>
                      {t("Restaurants_which_have_this_wine")}
                    </Text>
                  )}
                </View>
              </Pressable>
              <Pressable onPress={handlePress2} style={styles.Box1Container}>
                <View>
                  {showText2 ? (
                    <Text style={styles.comingSoonText}>{t("comingsoon")}</Text>
                  ) : (
                    <Text style={styles.bottomText}>{t("Buy_wine")}</Text>
                  )}
                </View>
              </Pressable>
              <View style={styles.ScannerContainer}>
                <QRCode
                  value={`https://www.bottleshock.wine/app/wine/${winery_id}/${winery_varietals_id}/${wine_id}`}
                  size={80} // Adjust the size as needed
                />
              </View>
            </View>
            <View style={styles.bottom}></View>
          </ScrollView>
        </View>
      ))}
    </View>
  );
};

export default WineDetails;

const markdownStyles = StyleSheet.create({
  heading: {
    fontFamily: "Hiragino Kaku Gothic Pro",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    textAlign: "left",
  },
  paragraph: {
    fontFamily: "Hiragino Kaku Gothic Pro",
    fontSize: 16,
    fontWeight: "300",
    lineHeight: 24,
    textAlign: "left",
  },
});
