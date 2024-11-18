import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  bannerContainer: {
    marginBottom: 5,
    padding: 10,
    paddingBottom: 3,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    justifyContent: "center",
  },
  bannerarrow: {
    marginLeft: 6,
    marginTop: 10,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#522F60",
    textAlign: "left",
    marginLeft: 6,
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
  cardContainer: {
    marginRight: 10,
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
    width: 160,
    textAlign: "left",
    color: "#333",
    marginLeft: 10,
    marginBottom: 20,
    paddingBottom: 20,
  },
  errorText: {
    // Your error text styles here
  },
  noMemoriesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#522F60',
    marginTop:40,
  }
});

export default styles;