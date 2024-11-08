import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Octicons from "react-native-vector-icons/Octicons";
const ShareWithFriends: React.FC = () => {
    const totalStars = 5; // Total number of stars
    const filledStars = 4; // Number of filled stars (for 4.5 rating, for example)

    return (
        <View style={styles.Container}>
            {/* Share to Friends Section */}
            <View style={styles.ShareContainer}>
                <View style={styles.ShareWithFriendsContainer}>
                    <View style={styles.IconWrapper}>
                        <Ionicons name="share-outline" size={16} style={styles.ShareIcon} />
                    </View>
                    <Text style={styles.ShareWithFriendsText}>Shared to Friends</Text>
                    <View style={styles.IconWrapper}>
                        <Feather name="chevron-down" size={16} style={styles.ArrowIcon} />
                    </View>
                </View>
            </View>

            {/* User Information Section */}
            <View style={styles.UserInfoContainer}>
                <View style={styles.UserInfoContent}>
                    <View style={styles.UserIconContainer}>
                        <MaterialIcons
                            name="supervisor-account"
                            size={17}
                            color="#522F60"
                        />
                    </View>
                    <View style={styles.UserLocationTextContainer}>
                        <Text style={styles.locationHeaderText}>
                            @Jay  <AntDesign
                                name="checkcircle"
                                size={14}
                                color="#522F60"
                                style={styles.CheckCircleIcon}
                            />
                        </Text>
                    </View>
                </View>
            </View>

            {/* Hashtags Section */}
            <View style={styles.HashtagContainer}>
                <View style={styles.HashtagContent}>
                    <View style={styles.HashtagIconContainer}>
                        <Feather
                            name="tag"
                            size={17}
                            color="#522F60"
                            style={{ transform: [{ rotate: '90deg' }] }}
                        />
                    </View>
                    <View style={styles.HashtagTextContainer}>
                        <Text style={styles.HashtagText} numberOfLines={1}>
                            # tushant # gupta # hello
                        </Text>
                    </View>
                </View>
            </View>

            {/* Rating Section with 5 Stars in the Same Row */}
            <View style={styles.StartLikeCommentContainer}>
                {/* Rating */}
                <View style={styles.RatingContainer}>
                    <View style={styles.StartContent}>
                        <View style={styles.StarIconContainer}>
                            <FontAwesome
                                name="star"
                                size={16}
                                color="#522F60" // Outline color for stars
                            />
                        </View>
                        <View style={styles.RatingContent}>
                            {Array(filledStars)
                                .fill(null)
                                .map((_, index) => (
                                    <FontAwesome
                                        key={`filled-${index}`}
                                        name="star"
                                        size={16}
                                        color="#522F60"
                                    />
                                ))}
                            {Array(totalStars - filledStars)
                                .fill(null)
                                .map((_, index) => (
                                    <FontAwesome
                                        key={`empty-${index}`}
                                        name="star-o"
                                        size={16}
                                        color="#522F60"
                                    />
                                ))}
                        </View>
                    </View>
                </View>
                {/* Like */}
                <View style={styles.RatingContainer}>
                    <View style={styles.StartContent}>
                        <View style={styles.StarIconContainer}>
                            <AntDesign
                                name="like2"
                                size={16}
                                color="#522F60"
                                style={styles.CheckCircleIcon}
                            />
                        </View>
                        <View style={styles.RatingContent}>
                            <Text style={styles.LikeText}>40293</Text>
                        </View>
                    </View>
                </View>
                {/* Comment */}
                <View style={styles.RatingContainer}>
                    <View style={styles.StartContent}>
                        <View style={styles.StarIconContainer}>
                            <Octicons
                                name="comment-discussion"
                                size={16}
                                color="#522F60" // Outline color for stars
                            />
                        </View>
                        <View style={styles.RatingContent}>
                            <Text style={styles.LikeText}>392</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.DeleteBoxContainer}>
                <Text style={styles.DeleteText} >Delete</Text>
            </View>
        </View>
    );
};

export default ShareWithFriends;

const styles = StyleSheet.create({
    Container: {
        marginHorizontal: 16,
        flex: 1,
        backgroundColor: 'white',
    },
    ShareContainer: {
        borderWidth: 1,
        borderRadius: 4,
        marginTop: 10,
        height: 30,
        borderColor: "#522F60",
        justifyContent: 'center',
        backgroundColor: "#522F60",
    },
    BoxContainer: {
        borderWidth: 1,
        borderRadius: 4,
        marginTop: 10,
        height: 30,
        borderColor: "#522F60",
    },
    /////////////////////////////////////////////////////////////
    ShareWithFriendsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    IconWrapper: {
        width: 32,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ShareIcon: {
        color: "#FFFFFF",
    },
    ShareWithFriendsText: {
        fontFamily: 'SF Pro',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 19,
        color: "#FFFFFF",
        textAlign: 'center',
        flex: 2,
    },
    ArrowIcon: {
        color: "#FFFFFF",
    },
    ///////////////////////////////////////////////////////////
    UserInfoContainer: {
        borderWidth: 1,
        borderRadius: 4,
        marginTop: 10,
        borderColor: "#522F60",
    },
    UserInfoContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    UserLocationTextContainer: {
        marginLeft: 10,
    },
    locationHeaderText: {
        width: 'auto',
        fontFamily: 'SF Pro',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 16.71,
    },
    UserIconContainer: {
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        height: 29,
        width: 32,
        borderColor: "#522F6080",
    },
    CheckCircleIcon: {},
    //////////////////////////////////////////////////////////////
    HashtagContainer: {
        borderWidth: 1,
        borderRadius: 4,
        marginTop: 10,
        height: 30,
        borderColor: "#522F60",
    },
    HashtagContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    HashtagIconContainer: {
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        height: 29,
        width: 32,
        borderColor: "#522F6080",
    },
    HashtagTextContainer: {
        marginLeft: 10,
    },
    HashtagText: {
        width: 'auto',
        fontFamily: 'SF Pro',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 16.71,
    },
    //////////////////////////////////////////////////////////////////////
    StartLikeCommentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    RatingContainer: {
        width: 110,
        borderWidth: 1,
        borderRadius: 4,
        marginTop: 10,
        height: 30,
        borderColor: "#522F60",
    },
    StartContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    StarIconContainer: {
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        height: 29,
        width: 24,
        borderColor: "#522F6080",
    },
    RatingContent: {
        flexDirection: "row",
        marginLeft: 4,
    },
    LikeText:{
        marginLeft:5,
    },
    ////////////////////////////////////////////////////////////////////
    DeleteBoxContainer:{
        marginTop:10,
    },
    DeleteText: {
        fontFamily: 'SF Pro',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 19.09,
        textAlign: 'left',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',

    },
});
