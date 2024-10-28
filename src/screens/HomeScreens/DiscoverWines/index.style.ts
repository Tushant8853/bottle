import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

// Define the types for each style object
interface Styles {
    container: ViewStyle;
    TitleContainer: ViewStyle;
    leftContainer: ViewStyle;
    MemoriesImg: ImageStyle;
    text: TextStyle;
    ListOfStoriesContainer: ViewStyle;
    Stories: ViewStyle;
    StoriesImgContainer: ViewStyle;
    StoriesImage: ImageStyle;
    StoriesText: ViewStyle;
    StoriesTitle: ViewStyle;
    StoriesTitleText: TextStyle;
    StoriesSubtitle: TextStyle;
    StoriesDescription: TextStyle;
    StoriesTitleIMG: ViewStyle;
    StoriesDescriptionConatiner: ViewStyle;
    boldText: TextStyle;
    StoriesTitleTextContainer:ViewStyle;
}

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
      },
      header: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 1,
        paddingTop: 55,
        backgroundColor: "white",
        width: "100%",
      },
      headerTitle: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        color: "#333",
        flex: 1,
      },
      searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderColor: "#522F60",
        borderWidth: 1,
        paddingHorizontal: 18,
        paddingVertical: 1,
        marginBottom: 13,
        marginVertical: 4,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 3,
        height: 40,
      },
      searchIcon: {
        marginRight: 7,
      },
      searchInput: {
        flex: 1,
        fontSize: 14,
        color: "black",
      },
    TitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    MemoriesImg: {
        width: 13,
        height: 32,
        borderRadius: 1,
        resizeMode: 'contain',
        marginRight: 4,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#522F60',
        marginBottom: 2,
        marginLeft: 6
    },
    ListOfStoriesContainer: {
        marginTop: 6,
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
        marginTop: 6
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
    StoriesTitleTextContainer:{

    },
});

export default styles;
