import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Choices from './Choices';
import { useTheme } from '../../../util/ThemeContext';
import { Colors } from '../../../../assets/color/Colors';

const Card = (props: any) => {
  const {id, name, uri, isFirst, swipe, ...rest} = props;
  const {width, height} = Dimensions.get('window');
  const {theme} = useTheme();
  const color = Colors[theme];

  const rotate = swipe.x.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  const animatedCardStyles = {
    transform: [...swipe.getTranslateTransform(), {rotate}],
  };

  const likeOpacity = swipe.x.interpolate({
    inputRange: [25, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const nopeOpacity = swipe.x.interpolate({
    inputRange: [-100, -25],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderChoice = useCallback(() => {
    return (
      <>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 15,
            backgroundColor: 'rgba(233,64,87,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: likeOpacity,
          }}>
          <Choices type={'like'} />
        </Animated.View>
        <Animated.View style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 15,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: nopeOpacity,
          }}>
          <Choices type={'nope'} />
        </Animated.View>
      </>
    );
  }, []);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
        },
        isFirst && animatedCardStyles,
      ]}
      {...rest}>
      <Image
        source={{uri: uri}}
        style={{
          width: width * 0.8,
          height: height * 0.55,
          borderRadius: 15,
        }}
      />
      <LinearGradient
        colors={['transparent', color.text]}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          borderRadius: 15,
        }}
      />
      <Text
        style={{
          position: 'absolute',
          fontSize: 24,
          color: color.background,
          fontWeight: 'bold',
          left: 20,
          bottom: 22,
        }}>
        {name}
      </Text>
      {isFirst && renderChoice()}
    </Animated.View>
  );
};

export default Card;

const styles = StyleSheet.create({});
