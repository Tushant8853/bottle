import React from 'react';
import { View, Text, ImageBackground, ScrollView, StyleSheet, Image } from 'react-native';
import HeaderImg from '../../../assets/png/HeaderIcon.png';
import Gallery from '../../../assets/png/galleryImg.png';
import Love from '../../../assets/png/LoveImg.png';
import Export from '../../../assets/png/Exportmg.png';

const StoriesDetail = () => {
    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.DashBoardContainer}>
                <View style={styles.HeaderImgContainer}>
                    <ImageBackground source={HeaderImg} resizeMode="cover" style={styles.image}>
                        <View style={styles.TopRightCorner}>
                            <Image source={Gallery} style={styles.StoriesImage} />
                            <Image source={Love} style={styles.StoriesImage} />
                            <Image source={Export} style={styles.StoriesImage} />
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.StoriesTitleContainer}>
                    <Text style={styles.historyTitle}>History</Text>
                </View>
                <View style={styles.StoriesContainer}>
                    <Text style={styles.storiesDescription}>
                        History Hertelendy wines represent our Old World family tradition over many centuries, from 18th-century Veltlínske zelené (Grüner Veltliner) and Rizling vlašský (Welschriesling) vineyards near Budatin Castle in Slovakia to Hungarian wines produced by our ancestral Great Uncle Gábor Hertelendy (below). He created two varietals in his basalt-mountain vineyards overlooking Lake Balaton: Szürkebarát (better known as Pinot Gris) and Kéknyelű (a rare Hungarian white wine grape only found in the Badacsony wine region). Unlike the majority of common grape varieties used in viticulture, Kéknyelű cannot self-pollinate. Kéknyelű is rare today because it requires both male and female specimens for pollination, so it occupies double the space to reap half the yield.
                    </Text>
                </View>
                <View style={styles.bottoms}></View>
            </View>
        </ScrollView>
    );
};

export default StoriesDetail;

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
    },
    DashBoardContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    HeaderImgContainer: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    TopRightCorner: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'row',
    },
    StoriesImage: {
        width: 35,
        height: 35, // Set a fixed size for each image
        marginLeft: 5, // Space between the images
    },
    StoriesTitleContainer: {
        paddingHorizontal: 20,
        marginTop: 0,
    },
    historyTitle: {
        fontSize: 24,
        fontWeight: 'bold', // Make "History" text bold
        color: 'black',
    },
    StoriesContainer: {
        paddingHorizontal: 20,
        marginTop: 5,
    },
    storiesDescription: {
        fontSize: 16,
        color: 'black',
        lineHeight: 24, // Adds some spacing between lines for readability
    },
    bottoms: {
        // Additional content can be added here
    },
});
