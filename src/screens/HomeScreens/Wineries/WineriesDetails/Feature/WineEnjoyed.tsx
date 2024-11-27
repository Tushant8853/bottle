import { View, Text, Image } from 'react-native';
import React , { useEffect , useState } from 'react';
import MymemoriesImg from '../../../../../assets/png/MymemoriesIcon.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import DicoverWineImg from '../../../../../assets/png/Wine.png';
import styles from './index.style'; // Importing styles from index.style.ts
import AntDesign from "react-native-vector-icons/AntDesign";
import { useRoute, RouteProp } from "@react-navigation/native";
import { supabase } from "../../../../../../backend/supabase/supabaseClient";


interface DiscoverWinesProps {}
interface Wine {
    winery_id: number;
    image: string;
    year: number;
    brand_name: string;
    varietal_name: string;
    winery_name: string;
    bottleshock_rating: number;
    winery_varietals_id: number;
}
const DiscoverWines: React.FC<DiscoverWinesProps> = () => {
    const route = useRoute<RouteProp<{ params: { id: string } }, 'params'>>();
    const { id } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const imagePrefix = "https://bottleshock.twic.pics/file/";
    const [wines, setWines] = useState<Wine[]>([]);
    console.log(id)
    
    useEffect(() => {
        const fetchWines = async () => {
            try {
                setIsLoading(true);
                console.log("Fetching wineries...");
                const { data: bottleshock_wineries_Data, error: wineriesError } = await supabase
                    .from("bottleshock_wineries")
                    .select("wineries_id, winery_name")
                    .eq("wineries_id", id);
    
                if (wineriesError) {
                    console.error("Error fetching wineries:", wineriesError.message);
                    return;
                }
    
                console.log("Wineries Data:", bottleshock_wineries_Data);
    
                const bottleshock_winery_varietals_Details = await Promise.all(
                    bottleshock_wineries_Data.map(async (winery) => {
                        console.log("Fetching varietals for winery:", winery);
                        const { data: varietalsData, error: varietalsError } = await supabase
                            .from("bottleshock_winery_varietals")
                            .select("varietal_name, brand_name, winery_varietals_id")
                            .eq("winery_id", winery.wineries_id);
    
                        if (varietalsError) {
                            console.error("Error fetching varietals:", varietalsError.message);
                            return [];
                        }
    
                        console.log("Varietals Data for Winery:", varietalsData);
    
                        const winesData = await Promise.all(
                            (varietalsData || []).map(async (varietal) => {
                                console.log("Fetching wines for varietal:", varietal);
                                const { data: wineDetails, error: wineError } = await supabase
                                    .from("bottleshock_wines")
                                    .select("year, image, wines_id, varietal_id, bottleshock_rating")
                                    .eq("varietal_id", varietal.winery_varietals_id)
                                    .limit(1);
    
                                if (wineError) {
                                    console.error(
                                        `Error fetching wine details for varietal_id ${varietal.winery_varietals_id}:`,
                                        wineError.message
                                    );
                                    return [];
                                }
    
                                console.log("Wine Details for Varietal:", wineDetails);
    
                                return (wineDetails || []).map((wine) => ({
                                    ...wine,
                                    year: wine.year.slice(0, 4), // Extract only the year
                                    image: `${imagePrefix}${wine.image}`,
                                    winery_name: winery.winery_name,
                                    varietal_name: varietal.varietal_name,
                                    brand_name: varietal.brand_name,
                                    winery_id: winery.wineries_id,
                                    winery_varietals_id: varietal.winery_varietals_id
                                }));
                            })
                        );
    
                        console.log("Wines Data for Winery:", winesData.flat());
                        return winesData.flat();
                    })
                );
    
                console.log("Final Wines Data:", bottleshock_winery_varietals_Details.flat());
            } catch (error) {
                console.error("Error fetching wines:", error);
            } finally {
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
                        <Image source={require('../../../../../assets/png/MymemoriesIcon.png')} style={styles.MemoriesImg} />
                        <Text style={styles.text}>wines enjoyed</Text>
                    </View>
                    <AntDesign
                            name="arrowright"
                            size={20}
                            color="#522F60"
                        />
                </View>

                {/* Repeating stories for demonstration. You might want to use an array to map through */}
                {Array(4).fill(null).map((_, index) => (
                    <View key={index} style={styles.ListOfStoriesContainer}>
                        <View style={styles.Stories}>
                            <View style={styles.StoriesImgContainer}>
                                <Image source={require('../../../../../assets/png/Wine.png')} style={styles.StoriesImage} />
                            </View>
                            <View style={styles.StoriesText}>
                                <View style={styles.StoriesTitle}>
                                    <View style={styles.StoriesTitleTextContainer}>
                                        <Text style={styles.StoriesSubtitle} numberOfLines={1}>
                                            Lancaster Estate
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.StoriesTitleText} numberOfLines={2}>
                                    Samantha’s Sauvignon Blanc, Alexander Valley
                                </Text>
                                <View style={styles.StoriesDescriptionConatiner}>
                                    <Text style={styles.StoriesDescription} numberOfLines={1}>
                                        2024
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
