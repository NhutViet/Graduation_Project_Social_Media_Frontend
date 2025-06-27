import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';

const Section = (props: any) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  const {title, iconLeft, iconRight, func, backData} = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
      onPress={func}>
      <Image
        source={iconLeft}
        style={{
          width: 24,
          height: 24,
          tintColor: color.text,
          resizeMode: 'contain',
        }}
      />
      <Text
        style={{flex: 1, color: color.text, fontSize: 16, marginLeft: 10}}
        numberOfLines={1}>
        {title}
      </Text>
      {backData && <Text style={{color: color.textSecondary, fontSize: 16, marginRight: 5}}>{backData}</Text>}
      <Image
        source={iconRight}
        style={{
          width: 10,
          height: 20,
          tintColor: color.text,
          resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );
};

export default Section;

const styles = StyleSheet.create({});
