import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Animated,
} from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../../../../../../backend/supabase/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TwicImg, installTwicPics } from '@twicpics/components/react-native';
import Bannericon from '../../../../../assets/svg/SvgCodeFile/bannericon';
import { RootStackParamList } from "../../../../../TabNavigation/navigationTypes";
import { useTranslation } from 'react-i18next';


installTwicPics({
  domain: 'https://bottleshock.twic.pics/',
  debug: true,
  maxDPR: 3,
});

const { width } = Dimensions.get('window');

interface WineryData {
  name: string;
  location: string;
  banner: string;
  verified: boolean;
  address: string;
  winery_name: string;
  wineries_id: number;
}
const SkeletonItem: React.FC = () => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });
  return (
    <View style={styles.gridItem}>
      <View style={styles.ComponentContainer}>
        <Animated.View style={[styles.skeletonImage, { opacity }]} />
        <View style={styles.skeletonContent}>
          <Animated.View style={[styles.skeletonTitle, { opacity }]} />
          <Animated.View style={[styles.skeletonAddress, { opacity }]} />
        </View>
      </View>
    </View>
  );
};
const SkeletonLoader: React.FC = () => {
  return (
    <View style={styles.gridContainer}>
      {[1, 2, 3, 4].map((item) => (
        <SkeletonItem key={item} />
      ))}
    </View>
  );
};

const Wineries: React.FC = () => {
  const [likedStatus, setLikedStatus] = useState<boolean[]>([]);
  const [wineries, setWineries] = useState<WineryData[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();


  const imagePrefix = 'https://bottleshock.twic.pics/file/';

  useEffect(() => {
    fetchWineries();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchWineries();
    }, [])
  );

  const fetchWineries = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('bottleshock_wineries')
      .select('wineries_id, winery_name, address, verified, banner');

    if (error) {
      console.error('Error fetching wineries:', error.message);
      return;
    }

    const fetchedWineries = data.map((winery: WineryData) => ({
      ...winery,
      banner: winery.banner ? `${imagePrefix}${winery.banner}` : null,
    }));

    setWineries(fetchedWineries.slice(0, 4));
    setLikedStatus(new Array(fetchedWineries.length).fill(false));

    await checkSavedWineries(fetchedWineries);
    setIsLoading(false);
  };

  const checkSavedWineries = async (fetchedWineries: WineryData[]) => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found.");
        return;
      }

      const { data: savedWineries, error } = await supabase
        .from('bottleshock_saved_wineries')
        .select('winery_id')
        .eq('user_id', UID);

      if (error) {
        console.error('Error fetching saved wineries:', error.message);
        return;
      }

      const savedIds = savedWineries?.map((winery) => winery.winery_id);
      const updatedLikedStatus = fetchedWineries.map((winery) =>
        savedIds.includes(winery.wineries_id)
      );

      setLikedStatus(updatedLikedStatus);
    } catch (error) {
      console.error('Error in checkSavedWineries:', error);
    }
  };

  const handleSavePress = async (index: number): Promise<void> => {
    try {
      const UID = await AsyncStorage.getItem("UID");
      if (!UID) {
        console.error("User ID not found.");
        return;
      }

      const winery = wineries[index];
      const isLiked = likedStatus[index];

      if (isLiked) {
        const { error } = await supabase
          .from('bottleshock_saved_wineries')
          .delete()
          .match({ user_id: UID, winery_id: winery.wineries_id });

        if (error) {
          console.error('Error removing winery:', error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('bottleshock_saved_wineries')
          .insert([{ user_id: UID, winery_id: winery.wineries_id, created_at: new Date().toISOString() }]);

        if (error) {
          console.error('Error saving winery:', error.message);
          return;
        }
      }

      const newStatus = [...likedStatus];
      newStatus[index] = !newStatus[index];
      setLikedStatus(newStatus);
    } catch (error) {
      console.error('Error handling save press:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.TitleContainer}>
        <View style={styles.leftContainer}>
          <Bannericon width={13} height={32} color="#522F60" />
          <Text style={styles.text}>{t('featuredwineries')}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('WineriesList')}>
          <Icon name="chevron-right" size={16} color="#522F60" />
        </TouchableOpacity>
      </View>

      <ScrollView>
      {isLoading ? (
          <SkeletonLoader />
        ) : (
        <View style={styles.gridContainer}>
          {wineries.map((winery, index) => (
            <View key={winery.wineries_id} style={styles.gridItem}>
              <Pressable onPress={() => navigation.navigate("WineriesDetails", { id: winery.wineries_id })}>
                <View style={styles.ComponentContainer}>
                  <View style={styles.imageWrapper}>
                    {winery.banner && (
                      <TwicImg
                        src={winery.banner}
                        style={styles.component}
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
                        {winery.verified && <Icons name="verified" size={14} color="#522F60" />}
                      </Text>
                    </View>
                    <Text style={styles.subcomponentText}>{winery.address}</Text>
                  </View>
                </View>
              </Pressable>
            </View>
          ))}
        </View>
        )}
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
  skeletonImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#E1E9EE',
    borderRadius: 10,
  },
  skeletonContent: {
    marginTop: 8,
  },
  skeletonTitle: {
    width: '80%',
    height: 20,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonAddress: {
    width: '60%',
    height: 16,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
});
