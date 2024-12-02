import { View, Text, Image, Pressable, StyleSheet, Animated, ScrollView } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Bannericon from '../../../../assets/svg/SvgCodeFile/bannericon';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../TabNavigation/navigationTypes";
import { supabase } from "../../../../../backend/supabase/supabaseClient";
import { useTranslation } from 'react-i18next';

interface Wine {
    image: string;
    year: number;
    brand_name: string;
    varietal_name: string;
    winery_name: string;
    bottleshock_rating: number;
    wines_id: number;
    winery_id: number;
}

const SkeletonPlaceholder: React.FC<{ width: number | string, height: number }> = ({ width, height }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => animation.stop();
    }, []);

    return (
        <Animated.View
            style={{
                width,
                height,
                backgroundColor: '#E1E1E1',
                opacity,
                borderRadius: 4,
            }}
        />
    );
};

const WineSkeletonItem: React.FC = () => (
    <View style={styles.ListOfStoriesContainer}>
        <View style={styles.Stories}>
            <View style={styles.StoriesImgContainer}>
                <SkeletonPlaceholder width="100%" height={72} />
            </View>
            <View style={styles.StoriesText}>
                <View style={styles.StoriesTitle}>
                    <View style={styles.StoriesTitleTextContainer}>
                        <SkeletonPlaceholder width={120} height={14} />
                    </View>
                </View>
                <View style={{ marginTop: 6 }}>
                    <SkeletonPlaceholder width={180} height={16} />
                </View>
                <View style={styles.StoriesDescriptionConatiner}>
                    <SkeletonPlaceholder width={40} height={12} />
                    <SkeletonPlaceholder width={80} height={12} />
                </View>
            </View>
        </View>
    </View>
);

const Savedwines: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [wines, setWines] = useState<Wine[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const imagePrefix = "https://bottleshock.twic.pics/file/";
    const { t } = useTranslation();


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
                    const bottleshock_winery_varietals_Details: Wine[] = await Promise.all(
                        bottleshock_wineries_Data.map(async (winery) => {
                            const { data: varietalsData, error: varietalsError } = await supabase
                                .from("bottleshock_winery_varietals")
                                .select("varietal_name, brand_name, winery_varietals_id")
                                .eq("winery_id", winery.wineries_id);
                        

                            if (varietalsError) {
                                return [];
                            }

                            const winesData = await Promise.all(
                                (varietalsData || []).map(async (varietal) => {
                                    const { data: wineDetails, error: wineError } = await supabase
                                        .from("bottleshock_wines")
                                        .select("year, image, wines_id, varietal_id, bottleshock_rating")
                                        .eq("varietal_id", varietal.winery_varietals_id);
                                     

                                    if (wineError) {
                                        console.error(`🚨 Error fetching wine details for varietal_id ${varietal.winery_varietals_id}:`, wineError.message);
                                        return [];
                                    }

                                    return (wineDetails || []).map((wine) => ({
                                        ...wine,
                                        year: parseInt(wine.year.slice(0, 4), 10),
                                        image: `${imagePrefix}${wine.image}`,
                                        winery_name: winery.winery_name,
                                        varietal_name: varietal.varietal_name,
                                        brand_name: varietal.brand_name,
                                        winery_id: winery.wineries_id,
                                    }));
                                })
                            );

                            return winesData.flat();
                        })
                    ).then(data => data.flat());

                    setWines(bottleshock_winery_varietals_Details);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("🚨 An unexpected error occurred:", error);
                setIsLoading(false);
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
                        <Text style={styles.text}>{t('discoverwines')}</Text>
                    </View>
                    <Pressable onPress={() => navigation.navigate('DiscoverWinespages')}>
                        <Icon name="chevron-right" size={16} color="#522F60" />
                    </Pressable>
                </View>
                <ScrollView>
                {isLoading ? (
                    <>
                        <WineSkeletonItem />
                        <WineSkeletonItem />
                        <WineSkeletonItem />
                        <WineSkeletonItem />
                    </>
                ) : (
                    wines.map((wine) => (
                        <Pressable
                            key={wine.wines_id}
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
                    ))
                )}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        width: '100%',
        marginBottom: 5,
        padding: 10,
        paddingBottom: 3,
    },
    TitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    MemoriesImg: {
        width: 13,
        height: 32,
        borderRadius: 1,
        resizeMode: 'contain',
        marginRight: 4,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#522F60',
        marginBottom: 2,
        marginLeft: 6
    },
    ListOfStoriesContainer: {
        marginTop: 6,
        backgroundColor: '#522F600D',
        height: 88,
        borderRadius: 5,
    },
    Stories: {
        flexDirection: 'row',
        padding: 4,
    },
    StoriesImgContainer: {
        backgroundColor: 'white',
        height: 80,
        width: 80,
        alignContent: 'center',
        borderColor: '#522F6080',
        borderWidth: 1,
        marginRight: 16,
        borderRadius: 8,
        justifyContent: 'center',
        overflow: 'hidden',  // Added to ensure skeleton animation stays within bounds
    },
    StoriesImage: {
        borderRadius: 10,
        width: '100%',
        height: '90%',
        resizeMode: 'contain',
    },
    StoriesText: {
        flex: 1,
        height: 68,
        justifyContent: 'center',
    },
    StoriesTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    StoriesTitleText: {
        fontSize: 14,
        color: '#66605E',
        fontFamily: 'SF Pro',
        fontWeight: '700',
        marginTop: 6
    },
    StoriesSubtitle: {
        fontSize: 12,
        color: '#1F2626',
        fontFamily: 'SF Pro',
        fontWeight: '400',
    },
    StoriesDescription: {
        fontSize: 12,
        color: 'black',
        fontFamily: 'SF Pro',
        fontWeight: '400',
    },
    StoriesTitleIMG: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    StoriesDescriptionConatiner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    boldText: {
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 22,
        textAlign: 'right',
        color: '#834B99',
    },
    StoriesTitleTextContainer: {
        flex: 1,
    },
    
});

export default Savedwines;