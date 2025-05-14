import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef} from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

const RoundedButton = (props: any) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const {type, func, heart} = props;

  //animated
  const scale = useRef(new Animated.Value(1)).current;

  const animatedScale = useCallback((newValue: any) => {
    Animated.spring(scale, {
        toValue: newValue,
        friction: 4,
        useNativeDriver: false,
    }).start();
  }, [scale]);

  return (
    <TouchableOpacity onPress={func}
    onPressIn={() => animatedScale(0.8)}
    delayPressIn={0}
    onPressOut={() => animatedScale(1)}
    delayPressOut={110}>
      <Animated.View style={[{
        width: heart ? 110 : 80,
        height: heart ? 110 : 80,
        backgroundColor: heart ? '#E94057' : '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 200,
        // Shadow for iOS
        shadowColor: color.text,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,

        // Shadow for Android
        elevation: 2, // số càng cao, bóng càng rõ

        //animated
        transform: [{scale}]
      }]}>
        {type && (
          <Image
            source={
              type == 'nope'
                ? require('../../../../assets/icon/close_small.png')
                : require('../../../../assets/icon/infor_user.png')
            }
            style={{
              width: 33,
              height: 33,
              resizeMode: 'contain',
              tintColor: color.black,
            }}
          />
        )}
        {heart && (
          <Image
            source={require('../../../../assets/icon/heart_fill.png')}
            style={{
              width: 55,
              height: 55,
              resizeMode: 'contain',
              tintColor: color.background,
            }}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default RoundedButton;

const styles = StyleSheet.create({});
