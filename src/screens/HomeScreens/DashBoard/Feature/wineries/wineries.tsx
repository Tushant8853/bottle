import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../../../../../../backend/supabase/supabaseClient';
import { TwicImg, installTwicPics } from '@twicpics/components/react-native';

// Configure TwicPics
installTwicPics({
  domain: 'https://bottleshock.twic.pics/',
  debug: true,
  maxDPR: 3,
});

const { width } = Dimensions.get('window');

interface WineryData {
  id: number;
  name: string;
  location: string;
  banner: string;
  verified: boolean;
}

const Wineries: React.FC = () => {
  const [likedStatus, setLikedStatus] = useState<boolean[]>([]);
  const [wineries, setWineries] = useState<WineryData[]>([]);
  const navigation = useNavigation(); // Initialize navigation hook

  const imagePrefix = 'https://bottleshock.twic.pics/file/';

  useEffect(() => {
    // Fetch winery data from Supabase
    const fetchWineries = async () => {
      const { data, error } = await supabase
        .from('bottleshock_wineries')
        .select('id, name, location, verified, banner');

      if (error) {
        console.error('Error fetching wineries:', error.message);
        return;
      }

      const fetchedWineries = data.map((winery: WineryData) => ({
        ...winery,
        banner: winery.banner ? `${imagePrefix}${winery.banner}` : null,
      }));

      // Limit the displayed wineries to 4 (2 rows with 2 items each)
      setWineries(fetchedWineries.slice(0, 4));
      setLikedStatus(new Array(fetchedWineries.length).fill(false));
    };

    fetchWineries();
  }, []);

  const handleSavePress = (index: number): void => {
    const newStatus = [...likedStatus];
    newStatus[index] = !newStatus[index];
    setLikedStatus(newStatus);
  };

  // Calculate dynamic gaps
  const rowGap = width * 0.05; // 5% of screen width

  return (
    <View style={styles.container}>
      <View style={styles.TitleContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.text}>featured wineries</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('WineriesList')}>
          <Icon name="chevron-right" size={16} color="#522F60" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.gridContainer}>
          {wineries.map((winery, index) => (
            <View key={winery.id} style={styles.gridItem}>
              <View style={styles.ComponentContainer}>
                <View style={styles.imageWrapper}>
                  {winery.banner && (
                    <TwicImg
                      src={winery.banner}
                      style={styles.component}
                      resizeMode="cover"
                    />
                  )}
                  <Pressable onPress={() => handleSavePress(index)} style={styles.saveButton}>
                    <Icon
                      name={likedStatus[index] ? 'heart' : 'heart-o'}
                      size={20}
                      color="#30425F"
                    />
                  </Pressable>
                </View>
                <Text style={styles.componentText}>
                  {winery.name}{' '}
                  {winery.verified && <Icons name="verified" size={14} color="#522F60" />}
                </Text>
                <Text style={styles.subcomponentText}>{winery.location}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#522F60',
    marginTop: 3,
    marginLeft: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  gridItem: {
    width: '48%', // Two items per row with some space between
    marginBottom: 20,
  },
  imageWrapper: {
    height: 173,
    position: 'relative',
  },
  ComponentContainer: {
    borderRadius: 10,
    width: '100%',
  },
  component: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  componentText: {
    fontSize: 14,
    marginTop: 10,
    color: '#000',
    flexWrap: 'wrap',
    maxWidth: '100%',
    textAlign: 'left',
    fontWeight: '600',
  },
  subcomponentText: {
    fontSize: 12,
    marginTop: 1,
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
