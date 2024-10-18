import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Img from "../../../../../assets/png/HeaderIcon.png";

const PublicMemories = () => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.title}>Fall Harvest Party 2024</Text>
        <View style={styles.actionIcons}>
          <TouchableOpacity>
            <Ionicons name="pencil-outline" size={18} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={18} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={18} color="grey" />
          </TouchableOpacity>

          {/* Star rating */}
          <View style={styles.starRating}>
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <FontAwesome key={index} name="star" size={16} color="grey" />
              ))}
            <FontAwesome name="star-half-full" size={16} color="grey" />
          </View>
        </View>
        <Text style={styles.username}>
          @mingmei <Ionicons name="checkmark-circle" size={14} color="grey" />
        </Text>

        <Text style={styles.description}>
          <Text>
            Our fall trip to Sonoma County’s Healdsburg we have visited
            Lancaster Estate
          </Text>
        </Text>

        {/* Action icons */}
        <View style={styles.actionIcons}>
          <TouchableOpacity>
            <Ionicons name="pencil-outline" size={18} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={18} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={18} color="grey" />
          </TouchableOpacity>

          {/* Star rating */}
          <View style={styles.starRating}>
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <FontAwesome key={index} name="star" size={16} color="grey" />
              ))}
            <FontAwesome name="star-half-full" size={16} color="grey" />
          </View>
        </View>
      </View>

      {/* Right side image */}
      <View style={styles.rightContent}>
        <Image src={Img} style={styles.image} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    marginVertical: 16,
    marginTop: 4,
    flexDirection: "row",
    // padding: 10,
  },
  leftContent: {
    flex: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  username: {
    fontSize: 14,
    color: "grey",
    marginVertical: 2,
  },
  description: {
    fontSize: 14,
    color: "#333",
  },
  actionIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  starRating: {
    flexDirection: "row",
    marginLeft: 10,
  },
  rightContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
});

export default PublicMemories;
