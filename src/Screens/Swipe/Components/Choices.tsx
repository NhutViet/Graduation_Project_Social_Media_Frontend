import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { useTheme } from '../../../util/ThemeContext';
import { Colors } from '../../../../assets/color/Colors';

const Choices = (props: any) => {
    const {theme} = useTheme();
    const color = Colors[theme];
    const {type} = props;
  return (
    <View style={{
        width: 80, height: 80,
        backgroundColor: color.background,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    }}>
      <Image source={type == 'like' ? require('../../../../assets/icon/heart_fill.png') : require('../../../../assets/icon/close_small.png')} style={{
        width: 40, height: 40,
        resizeMode: 'contain',
        tintColor: type == 'like' ? '#E94057' : color.text,
      }}/>
    </View>
  )
}

export default Choices

const styles = StyleSheet.create({})