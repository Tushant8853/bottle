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
        height: 'auto',
        width: '100%',
        marginBottom: 5,
        padding: 10,
        paddingBottom: 3,
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
        marginLeft: 2
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
