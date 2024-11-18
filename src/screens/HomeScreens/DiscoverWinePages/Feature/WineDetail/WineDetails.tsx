import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const WineDetails: React.FC = () => {

  return (
    <View style={styles.Container}>
      <View style={styles.SubContainer}>
        <View style={styles.ImgContainer}>
          <Image source={require('../../../../../assets/png/Wine.png')} style={styles.image} />
        </View>
        <View style={styles.ScrollViewContainer}>
          <ScrollView contentContainerStyle={styles.MainScrollViewContainer}>
            <View style={styles.infoContainer}>
              <View style={styles.HeadingContainer}>
                <Text style={styles.winery}>Hertelendy Vineyards</Text>
                <Text style={styles.winery}>ハーテレンディ ヴィンヤーズ</Text>
              </View>
              <View style={styles.SubHeadingContainer}>
                <Text style={styles.wineName}>Legend</Text>
                <Text style={styles.wineName}>伝説</Text>
              </View>
              <View style={styles.DateContainer}>
                <Text style={styles.vintage}>2019</Text>
                <Text style={styles.vintage}>二千十九</Text>
              </View>
              <View style={styles.RatingContainer}>
                <Text style={styles.type}>Red Blend</Text>
                <View>
                  <Text>Ratings</Text>
                </View>
              </View>

              {/* Ratings */}
              <View style={styles.ratingsContainer}>
                <Text>RP 100</Text>
                <Text>JD 100</Text>
                <Text>WE 100</Text>
                <Text>WS 100</Text>
              </View>
            </View>
            <View>
              <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor eum est, praesentium eligendi distinctio dolorum iste minus ut ducimus quaerat quam amet eveniet sapiente ipsum, sint nihil eius voluptate beatae.</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default WineDetails;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    marginBottom: 100,
    marginTop: 40,
  },
  SubContainer: {
    flexDirection: 'row',
  },
  ImgContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    height: '100%', // Keep the full height of the image
    width: 90, // Set the width for the image container
    borderWidth: 1,
    overflow: 'hidden', // Crop the image horizontally
  },
  image: {
    height: '100%', // Keep the full height of the image
    width: '200%', // Make the image width double to ensure only half of the image is shown
    marginLeft: '-50%', // Shift the image to the left to show the right half
  },
  ScrollViewContainer: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  MainScrollViewContainer: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  infoContainer: {},
  HeadingContainer: {},
  winery: {},
  SubHeadingContainer: {},
  wineName: {},
  DateContainer: {},
  vintage: {},
  RatingContainer: {},
  type: {},
  ratingsContainer: {},
});