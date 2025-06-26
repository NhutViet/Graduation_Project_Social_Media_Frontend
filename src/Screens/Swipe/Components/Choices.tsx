import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { useTheme } from '../../../util/ThemeContext';
import { Colors } from '../../../../assets/color/Colors';
import { X, Heart } from 'lucide-react-native';

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
      {type == 'like' ? <Heart size={40} color={"E94057"} fill={"E94057"}/> : <X size={40} color={color.text}/>}
    </View>
  )
}

export default Choices

const styles = StyleSheet.create({})