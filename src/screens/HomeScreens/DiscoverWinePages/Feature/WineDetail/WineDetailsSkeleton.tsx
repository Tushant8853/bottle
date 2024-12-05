import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './index.style';

const SkeletonPlaceholder = ({ style }) => {
  const animatedValue = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          backgroundColor: '#E1E9EE',
          opacity: animatedValue,
        },
      ]}
    />
  );
};

const WineDetailsSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="attach" size={24} color="gray" style={styles.rotatedIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="heart-outline" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="share-outline" size={24} color="gray" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.SubContainer}>
        <View style={styles.ImgContainer}>
          <SkeletonPlaceholder style={styles.image} />
        </View>
        
        <View style={[styles.ScrollViewContainer, { marginTop: 0 }]}>
          <View style={styles.detailsContainer}>
            <View style={styles.wineryNameContainer}>
              <SkeletonPlaceholder 
                style={{ height: 100, width: 200, borderRadius: 4 }} 
              />
              <SkeletonPlaceholder 
                style={{ height: 15, width: 150, borderRadius: 4, marginTop: 4 }} 
              />
            </View>
          </View>
        </View>
      </View>
      
      
      <View style={styles.BoxAndScannerContainer}>
        <SkeletonPlaceholder 
          style={{ 
            height: 40, 
            width: '100%', 
            borderRadius: 4, 
            marginBottom: 4 
          }} 
        />
        <SkeletonPlaceholder 
          style={{ 
            height: 40, 
            width: '100%', 
            borderRadius: 4, 
            marginBottom: 31 
          }} 
        />
        <SkeletonPlaceholder 
          style={{ 
            width: 79, 
            height: 79, 
            borderRadius: 4 
          }} 
        />
      </View>
    </View>
  );
};

export default WineDetailsSkeleton;