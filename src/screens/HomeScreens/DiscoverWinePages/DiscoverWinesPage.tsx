import { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Image,
    Animated
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../TabNavigation/navigationTypes";
import Bannericon from "../../../assets/svg/SvgCodeFile/bannericon";
import { supabase } from "../../../../backend/supabase/supabaseClient";
import styles from './index.style';

interface Wine {
    id: string;
    image: string;
    wines_name: string;
    year: number;
    winery_id: number;
    address?: string;
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

    useEffect(() => {
        const fetchWines = async () => {
            try {
                setIsLoading(true);
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

                            return {
                                ...wine,
                                address: wineryData?.address || "Address not available",
                            };
                        })
                    );

                    setWines(updatedWines);
                }
            } catch (err) {
                console.error("Error fetching wines:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWines();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headingContainer}>
                    <Bannericon width={13} height={22} color="#30425F" />
                    <View style={styles.bannerTextContainer}>
                        <Text style={styles.bannerTitle}>discover wines</Text>
                    </View>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <FontAwesome name="search" size={16} color="#989999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor={"#e5e8e8"}
                    value={searchText}
                    onChangeText={setSearchText}
                />
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
                    wines.map((wine) => (
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
                                        {wine.wines_name || "Address not available"}
                                    </Text>
                                    <View style={styles.StoriesDescriptionConatiner}>
                                        <Text style={styles.StoriesDescription} numberOfLines={1}>
                                            {new Date(wine.year).getFullYear()}
                                        </Text>
                                        <Text style={styles.StoriesDescription} numberOfLines={1}>
                                            bottleshock<Text style={styles.boldText}>100</Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
            <View style={styles.bottom}></View>
        </View>
    );
}

export default DiscoverWinespages;