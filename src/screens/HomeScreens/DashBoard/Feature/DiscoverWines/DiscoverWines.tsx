import { View, Text, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './index.style';
import Bannericon from '../../../../../assets/svg/SvgCodeFile/bannericon';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../TabNavigation/navigationTypes";
import { supabase } from "../../../../../../backend/supabase/supabaseClient";

interface Wine {
    id: string;
    image: string;
    wines_name: string;
    year: number; // Assuming this is a number now
    winery_id: number;
    address?: string;
}

const DiscoverWines: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [wines, setWines] = useState<Wine[]>([]);
    const imagePrefix = "https://bottleshock.twic.pics/file/";

    useEffect(() => {
        const fetchWines = async () => {
            try {
                const { data: WinesData, error } = await supabase
                    .from("bottleshock_wines")
                    .select("id, image, wines_name, year, winery_id");

                if (error) {
                    console.error("Error fetching wines:", error.message);
                    return;
                }

                if (WinesData) {
                    const updatedWines = await Promise.all(
                        WinesData.map(async (wine) => {
                            const { data: wineryData, error: wineryError } = await supabase
                                .from("bottleshock_wineries")
                                .select("address")
                                .eq("id", wine.winery_id)
                                .single();

                            if (wineryError) {
                                console.error(`Error fetching address for winery_id ${wine.winery_id}:`, wineryError);
                            }

                            const wineWithAddress = {
                                ...wine,
                                address: wineryData?.address || "Address not available",
                            };
                            return wineWithAddress;
                        })
                    );

                    setWines(updatedWines);
                }
            } catch (err) {
                console.error("Error fetching wines:", err);
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
                    <View key={wine.id} style={styles.ListOfStoriesContainer}>
                        <View style={styles.Stories}>
                            <View style={styles.StoriesImgContainer}>
                                <Image 
                                    source={{ uri: `${imagePrefix}${wine.image}` }} 
                                    style={styles.StoriesImage} 
                                />
                            </View>
                            <View style={styles.StoriesText}>
                                <View style={styles.StoriesTitle}>
                                    <View style={styles.StoriesTitleTextContainer}>
                                        <Text style={styles.StoriesSubtitle} numberOfLines={1}>
                                            {wine.address}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.StoriesTitleText} numberOfLines={2}>
                                    {wine.wines_name || "Address not available dbj"}
                                </Text>
                                <View style={styles.StoriesDescriptionConatiner}>
                                    <Text style={styles.StoriesDescription} numberOfLines={1}>
                                        {new Date(wine.year).getFullYear()} {/* Display only the year */}
                                    </Text>
                                    <Text style={styles.StoriesDescription} numberOfLines={1}>
                                        bottleshock<Text style={styles.boldText}>100</Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

export default DiscoverWines;
