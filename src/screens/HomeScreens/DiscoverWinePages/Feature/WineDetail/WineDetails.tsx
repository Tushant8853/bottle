import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './index.style';
import { useRoute, RouteProp } from "@react-navigation/native";
import { supabase } from "../../../../../../backend/supabase/supabaseClient";
import Markdown from 'react-native-markdown-display';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../TabNavigation/navigationTypes";
import Scanner from '../../../../../assets/png/Scanner.png';
type WineDetailsRouteProp = RouteProp<{
  params: {
    winery_id: number;
    winery_varietals_id: number;
    wine_id: number;
  };
}, 'params'>;

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
  jp_winery_name: string,
  jp_name: string,
  jp_vintage_name: string,
};

const WineDetails: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<WineDetailsRouteProp>();
  const { winery_id, winery_varietals_id, wine_id } = route.params;
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const [wines, setWines] = useState<Wine[]>([]);

  useEffect(() => {
    const fetchWines = async () => {
      try {
        const { data: bottleshock_wineries_Data, error: wineriesError } = await supabase
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
              const { data: varietalsData, error: varietalsError } = await supabase
                .from("bottleshock_winery_varietals")
                .select("varietal_name, brand_name, winery_varietals_id , jp_name")
                .eq("winery_id", winery.wineries_id)
                .eq("winery_varietals_id", winery_varietals_id);
              if (varietalsError) {
                console.error("Error fetching varietals:", varietalsError.message);
                return [];
              }
              const winesData = await Promise.all(
                (varietalsData || []).map(async (varietal) => {
                  const { data: wineDetails, error: wineError } = await supabase
                    .from("bottleshock_wines")
                    .select("year, image, wines_id, varietal_id, rp_rating, jd_rating, we_rating, ws_rating ,description , jp_vintage_name")
                    .eq("varietal_id", varietal.winery_varietals_id)
                    .eq("wines_id", wine_id);
                  if (wineError) {
                    console.error(`Error fetching wine details for varietal_id ${varietal.winery_varietals_id}:`, wineError.message);
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
        }
      } catch (error) {
        console.error("Error fetching wines data:", error);
      }
    };
    fetchWines();
  }, [winery_id, winery_varietals_id, wine_id, imagePrefix]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back Arrow */}
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.spacer} />
        {/* Attachment Icon */}
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="attach" size={24} color="black" />
        </TouchableOpacity>
        {/* Heart Icon */}
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="heart" size={24} color="red" />
        </TouchableOpacity>
        {/* Share Icon */}
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="share-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {wines.map((wine, index) => (
        <View style={styles.SubContainer} key={wine.wines_id}>
          <View style={styles.ImgContainer}>
            <Image
              source={{ uri: wine.image }}
              style={styles.image}
            />
          </View>
          <ScrollView>
            <View style={styles.ScrollViewContainer}>
              <View style={styles.detailsContainer}>
                <View style={styles.wineryNameContainer}>
                  <Text style={styles.wineryName}>{wine.winery_name}</Text>
                  <Text style={styles.wineryNameJapanese}>{wine.jp_winery_name}</Text>
                </View>
                <View style={styles.wineNameContainer}>
                  <Text style={styles.wineName} numberOfLines={2}>{wine.varietal_name}{wine.brand_name ? `, ${wine.brand_name}` : ""}</Text>
                  <Text style={styles.wineNameJapanese}>{wine.jp_vintage_name}</Text>
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
              <View style={styles.Box1Container}>
                <Text style={styles.bottomText}>このワインが飲めるお店</Text>
              </View >
              <View style={styles.Box1Container}>
                <Text style={styles.bottomText}>ワインを入手</Text>
              </View>
              <View style={styles.ScannerContainer}>
                <Image source={require('../../../../../assets/png/Scanner.png')} style={styles.imagescanner} />
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
    fontFamily: 'Hiragino Kaku Gothic Pro',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'left',
  },
  paragraph: {
    fontFamily: 'Hiragino Kaku Gothic Pro',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 24,
    textAlign: 'left',
  },
});