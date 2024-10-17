import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  bannerContainer: {
    marginBottom: 5,
    padding: 10,
    flexDirection: "row",
    paddingBottom: 3,
    alignItems: "center", // Ensure vertical alignment of content
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
    justifyContent: "center", // Center the text vertically
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#522F60",
    textAlign: "left",
    marginTop: 5,
    marginLeft: 2,
  },
  cardsContainer: {
    flexDirection: "row",
    paddingBottom: 1,
  },
  card: {
    backgroundColor: "#fff",
    padding: 1,
    width: "100%",
    height: 170,
    alignItems: "center",
  },
  cardIcon: {
    width: 160,
    height: 100,
    marginTop: 10,
    marginLeft: 12,
    marginBottom: 1,
    borderRadius: 11,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
    width: 160, // Adjust to match card width for better alignment
    textAlign: "left",
    color: "#333",
    marginLeft: 10,
    marginBottom: 20,
    paddingBottom: 20,
  },
  errorText:{

  },
});

export default styles;
