import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "white",
    },
    scrollViewContent: {
    },
    bottom: {
        marginBottom: 100
    },
    header: {
        marginTop: 40,
        backgroundColor: "white",
        height: 22,
        marginBottom: 4,
    },
    headingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    bannerTextContainer: {
        flex: 1,
        justifyContent: "center",
    },
    bannerarrow: {
    },
    bannerTitle: {
        fontFamily: 'Hiragino Sans',
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 22,
        letterSpacing: 0.02,
        textAlign: 'left',
        marginLeft: 6,
        color: '#30425F',
    },

    ////////////////////////////Search //////////////////////////
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderColor: "#522F60",
        borderWidth: 1,
        paddingHorizontal: 18,
        paddingVertical: 1,
        marginBottom: 14,
        marginVertical: 4,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 3,
        height: 42,
    },
    searchIcon: {
        marginRight: 7,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "black",
    },
    /////////////////////////////////// List of Wines ///////////////////////////////
    ListOfStoriesContainer: {
        marginTop: 4,
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
        // justifyContent: 'space-evenly',
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
        marginTop: 6,
        width: "90%"
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

    },
    ArrowConatiner: {
        position: 'absolute',
        height: '100%',
        right: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    Arrow: {},
    comingSoonContainer: {
        position: "absolute", // Position relative to the parent container
        top: 0,              // Align at the top of the parent
        left: 18,            // Same padding as the search input
        right: 18,           // Same padding as the search input
        bottom: 0,           // Stretch to the bottom
        justifyContent: "center", // Center the text vertically
        alignItems: "center",     // Center the text horizontally
        backgroundColor: "white", // Match the background color of the input
        borderRadius: 8,          // Match the input's border radius
        zIndex: 1,                // Ensure it's above other elements
    },
    comingSoonText: {
        color: '#522F60',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default styles;
