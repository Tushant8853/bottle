import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import DiscoverWines from "./Feature/WineEnjoyed";

const HeaderImg = require("../../../../assets/png/HeaderIcon.png");

const MemoriesDetails: React.FC = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={HeaderImg} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Heading</Text>
                    <Text style={styles.subtext}>Subheading</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="attach" size={24} style={styles.rotatedIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="heart-outline" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="share-outline" size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.descriptionContainer}>
                <View style={styles.descriptionIconsContainer}>
                    <Feather
                        style={styles.descriptionIcons}
                        name="file-text"
                        size={16}
                        color="#522F60"
                    />
                </View>
                <View style={styles.descriptionTextContainer}>
                    <Text style={styles.descriptionText} numberOfLines={5}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                        pulvinar lobortis dui, id iaculis est consectetur id. Donec viverra,
                        arcu condimentum consectetur, libero nunc condimentum nunc, id
                        pulvinar nisi purus in velit.
                    </Text>
                </View>
            </View>

            <View style={styles.datecontainer}>
                <View style={styles.descriptionIconsContainer}>
                    <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#522F60"
                        style={styles.icon}
                    />
                </View>
                <View style={styles.DateTextContainer}>
                    <Text style={styles.dateText}>07/04/2024</Text>
                </View>
            </View>

            <View style={styles.picandvideoContainer}>
                <View style={styles.picandvideoHeaderContainer}>
                    <View style={styles.leftContent}>
                        <FontAwesome
                            style={styles.picandvideoIcons}
                            name="image"
                            size={16}
                            color="#522F60"
                        />
                        <Text style={styles.picandvideoHeadertext}> pic and videos</Text>
                    </View>
                    <View style={styles.rightContent}>
                        <AntDesign
                            style={styles.picandvideoArrowIcons}
                            name="arrowright"
                            size={20}
                            color="#522F60"
                        />
                    </View>
                </View>
                <View style={styles.picandvideoMainContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false} // This hides the scrollbar
                        contentContainerStyle={styles.picandvideo}
                    >
                        <Image source={HeaderImg} style={styles.picandvideoImage} />
                        <Image source={HeaderImg} style={styles.picandvideoImage} />
                        <Image source={HeaderImg} style={styles.picandvideoImage} />
                        <Image source={HeaderImg} style={styles.picandvideoImage} />
                        <Image source={HeaderImg} style={styles.picandvideoImage} />
                    </ScrollView>
                </View>
            </View>

            <View style={styles.MapContainer}>
                <View style={styles.MapContainerHeader}>
                    <View style={styles.locationHeaderContainer}>
                        <View style={styles.oneContent}>
                            <View style={styles.descriptionIconsContainer}>
                                <Ionicons
                                    name="pin"
                                    size={16}
                                    color="#522F60"
                                    style={styles.Mapicon}
                                />
                            </View>
                            <View style={styles.locationTextContainer}>
                                <Text style={styles.locationHeadertext}>Lucknow</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.actionHeaderContainer}>
                        <View style={styles.twoContent}>
                            <Ionicons name="attach" size={14} style={styles.rotatedIcon} />
                        </View>
                        <View style={styles.threeContent}>
                            <Ionicons name="heart-outline" size={14} />
                        </View>
                        <View style={styles.fourContent}>
                            <Ionicons name="share-outline" size={14} />
                        </View>
                    </View>

                </View>

                <View style={styles.mapSDKContainer}>
                    <Text>Map </Text>
                </View>
            </View>

            <DiscoverWines />
            <View style={styles.bottom}></View>
        </ScrollView>
    );
};

export default MemoriesDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    bottom: {
        marginBottom: 200,
    },
    imageContainer: {
        position: "relative",
    },
    image: {
        height: 320,
        width: "100%",
        resizeMode: "cover",
        justifyContent: "flex-end",
    },
    buttonContainer: {
        position: "absolute",
        top: 25,
        right: 15,
        flexDirection: "row",
        gap: 10,
    },
    button: {
        backgroundColor: "white",
        borderRadius: 5,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
    },
    rotatedIcon: {
        transform: [{ rotate: "45deg" }],
    },
    text: {
        color: "white",
        fontSize: 32,
        fontWeight: "600",
        position: "absolute",
        bottom: 25,
        left: 16,
    },
    subtext: {
        color: "white",
        fontSize: 16,
        fontWeight: "400",
        position: "absolute",
        bottom: 10,
        left: 16,
    },
    textContainer: {},
    //////////////////////////////////////////descriptionContainer//////////////////////
    descriptionContainer: {
        borderWidth: 1,
        marginHorizontal: 16,
        height: 110,
        marginTop: 8,
        borderRadius: 4,
        borderColor: "#522F6080",
        flexDirection: "row",
    },
    descriptionIconsContainer: {
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        borderBottomWidth: 1,
        height: 30,
        width: 32,
        borderColor: "#522F6080",
    },
    descriptionTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    descriptionText: {
        fontFamily: "Hiragino Sans",
        fontSize: 14,
        fontWeight: "300",
        lineHeight: 21,
        textAlign: "left",
    },
    descriptionIcons: {},
    //////////////////////////////////////////Date and Time //////////////////////////////////////////
    datecontainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: "#522F6080",
        marginTop: 4,
        height: 30,
        borderRadius: 4,
    },
    DateTextContainer: {
        marginLeft: 10,
    },
    dateText: {
        fontFamily: "SF Pro",
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 19.09,
        textAlign: "left",
        color: "#522F60",
    },
    //////////////////////////////////////////Pic and Video //////////////////////////////////////////
    picandvideoContainer: {
        marginTop: 8,
        borderRadius: 4,
        borderColor: "#522F6080",
        height: 146,
    },
    picandvideoHeaderContainer: {
        height: 22,
        marginHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    picandvideoHeadertext: {
        fontFamily: "Hiragino Sans",
        fontSize: 13,
        fontWeight: "600",
        lineHeight: 22,
        letterSpacing: 0.02,
        color: "#522F60",
    },
    picandvideoMainContainer: {
        marginTop: 4,
        marginLeft: 16,
    },
    picandvideo: {
        flexDirection: "row",
    },
    picandvideoImage: {
        width: 100,
        height: 100,
        marginHorizontal: 1,
    },
    picandvideoIcons: {},
    rightContent: {},
    picandvideoArrowIcons: {},
    icon: {},
    ///////////////////////////////////// Map ///////////////////////////////////////////
    MapContainer: {},
    MapContainerHeader: {
        marginHorizontal: 16,
        height: 30,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    actionHeaderContainer: {
        flexDirection: "row",
    },
    locationHeaderContainer: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#522F6080",
        flexDirection: "row",
        flex: 1
    },
    oneContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    locationTextContainer: {
        marginLeft: 10,
    },
    locationHeadertext: {
        fontFamily: "SF Pro",
        fontSize: 16,
        fontWeight: "400",
        color: "#522F60",
    },
    twoContent: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        borderColor: "#522F6080",
        height: 30,
        width: 30,
        borderWidth: 1,
    },
    threeContent: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        borderColor: "#522F6080",
        height: 30,
        width: 30,
        borderWidth: 1,
    },
    fourContent: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        borderColor: "#522F6080",
        height: 30,
        width: 30,
        borderWidth: 1,
    },
    Mapicon: {},
    ////////////////////////////////
    mapSDKContainer: {
        marginHorizontal: 16,
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#522F6080",
        borderRadius: 4,
    },
});
