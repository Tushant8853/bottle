import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Pressable, ImageSourcePropType } from 'react-native';
import MymemoriesImg from '../../../../../assets/png/MymemoriesIcon.png';
import WineriesComponentImg1 from '../../../../../assets/png/WineriesImg1.png';
import WineriesComponentImg2 from '../../../../../assets/png/WineriesImg2.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';

// Get device screen width
const { width } = Dimensions.get('window');

// Define TypeScript type for winery data (if needed)
interface WineryData {
  id: number;
  name: string;
  location: string;
  image: ImageSourcePropType;
  isSaved: boolean;
}

const Wineries: React.FC = () => {
  const [likedStatus, setLikedStatus] = useState<boolean[]>([false, false, false, false]); // Track if the item is saved or not

  const handleSavePress = (index: number): void => {
    const newStatus = [...likedStatus];
    newStatus[index] = !newStatus[index]; // Toggle the like status
    setLikedStatus(newStatus); // Toggle the state on button press
  };

  // Calculate dynamic gaps
  const rowGap = width * 0.05; // 5% of screen width
  const imageGap = width * 0.03; // 3% of screen width

  return (
    <View style={styles.container}>
      <View style={styles.TitleContainer}>
        <View style={styles.leftContainer}>
          <Image source={MymemoriesImg} style={styles.MemoriesImg} />
          <Text style={styles.text}>featured wineries</Text>
        </View>
        <Icon name="chevron-right" size={16} color="#522F60" />
      </View>

      {/* Row for wineries */}
      <View style={[styles.row]}>
        <View style={styles.ComponentContainer}>
          <View style={styles.imageWrapper}>
            <Image source={WineriesComponentImg1} style={styles.component} />
            <Pressable onPress={() => handleSavePress(0)} style={styles.saveButton}>
              <Icon 
                name={likedStatus[0] ? "bookmark" : "bookmark-o"} 
                size={20}
                color='#30425F'
              />
            </Pressable>
          </View>
          <Text style={styles.componentText}>Hertelendy Vineyards <Icons name='verified'/></Text>
          <Text style={styles.subcomponentText}>California</Text>
        </View>

        <View style={[styles.ComponentContainer]}>
          <View style={styles.imageWrapper}>
            <Image source={WineriesComponentImg2} style={styles.component} />
            <Pressable onPress={() => handleSavePress(1)} style={styles.saveButton}>
              <Icon 
                name={likedStatus[1] ? "bookmark" : "bookmark-o"} 
                size={20}
                color='#30425F'
              />
            </Pressable>
          </View>
          <Text style={styles.componentText}>Xander Soren Wines <Icons name='verified'/></Text>
          <Text style={styles.subcomponentText}>California</Text>
        </View>
      </View>

      <View style={[styles.row]}>
        <View style={styles.ComponentContainer}>
          <View style={styles.imageWrapper}>
            <Image source={WineriesComponentImg1} style={styles.component} />
            <Pressable onPress={() => handleSavePress(2)} style={styles.saveButton}>
              <Icon 
                name={likedStatus[2] ? "bookmark" : "bookmark-o"} 
                size={20}
                color='#30425F'
              />
            </Pressable>
          </View>
          <Text style={styles.componentText}>Hertelendy Vineyards <Icons name='verified'/></Text>
          <Text style={styles.subcomponentText}>California</Text>
        </View>

        <View style={[styles.ComponentContainer]}>
          <View style={styles.imageWrapper}>
            <Image source={WineriesComponentImg2} style={styles.component} />
            <Pressable onPress={() => handleSavePress(3)} style={styles.saveButton}>
              <Icon 
                name={likedStatus[3] ? "bookmark" : "bookmark-o"} 
                size={20}
                color='#30425F'
              />
            </Pressable>
          </View>
          <Text style={styles.componentText}>Xander Soren Wines <Icons name='verified'/></Text>
          <Text style={styles.subcomponentText}>California</Text>
        </View>
      </View>
    </View>
  );
};

export default Wineries;

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
    height: 173,
    position: 'relative',
  },
  ComponentContainer: {
    borderRadius: 10,
    width: width / 2 - 30,
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
