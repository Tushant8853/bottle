import { StyleSheet, Dimensions } from "react-native";

// Get device screen width
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    //borderWidth: 1,
  },
  containerf: {
    //borderWidth: 1,
    paddingVertical: 16,
  },
  bannerContainer: {
    //borderWidth: 1,
   // marginBottom: 5,
    marginTop: 15,
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
  bannericonContainer: {
    position: "absolute",
    top: 1,
    right: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 11,
    width: 32,
    height: 32,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#522F60",
    textAlign: "left",
    marginTop: 7,
    marginLeft: 2,
  },
  ///////////////////////////////////////Storeies ////////////////////////////////////////
  row: {
    flexDirection: "row",
    marginHorizontal: 16,
  },
  ComponentContainer: {
    justifyContent: "space-between",
    marginRight: 8,
    marginBottom: 4,
    marginTop: 4,

  },
  imageWrapper: {
    width: width / 2 - 22,
  },
  componentIMGStyle: {
    width: "100%",
    height:170,
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
