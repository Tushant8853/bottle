import { View, Text, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './index.style';
import Bannericon from '../../../../../assets/svg/SvgCodeFile/bannericon';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../TabNavigation/navigationTypes";
import { supabase } from "../../../../../../backend/supabase/supabaseClient";

interface Wine {
    image: string;
    year: number; // Consider keeping year as a number
    brand_name: string;
    varietal_name: string;
    winery_name: string;
    bottleshock_rating: number;
    wines_id: number;
    winery_id: number;
}

const DiscoverWines: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [wines, setWines] = useState<Wine[]>([]);
    const imagePrefix = "https://bottleshock.twic.pics/file/";

    useEffect(() => {
        const fetchWines = async () => {
            try {
                const { data: bottleshock_wineries_Data, error: wineriesError } = await supabase
                    .from("bottleshock_wineries")
                    .select("wineries_id, winery_name");

                if (wineriesError) {
                    console.error("🚨 Error fetching wineries:", wineriesError.message);
                    return;
                }

                if (bottleshock_wineries_Data) {
                    // Declare as a flat array of Wine
                    const bottleshock_winery_varietals_Details: Wine[] = await Promise.all(
                        bottleshock_wineries_Data.map(async (winery) => {
                            const { data: varietalsData, error: varietalsError } = await supabase
                                .from("bottleshock_winery_varietals")
                                .select("varietal_name, brand_name, winery_varietals_id")
                                .eq("winery_id", winery.wineries_id)
                                .limit(1);

                            if (varietalsError) {
                                return []; // Return an empty array for this winery if there's an error
                            }

                            const winesData = await Promise.all(
                                (varietalsData || []).map(async (varietal) => {
                                    const { data: wineDetails, error: wineError } = await supabase
                                        .from("bottleshock_wines")
                                        .select("year, image, wines_id, varietal_id, bottleshock_rating")
                                        .eq("varietal_id", varietal.winery_varietals_id)
                                        .limit(1);

                                    if (wineError) {
                                        console.error(`🚨 Error fetching wine details for varietal_id ${varietal.winery_varietals_id}:`, wineError.message);
                                        return []; // Return an empty array for this varietal if there's an error
                                    }

                                    return (wineDetails || []).map((wine) => ({
                                        ...wine,
                                        year: parseInt(wine.year.slice(0, 4), 10), // Convert year to a number
                                        image: `${imagePrefix}${wine.image}`,
                                        winery_name: winery.winery_name,
                                        varietal_name: varietal.varietal_name,
                                        brand_name: varietal.brand_name,
                                        winery_id: winery.wineries_id,
                                    }));
                                })
                            );

                            return winesData.flat(); // Return an array of wines for this winery
                        })
                    ).then(data => data.flat()); // Flatten the final array to get a single array of Wine

                    setWines(bottleshock_winery_varietals_Details);
                }
            } catch (error) {
                console.error("🚨 An unexpected error occurred:", error);
            }
        };
        fetchWines();
    }, []);

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.TitleContainer}>
                    <View style={styles.leftContainer}>
                        <Bannericon width={13} height={32} color="#522F60" />
                        <Text style={styles.text}>discover wines</Text>
                    </View>
                    <Pressable onPress={() => navigation.navigate('DiscoverWinespages')}>
                        <Icon name="chevron-right" size={16} color="#522F60" />
                    </Pressable>
                </View>

                {wines.slice(0, 4).map((wine) => (
                    <Pressable
                        key={wine.wines_id} // Use the unique identifier as key
                        onPress={() => navigation.navigate("WineListVarietal", { winery_id: wine.winery_id })}
                    >
                        <View style={styles.ListOfStoriesContainer}>
                            <View style={styles.Stories}>
                                <View style={styles.StoriesImgContainer}>
                                    <Image
                                        source={{ uri: wine.image }}
                                        style={styles.StoriesImage}
                                    />
                                </View>
                                <View style={styles.StoriesText}>
                                    <View style={styles.StoriesTitle}>
                                        <View style={styles.StoriesTitleTextContainer}>
                                            <Text style={styles.StoriesSubtitle} numberOfLines={1}>
                                                {wine.winery_name}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.StoriesTitleText} numberOfLines={2}>
                                        {wine.varietal_name}{wine.brand_name ? `, ${wine.brand_name}` : ""}
                                    </Text>
                                    <View style={styles.StoriesDescriptionConatiner}>
                                        <Text style={styles.StoriesDescription} numberOfLines={1}>
                                            {wine.year}
                                        </Text>
                                        <Text style={styles.StoriesDescription} numberOfLines={1}>
                                            bottleshock<Text style={styles.boldText}>{wine.bottleshock_rating}</Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

export default DiscoverWines;
