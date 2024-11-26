import React, { useEffect } from 'react';
import { ScrollView, View, Animated } from 'react-native';
import styles from './index.style'; // Create a styles file if needed

const SkeletonLoader: React.FC = () => {
    const animatedValue = new Animated.Value(0);

    useEffect(() => {
        const startAnimation = () => {
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
            ]).start(() => startAnimation());
        };

        startAnimation();
    }, []);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-350, 350],
    });

    const shimmerStyle = {
        transform: [{ translateX }],
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <View style={styles.imageSkeleton}>
                    <Animated.View style={[styles.shimmer, shimmerStyle]} />
                </View>
                <View style={styles.buttonContainer}>
                    {[1, 2, 3].map((_, index) => (
                        <View key={index} style={styles.buttonSkeleton}>
                            <Animated.View style={[styles.shimmer, shimmerStyle]} />
                        </View>
                    ))}
                </View>
                <View style={styles.textContainer}>
                    <View style={styles.titleSkeleton}>
                        <Animated.View style={[styles.shimmer, shimmerStyle]} />
                    </View>
                    <View style={styles.subtextSkeleton}>
                        <Animated.View style={[styles.shimmer, shimmerStyle]} />
                    </View>
                </View>
            </View>

            <View style={styles.skeletondescriptionContainer}>
                <View style={styles.descriptionIconSkeleton}>
                    <Animated.View style={[styles.shimmer, shimmerStyle]} />
                </View>
                <View style={styles.descriptionTextSkeleton}>
                    <Animated.View style={[styles.shimmer, shimmerStyle]} />
                </View>
            </View>

            <View style={styles.dateContainer}>
                <View style={styles.dateIconSkeleton}>
                    <Animated.View style={[styles.shimmer, shimmerStyle]} />
                </View>
                <View style={styles.dateTextSkeleton}>
                    <Animated.View style={[styles.shimmer, shimmerStyle]} />
                </View>
            </View>

            <View style={styles.picandvideoContainer}>
                <View style={styles.picandvideoHeader}>
                    <View style={styles.headerTextSkeleton}>
                        <Animated.View style={[styles.shimmer, shimmerStyle]} />
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailContainer}>
                    {[1, 2, 3, 4].map((_, index) => (
                        <View key={index} style={styles.thumbnailSkeleton}>
                            <Animated.View style={[styles.shimmer, shimmerStyle]} />
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.mapContainer}>
                <View style={styles.mapHeaderContainer}>
                    <View style={styles.mapHeaderSkeleton}>
                        <Animated.View style={[styles.shimmer, shimmerStyle]} />
                    </View>
                    <View style={styles.mapActionContainer}>
                        {[1, 2, 3].map((_, index) => (
                            <View key={index} style={styles.mapActionSkeleton}>
                                <Animated.View style={[styles.shimmer, shimmerStyle]} />
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.mapViewSkeleton}>
                    <Animated.View style={[styles.shimmer, shimmerStyle]} />
                </View>
                <View style={styles.addressContainer}>
                    <View style={styles.addressIconSkeleton}>
                        <Animated.View style={[styles.shimmer, shimmerStyle]} />
                    </View>
                    <View style={styles.addressTextSkeleton}>
                        <Animated.View style={[styles.shimmer, shimmerStyle]} />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default SkeletonLoader;
