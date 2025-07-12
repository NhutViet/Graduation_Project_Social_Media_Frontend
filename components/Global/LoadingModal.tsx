import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Image, Easing} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SIZE = 40;
const BORDER_WIDTH = 5;
const OUTER_SIZE = SIZE + BORDER_WIDTH * 2;
const LOGO_PADDING = 4;

const LoadingModal: React.FC = () => {
  const rotate = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1700,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.linear),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [rotate, shimmer]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-SIZE * 0.6, SIZE * 0.6],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.gradientBorder,
          {
            transform: [{rotate: rotateInterpolate}],
            borderRadius: OUTER_SIZE / 2,
            overflow: 'hidden',
          },
        ]}>
        <LinearGradient
          colors={['#cbefff', '#00b2ff', '#0073e6', '#cbefff']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={{width: OUTER_SIZE, height: OUTER_SIZE}}
        />
        <View
          style={{
            position: 'absolute',
            left: BORDER_WIDTH,
            top: BORDER_WIDTH,
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            backgroundColor: 'white',
          }}
        />
      </Animated.View>

      <View style={styles.logoWrap}>
        <Image
          source={require('@assets/icon/logo_loading.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{translateX: shimmerTranslate}],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBorder: {
    position: 'absolute',
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  logoWrap: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 2,
    padding: LOGO_PADDING,
  },
  logo: {
    width: SIZE - LOGO_PADDING * 2,
    height: SIZE - LOGO_PADDING * 2,
  },
  shimmer: {
    position: 'absolute',
    width: SIZE * 0.5,
    height: SIZE,
    backgroundColor: 'rgba(255,255,255,0.44)',
    opacity: 0.85,
    borderRadius: SIZE / 5,
    left: 0,
    top: 0,
    shadowColor: '#fff',
    shadowOpacity: 0.45,
    shadowRadius: 6,
  },
});

export default LoadingModal;
