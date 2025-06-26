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
import { Heart, UserRound, X } from 'lucide-react-native';

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
          type == 'nope' ? <X size={33} color={color.black}/> : <UserRound size={33} color={color.black}/>
        )}
        {heart && (
          <Heart size={55} color={color.background} fill={color.background}/>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default RoundedButton;

const styles = StyleSheet.create({});
