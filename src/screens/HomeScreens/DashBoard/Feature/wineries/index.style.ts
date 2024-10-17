import { StyleSheet, Dimensions, ViewStyle, TextStyle, ImageStyle } from 'react-native';

// Get device screen width
const { width } = Dimensions.get('window');

interface Styles {
  container: ViewStyle;
  TitleContainer: ViewStyle;
  leftContainer: ViewStyle;
  MemoriesImg: ImageStyle;
  text: TextStyle;
  row: ViewStyle;
  imageWrapper: ViewStyle;
  component: ImageStyle;
  componentText: TextStyle;
  subcomponentText: TextStyle;
  saveButton: ViewStyle;
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
    marginBottom: 20,
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
    marginTop: 3,
    marginLeft: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 5,
  },
  imageWrapper: {
    width: 173,
    height: 173,
    position: 'relative',
  },
  component: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  componentText: {
    fontSize: 14,
    marginTop: 5,
    color: '#000',
    flexWrap: 'wrap',
    maxWidth: '100%',
    textAlign: 'left',
    fontWeight: '600',
  },
  subcomponentText: {
    fontSize: 12,
    marginTop: 5,
    color: '#66605E',
    flexWrap: 'wrap',
    maxWidth: '100%',
    textAlign: 'left',
    fontWeight: '400',
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
