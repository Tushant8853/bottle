import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './index.style';
import Bannericon from '../../../assets/svg/SvgCodeFile/bannericon';
import { Ionicons, Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../TabNavigation/navigationTypes";

const DiscoverWinespages: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [searchText, setSearchText] = useState('');
    return (
        <View>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <FontAwesome name="angle-left" size={20} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Winery</Text>
                </View>

                {/* Search Bar */}
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

                {Array.from({ length: 4 }).map((_, index) => (
                    <View key={index} style={styles.ListOfStoriesContainer}>
                        <View style={styles.Stories}>
                            <View style={styles.StoriesImgContainer}>
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

export default DiscoverWinespages;
