import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {images as listImg} from './Data';
import Card from './Components/Card';
import {getSwipeStyles} from '../../StyleSheet/SwipeStyles';
import {useTheme} from '../../util/ThemeContext';
import RoundedButton from './Components/RoundedButton';
import {useNavigation} from '@react-navigation/native';

export const Swipe = () => {
  const {theme} = useTheme();
  const styles = getSwipeStyles(theme);
  const [images, setImages] = useState(listImg);
  const {width} = Dimensions.get('window');
  const navigation: any = useNavigation();

  useEffect(() => {
    if (!images.length) {
      setImages(listImg);
    }
  }, [images.length]);

  //swipe
  const swipe = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, {dx, dy, y0}) => {
      swipe.setValue({x: dx, y: dy});
    },
    onPanResponderRelease(_, {dx, dy}) {
      const direction = Math.sign(dx);
      const isActionActive = Math.abs(dx) > 100;

      if (isActionActive) {
        Animated.timing(swipe, {
          duration: 500,
          toValue: {x: direction * (width * 2), y: dy},
          useNativeDriver: false,
        }).start(removeTopCard);
      } else {
        Animated.spring(swipe, {
          toValue: {x: 0, y: 0},
          useNativeDriver: false,
          friction: 5,
        }).start();
      }
    },
  });

  const removeTopCard = useCallback(() => {
    setImages(prev => prev.slice(1));
    swipe.setValue({x: 0, y: 0});
  }, [swipe]);

  const handleChoice = useCallback(
    (direction: any) => {
      Animated.timing(swipe.x, {
        toValue: direction * (width * 2),
        duration: 400,
        useNativeDriver: false,
      }).start(removeTopCard);
    },
    [removeTopCard, swipe.x],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.box}>
          <Image source={require('../../../assets/icon/left.png')} style={styles.back}/>
        </TouchableOpacity>
        <Text style={styles.title}>Matching</Text>
        <View style={styles.box}></View>
      </View>
      <View style={[styles.container, {justifyContent: 'center'}]}>
        {images
          .map(({id, name, uri}, index) => {
            const isFirst = index == 0;
            const dragHandlers = isFirst ? panResponder.panHandlers : {};
            return (
              <Card
                key={name}
                id={id}
                name={name}
                uri={uri}
                isFirst={isFirst}
                swipe={swipe}
                {...dragHandlers}
              />
            );
          })
          .reverse()}
      </View>
      <View style={styles.btnContainer}>
        <RoundedButton type={'nope'} func={() => handleChoice(-1)} />
        <RoundedButton heart={true} func={() => handleChoice(1)} />
        <RoundedButton type={'infor'} />
      </View>
    </SafeAreaView>
  );
};
