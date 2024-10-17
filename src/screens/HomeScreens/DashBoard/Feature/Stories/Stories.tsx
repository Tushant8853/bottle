import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/AntDesign";
import MymemoriesImg from "../../../../../assets/png/MymemoriesIcon.png";
import StoriesComponentImg1 from "../../../../../assets/png/HeaderIcon.png";
import StoriesComponentImg2 from "../../../../../assets/png/Stories2.png";
import StoriesComponentImg3 from "../../../../../assets/png/Stories3.png";
import StoriesComponentImg4 from "../../../../../assets/png/Storie4.png";
import styles from './index.style'; // Importing styles from index.style.js

const Stories: React.FC = () => {
  const [likedStatus, setLikedStatus] = useState<boolean[]>([false, false, false, false]); // Track if the item is saved or not

  const handleSavePress = (index: number) => {
    const newStatus = [...likedStatus];
    newStatus[index] = !newStatus[index]; // Toggle the like status
    setLikedStatus(newStatus); // Toggle the state on button press
  };

  return (
    <View style={styles.containerf}>
      <View style={styles.bannerContainer}>
        <Image source={require('../../../../../assets/png/MymemoriesIcon.png')} style={styles.bannerImage} />
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>Featured Stories</Text>
        </View>
        <View>
          <Icons name="arrowright" size={22} color="#522F60" />
        </View>
      </View>
      <View style={styles.containerf}>
        <View style={styles.row}>
          <View style={styles.ComponentContainer}>
            <View style={styles.imageWrapper}>
              <Image source={require('../../../../../assets/png/HeaderIcon.png')} style={styles.component} />
              <Pressable onPress={() => handleSavePress(0)} style={styles.saveButton}>
                <Icon
                  name={likedStatus[0] ? "bookmark" : "bookmark-o"}
                  size={20}
                  color="#30425F"
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.ComponentContainer}>
            <View style={styles.imageWrapper}>
              <Image source={require('../../../../../assets/png/Stories2.png')} style={styles.component} />
              <Pressable onPress={() => handleSavePress(1)} style={styles.saveButton}>
                <Icon
                  name={likedStatus[1] ? "bookmark" : "bookmark-o"}
                  size={20}
                  color="#30425F"
                />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Row for additional stories */}
        <View style={styles.row}>
          <View style={styles.ComponentContainer}>
            <View style={styles.imageWrapper}>
              <Image source={require('../../../../../assets/png/Stories3.png')} style={styles.component} />
              <Pressable onPress={() => handleSavePress(2)} style={styles.saveButton}>
                <Icon
                  name={likedStatus[2] ? "bookmark" : "bookmark-o"}
                  size={20}
                  color="#30425F"
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.ComponentContainer}>
            <View style={styles.imageWrapper}>
              <Image source={require('../../../../../assets/png/Storie4.png')} style={styles.component} />
              <Pressable onPress={() => handleSavePress(3)} style={styles.saveButton}>
                <Icon
                  name={likedStatus[3] ? "bookmark" : "bookmark-o"}
                  size={20}
                  color="#30425F"
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Stories;
