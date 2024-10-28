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
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../../../../../../backend/supabase/supabaseClient';
import { TwicImg, installTwicPics } from '@twicpics/components/react-native';
import Bannericon from '../../../../../assets/svg/SvgCodeFile/bannericon';
import { RootStackParamList } from "../../../../../TabNavigation/navigationTypes";

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
  address:string;
  winery_name: string;
}

const Wineries: React.FC = () => {
  const [likedStatus, setLikedStatus] = useState<boolean[]>([]);
  const [wineries, setWineries] = useState<WineryData[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const imagePrefix = 'https://bottleshock.twic.pics/file/';

  useEffect(() => {
    const fetchWineries = async () => {
      const { data, error } = await supabase
        .from('bottleshock_wineries')
        .select('id, winery_name, address, verified, banner');

      if (error) {
        console.error('Error fetching wineries:', error.message);
        return;
      }

      const fetchedWineries = data.map((WineryData) => ({
        ...WineryData,
        banner: WineryData.banner ? `${imagePrefix}${WineryData.banner}` : null,
      }));

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
        <Bannericon width={13} height={32} color="#522F60"/>
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
                      //resizeMode="cover"
                    />
                  )}
                  <Pressable onPress={() => handleSavePress(index)} style={styles.saveButton}>
                    <Icon
                      name={likedStatus[index] ? 'bookmark' : 'bookmark-o'}
                      size={20}
                      color="#30425F"
                    />
                  </Pressable>
                </View>
              <View>
                <View style={styles.componentTitle}>
                <Text style={styles.componentText} numberOfLines={1}>
                  {winery.winery_name}{' '}               
                </Text>
                <Text style={styles.componentText1}>
                  {winery.verified && <Icons name="verified" size={14} color="#522F60"/>}
                </Text> 
                </View>
                <Text style={styles.subcomponentText}>{winery.address}</Text>
              </View>
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
  bannerImage: {
    width: 13,
    height: 32,
    borderRadius: 1,
    resizeMode: "contain",
    marginRight: 4,
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
    marginLeft: 6,
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
    height: 'auto',
    position: 'relative',
   paddingBottom: 1,
  },
  ComponentContainer: {
    borderRadius: 10,
    width: '100%',
    flexDirection: 'column'
  },
  component: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  componentTitle: {
    flexDirection: 'row',
  },
  componentText: {
    fontSize: 16,
    marginTop: 1,
    color: '#000',
    flexWrap: 'wrap',
    maxWidth: '90%',
    textAlign: 'left',
    fontWeight: '600',
  },
  componentText1: {
    marginTop: 5,
    textAlign: 'left',
    fontWeight: '600',
  },
  subcomponentText: {
    fontSize: 14,
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
