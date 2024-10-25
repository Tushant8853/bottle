import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from "react-native";

interface Styles {
  DashBoardContainer: ViewStyle;
  HeaderScrollContainer: ViewStyle;
  HeaderContainer: ViewStyle;
  HeaderImgContainer: ViewStyle;
  image: ImageStyle;
  text: TextStyle;
  subtext: TextStyle;
  inputContainer: ViewStyle;
  MyMemoriesDashboardContainer: ViewStyle;
  OtherMemoriesDashboardContainer: ViewStyle;
  scrollViewContent: ViewStyle;
  bottoms: ViewStyle;
  searchContainer: ViewStyle;
  searchIcon: ViewStyle;
  searchInput: TextStyle;
  saveButton: ViewStyle;
  DiscoverWinesDashboardContainer: ViewStyle;
  WineriesDashboardContainer: ViewStyle;
  RestaurantsDashboardContainer: ViewStyle;
  StoriesDashboardContainer: ViewStyle; // Corrected to add this type
}

const styles = StyleSheet.create<Styles>({
  DashBoardContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  HeaderScrollContainer: {},
  HeaderContainer: {
    flexDirection: "row",
  },
  HeaderImgContainer: {
    height: 300,
    marginRight: 0,
  },
  image: {
    height: 300,
    width: "100%",
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  text: {
    color: "white",
    fontSize: 32,
    fontWeight: "600", // Changed to a valid weight
    position: "absolute",
    bottom: 25,
    left: 18,
  },
  subtext: {
    color: "white",
    fontSize: 16,
    fontWeight: "400", // Changed to a valid weight
    position: "absolute",
    bottom: 10,
    left: 20,
  },
  inputContainer: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#000",
    borderBottomWidth: 1,
  },
  MyMemoriesDashboardContainer: {
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  OtherMemoriesDashboardContainer: {
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  bottoms: {
    marginBottom: 150,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "lightgrey",
    borderWidth: 1,
    paddingHorizontal: 1,
    paddingVertical: 3,
    height: 54,
  },
  searchIcon: {
    marginRight: 7,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "black",
  },
  saveButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 11,
    width: 40,
    height: 40,
  },
  DiscoverWinesDashboardContainer: {
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  WineriesDashboardContainer: {
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  RestaurantsDashboardContainer: {
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  StoriesDashboardContainer: { // Added styles for this type if necessary
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
});

export default styles;
