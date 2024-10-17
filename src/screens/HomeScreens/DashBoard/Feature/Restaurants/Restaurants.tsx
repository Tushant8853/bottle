import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';

// import RestaurantComponentImg1 from '../../../../../assets/png/RestaurantImg.png';
// import RestaurantComponentImg2 from '../../../../../assets/png/RestaurantImg2.png';
import styles from './index.style'; // Importing styles from index.style.js

const Restaurants: React.FC = () => {
    const [likedStatus, setLikedStatus] = useState<boolean[]>([false, false, false, false]); // Track if the item is saved or not

    const handleSavePress = (index: number): void => {
        const newStatus = [...likedStatus];
        newStatus[index] = !newStatus[index]; // Toggle the like status
        setLikedStatus(newStatus); // Toggle the state on button press
    };

    return (
        <View style={styles.container}>
            <View style={styles.TitleContainer}>
                <Icons
                    name='restaurant'
                    size={20}
                    color='#522F60'
                    //weight="bold"
                    //marginRight={2}
                />
                <Text style={styles.text}>Featured Restaurants</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.RowScrollcontainer}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.ComponentContainer}>
                    <View style={styles.imageWrapper}>
                        <Image source={require('../../../../../assets/png/RestaurantImg.png')} style={styles.component} />
                        <Pressable onPress={() => handleSavePress(0)} style={styles.saveButton}>
                            <Icon
                                name={likedStatus[0] ? "heart" : "heart-o"}
                                size={20}
                                color='#522F60'
                                //weight='bold'
                            />
                        </Pressable>
                    </View>
                    <Text style={styles.componentText}>TAMA</Text>
                </View>
                <View style={styles.ComponentContainer}>
                    <View style={styles.imageWrapper}>
                        <Image source={require('../../../../../assets/png/RestaurantImg2.png')} style={styles.component} />
                        <Pressable onPress={() => handleSavePress(1)} style={styles.saveButton}>
                            <Icon
                                name={likedStatus[1] ? "heart" : "heart-o"}
                                size={20}
                                color='#522F60'
                                //weight='bold'
                            />
                        </Pressable>
                    </View>
                    <Text style={styles.componentText}>炭火焼肉なかはら</Text>
                </View>
                <View style={styles.ComponentContainer}>
                    <View style={styles.imageWrapper}>
                        <Image source={require('../../../../../assets/png/RestaurantImg.png')} style={styles.component} />
                        <Pressable onPress={() => handleSavePress(2)} style={styles.saveButton}>
                            <Icon
                                name={likedStatus[2] ? "heart" : "heart-o"}
                                size={20}
                                color='#522F60'
                                //weight='bold'
                            />
                        </Pressable>
                    </View>
                    <Text style={styles.componentText}>Fall Harvest Party 2022</Text>
                </View>
                <View style={styles.ComponentContainer}>
                    <View style={styles.imageWrapper}>
                        <Image source={require('../../../../../assets/png/RestaurantImg2.png')} style={styles.component} />
                        <Pressable onPress={() => handleSavePress(3)} style={styles.saveButton}>
                            <Icon
                                name={likedStatus[3] ? "heart" : "heart-o"}
                                size={20}
                                color='#522F60'
                                //weight='bold'
                            />
                        </Pressable>
                    </View>
                    <Text style={styles.componentText}>Fall Harvest Party 2021</Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default Restaurants;
