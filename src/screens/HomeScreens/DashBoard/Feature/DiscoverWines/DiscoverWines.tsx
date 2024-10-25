import { View, Text, Image } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './index.style'; // Importing styles from index.style.ts
import Bannericon from '../../../../../assets/svg/SvgCodeFile/bannericon';
// You can define props if needed. Currently, no props are defined for this component.
interface DiscoverWinesProps {}

const DiscoverWines: React.FC<DiscoverWinesProps> = () => {
    return (
        <View>
            <View style={styles.container}>
                <View style={styles.TitleContainer}>
                    <View style={styles.leftContainer}>
                    <Bannericon width={13} height={32} color="#522F60"/>
                    <Text style={styles.text}>discover wines</Text>
                    </View>
                    <Icon name="chevron-right" size={16} color="#522F60" />
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
                                    Samantha's Sauvignon Blanc, Alexander Valley
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
