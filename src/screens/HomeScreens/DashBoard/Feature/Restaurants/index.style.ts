import { StyleSheet, Dimensions } from 'react-native';

// Get device screen width
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        width: '100%',
        marginBottom: 5,
        padding: 10,
        paddingBottom: 3,
    },
    TitleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: 8,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#522F60',
        marginTop: 3,
        marginBottom: 3,
    },
    RowScrollcontainer: {
        marginTop: 10,
        marginLeft: 16,
    },
    scrollContent: {
        paddingRight: 30, // Ensure last item doesn't stick to the edge
    },
    ComponentContainer: {
        width: width / 2 - 30, // Dynamically set the width so that two items can fit on the screen
        marginRight: 15, // Horizontal margin between items
        alignItems: 'flex-start', // Align items to the left
    },
    imageWrapper: {
        width: 160,
        height: 160,
        position: 'relative', // Set position to relative for the main image container
    },
    component: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    componentText: {
        fontSize: 14,
        marginTop: 5, // Space between image and text
        color: '#000', // Optional: set text color
        flexWrap: 'wrap', // Allows the text to wrap
        maxWidth: '100%', // Ensure text doesn't exceed the width of the container
        marginLeft: 10,
        textAlign: 'left', // Align text to the left
    },
    saveButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 11,
        width: 32,
        height: 32,
    },
});

export default styles;
