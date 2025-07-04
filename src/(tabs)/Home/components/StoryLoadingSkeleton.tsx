import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Dimensions,
  Animated,
  StyleSheet,
} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const StoryLoadingSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Shimmer animation
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );

    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    shimmer.start();
    pulse.start();

    return () => {
      shimmer.stop();
      pulse.stop();
    };
  }, [shimmerAnim, pulseAnim]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth, screenWidth],
  });

  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarSkeleton} />
          <View style={styles.usernameSkeleton} />
        </View>
        <View style={styles.headerRight}>
          <View style={styles.iconSkeleton} />
          <View style={styles.iconSkeleton} />
        </View>
      </View>

      {/* Progress Bar Skeleton */}
      <View style={styles.progressContainer}>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.progressBarSkeleton} />
        ))}
      </View>

      {/* Main Content Skeleton */}
      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.mediaSkeleton,
            {
              transform: [{scale: pulseAnim}],
            },
          ]}
        />
        
        {/* Shimmer Overlay */}
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              transform: [{translateX: shimmerTranslate}],
              opacity: shimmerAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.3, 0.8, 0.3],
              }),
            },
          ]}
        />
      </View>

      {/* Loading Text */}
      <View style={styles.loadingTextContainer}>
        <Animated.View
          style={[
            styles.loadingDot,
            {
              transform: [{scale: pulseAnim}],
            },
          ]}
        />
        <Text style={styles.loadingText}>Đang tải story...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSkeleton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
  },
  usernameSkeleton: {
    width: 80,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#333',
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  iconSkeleton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 4,
    marginBottom: 16,
  },
  progressBarSkeleton: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#333',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mediaSkeleton: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.6,
    borderRadius: 20,
    backgroundColor: '#222',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: -screenWidth,
    width: screenWidth,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  loadingTextContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default StoryLoadingSkeleton; 