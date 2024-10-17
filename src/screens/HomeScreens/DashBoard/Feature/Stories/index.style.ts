import { StyleSheet, Dimensions } from "react-native";

// Get device screen width
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  containerf: {
    paddingVertical: 16,
  },
  bannerContainer: {
    marginBottom: 5,
    padding: 10,
    flexDirection: "row",
  },
  bannerImage: {
    width: 13,
    height: 32,
    borderRadius: 1,
    resizeMode: "contain",
    marginRight: 4,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#522F60",
    textAlign: "left",
    marginTop: 7,
  },
  row: {
    flexDirection: "row",
    marginHorizontal: 16,
    height: 170,
  },
  ComponentContainer: {
    justifyContent: "space-between",
    marginRight: 8,
  },
  imageWrapper: {
    width: width / 2 - 22,
    height: 165,
  },
  component: {
    width: "100%",
    height: "100%",
  },
  saveButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 11,
    width: 32,
    height: 32,
  },
});

export default styles;
