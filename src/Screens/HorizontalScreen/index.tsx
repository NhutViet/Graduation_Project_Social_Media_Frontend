import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import BottomTabs from '../../Navigation/BottomTabs';
import { CameraScreen } from '../CameraScreen';
import { useNavigation } from '@react-navigation/native';
import { MessageBox } from '../MessageBox';

const {width} = Dimensions.get('window');

export const HorizontalScreen = () => {
  const navigation = useNavigation();
  const swipe = useRef(new Animated.ValueXY()).current;
  const swipeRight = useRef(new Animated.ValueXY({x: width, y: 0})).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  //lưu index tab
  const [tabIndex, setTabIndex] = useState(0);

  
  const panResponderLeft = PanResponder.create({
    onMoveShouldSetPanResponder: () => {
      return tabIndex === 0;
    },
    onPanResponderMove: (_, { dx }) => {
      if (currentIndex === 0 && dx >= 0) {
        swipe.setValue({ x: dx, y: 0 });
      } else if (currentIndex === 1 && dx <= 0) {
        swipe.setValue({ x: width + dx, y: 0 });
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      const threshold = 120;
      if (gestureState.dx > threshold && currentIndex == 0) {
        Animated.timing(swipe, {
          toValue: { x: width, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => setCurrentIndex(1));
      } else if (gestureState.dx < -threshold && currentIndex == 1) {
        Animated.timing(swipe, {
          toValue: { x: 0, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => setCurrentIndex(0));
      } else {
        Animated.spring(swipe, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 4,
        }).start();
      }
    },
  });

  
  const panResponderRight = PanResponder.create({
    onMoveShouldSetPanResponder: () => {
      return tabIndex === 0;
    },
    onPanResponderMove: (_, { dx }) => {
      if (currentIndex === 0 && dx < 0) {
        swipeRight.setValue({ x: width + dx, y: 0 });
      } else if (currentIndex === -1 && dx > 0) {
        swipeRight.setValue({ x: dx, y: 0 });
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      const threshold = 120;
      if (gestureState.dx < -threshold && currentIndex == 0) {
        Animated.timing(swipeRight, {
          toValue: { x: 0, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => setCurrentIndex(-1));
      } else if (gestureState.dx > threshold && currentIndex == -1) {
        Animated.timing(swipeRight, {
          toValue: { x: width, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => setCurrentIndex(0));
      } else {
        Animated.spring(swipeRight, {
          toValue: currentIndex === -1 ? { x: 0, y: 0 } : { x: width, y: 0 },
          useNativeDriver: false,
          friction: 4,
        }).start();
      }
    },
  });

  const panResponderHome = PanResponder.create({
  onMoveShouldSetPanResponder: () => {
    return tabIndex === 0;
  },
  onPanResponderMove: (_, { dx }) => {
    if (currentIndex === 0) {
      if (dx >= 0) {
        // swipe sang phải (Home -> screen 1)
        swipe.setValue({ x: dx, y: 0 });
      } else {
        // swipe sang trái (Home -> Message)
        swipeRight.setValue({ x: width + dx, y: 0 });
      }
    } else if (currentIndex === 1 && dx <= 0) {
      swipe.setValue({ x: width + dx, y: 0 });
    } else if (currentIndex === -1 && dx >= 0) {
      swipeRight.setValue({ x: dx, y: 0 });
    }
  },
  onPanResponderRelease: (_, gestureState) => {
    const threshold = 120;
    if (currentIndex === 0) {
      if (gestureState.dx > threshold) {
        // Swipe sang phải
        Animated.timing(swipe, {
          toValue: { x: width, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => setCurrentIndex(1));
      } else if (gestureState.dx < -threshold) {
        // Swipe sang trái
        Animated.timing(swipeRight, {
          toValue: { x: 0, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => setCurrentIndex(-1));
      } else {
        // Quay về vị trí ban đầu
        Animated.spring(swipe, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 4,
        }).start();
        Animated.spring(swipeRight, {
          toValue: { x: width, y: 0 },
          useNativeDriver: false,
          friction: 4,
        }).start();
      }
    } else if (currentIndex === 1) {
      if (gestureState.dx < -threshold) {
        Animated.timing(swipe, {
          toValue: { x: 0, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => setCurrentIndex(0));
      } else {
        Animated.spring(swipe, {
          toValue: { x: width, y: 0 },
          useNativeDriver: false,
          friction: 4,
        }).start();
      }
    } else if (currentIndex === -1) {
      if (gestureState.dx > threshold) {
        Animated.timing(swipeRight, {
          toValue: { x: width, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => setCurrentIndex(0));
      } else {
        Animated.spring(swipeRight, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 4,
        }).start();
      }
    }
  },
});


  const animatedHomeScreen = {
    transform: [...swipe.getTranslateTransform()],
  };

  const animatedMessScreen = {
    transform: [...swipeRight.getTranslateTransform()],
  };

  const goBackToHomeFromMessage = () => {
    Animated.timing(swipeRight, {
      toValue: {
        x: width,
        y: 0,
      },
      duration: 200,
      useNativeDriver: false,
    }).start(() => {setCurrentIndex(0)});
  };

  return (
    <View style={{flex: 1}}>
      <Animated.View {...panResponderLeft.panHandlers} style={styles.container}>
        <CameraScreen navigation={navigation}/>
      </Animated.View>
      <Animated.View
        {...panResponderHome.panHandlers}
        style={[
          styles.container,
          {
            backgroundColor: '#237437',
            position: 'absolute',
            zIndex: 1,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
          animatedHomeScreen,
        ]}>
        <BottomTabs onTabChange={setTabIndex}/>
      </Animated.View>
      <Animated.View
        {...panResponderRight.panHandlers}
        style={[
          styles.container,
          {
            backgroundColor: '#386859',
            position: 'absolute',
            zIndex: 2,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
          animatedMessScreen,
        ]}>
          <MessageBox onBack={goBackToHomeFromMessage}/>
      </Animated.View>
    </View>
  );
};

export default HorizontalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 30,
    color: 'white',
  },
});
