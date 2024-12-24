import { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Image,
    Animated,
    Pressable
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../TabNavigation/navigationTypes";
import Bannericon from "../../../assets/svg/SvgCodeFile/bannericon";
import { supabase } from "../../../../backend/supabase/supabaseClient";
import styles from './index.style';
import { useTranslation } from 'react-i18next';


interface Wine {
    image: string;
    year: number;
    brand_name: string;
    varietal_name: string;
    winery_name: string;
    bottleshock_rating: number;
    winery_id: number; // Ensure winery_id is included here
    wines_id: number;
}

const WineSkeletonLoader = () => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = () => {
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
            ]).start(() => animate());
        };

        animate();
        return () => animatedValue.stopAnimation();
    }, []);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <View style={styles.ListOfStoriesContainer}>
            <View style={styles.Stories}>
                <Animated.View style={[
                    styles.StoriesImgContainer,
                    { opacity, backgroundColor: '#E1E9EE' }
                ]} />
                <View style={styles.StoriesText}>
                    <View style={styles.StoriesTitle}>
                        <View style={styles.StoriesTitleTextContainer}>
                            <Animated.View style={{
                                width: 100,
                                height: 12,
                                backgroundColor: '#E1E9EE',
                                borderRadius: 4,
                                opacity
                            }} />
                        </View>
                    </View>
                    <Animated.View style={{
                        width: 200,
                        height: 14,
                        backgroundColor: '#E1E9EE',
                        borderRadius: 4,
                        marginTop: 6,
                        opacity
                    }} />
                    <View style={styles.StoriesDescriptionConatiner}>
                        <Animated.View style={{
                            width: 60,
                            height: 12,
                            backgroundColor: '#E1E9EE',
                            borderRadius: 4,
                            opacity
                        }} />
                        <Animated.View style={{
                            width: 80,
                            height: 12,
                            backgroundColor: '#E1E9EE',
                            borderRadius: 4,
                            opacity
                        }} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const DiscoverWinespages: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [searchText, setSearchText] = useState('');
    const [wines, setWines] = useState<Wine[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const imagePrefix = "https://bottleshock.twic.pics/file/";
    const { t } = useTranslation();
    const [showComingSoon, setShowComingSoon] = useState(false);

    useEffect(() => {
        const fetchWines = async () => {
            try {
                setIsLoading(true);
                const { data: bottleshock_wineries_Data, error: wineriesError } = await supabase
                    .from("bottleshock_wineries")
                    .select("wineries_id, winery_name");

                if (wineriesError) {
                    console.error("🚨 Error fetching wineries:", wineriesError.message);
                    return;
                }

                if (bottleshock_wineries_Data) {
                    const bottleshock_winery_varietals_Details = await Promise.all(
                        bottleshock_wineries_Data.map(async (winery) => {
                            const { data: varietalsData, error: varietalsError } = await supabase
                                .from("bottleshock_winery_varietals")
                                .select("varietal_name, brand_name, winery_varietals_id")
                                .eq("winery_id", winery.wineries_id)
                                .limit(1);

                            if (varietalsError) {
                                return [];
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
                                        return [];
                                    }

                                    return (wineDetails || []).map((wine) => ({
                                        ...wine,
                                        year: wine.year.slice(0, 4),
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
                    );

                    setWines(bottleshock_winery_varietals_Details.flat());
                }

            } finally {
                setIsLoading(false);
            }
        };
        fetchWines();
    }, []);

    return (
        <View style={styles.container}>

            <View style={styles.searchContainer}>
                <FontAwesome name="search" size={16} color="#989999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={t('search')}
                    placeholderTextColor={"#e5e8e8"}
                    onFocus={() => setShowComingSoon(true)} // Show "Coming soon" message on focus
                    onBlur={() => setShowComingSoon(false)} // Hide the message when focus is lost
                />
                {showComingSoon && (
                    <View style={styles.comingSoonContainer}>
                        <Text style={styles.comingSoonText}>{t('comingsoon')}</Text>
                    </View>
                )}
                <FontAwesome name="microphone" size={16} color="#989999" />
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {isLoading ? (
                    <>
                        <WineSkeletonLoader />
                        <WineSkeletonLoader />
                        <WineSkeletonLoader />
                        <WineSkeletonLoader />
                    </>
                ) : (
                    wines.map((wine, index) => (
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
            <View style={styles.bottom}></View>
        </View>
    );
}

export default DiscoverWinespages;
