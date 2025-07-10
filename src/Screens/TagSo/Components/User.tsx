import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../../../src/util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

export interface UserProps {
  image: string;
  name: string;
  handle: string;
  isDelete?: boolean;
  func: () => void;
}

const User = (props: UserProps) => {
  const {theme} = useTheme();
  const colors = Colors[theme];
  const {image, name, handle, isDelete, func} = props;
  return (
    <TouchableOpacity
      style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10}}
      onPress={() => {
        if(!isDelete){
          func();
        }
      }}>
      <Image
        source={{uri: image}}
        style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 100, borderColor: colors.border, borderWidth: 0.5}}
      />
      <View style={{flex: 1}}>
        <Text style={{fontSize: 14, fontWeight: '500', color: colors.text}}>
          {name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '400',
            color: colors.textSecondary,
          }}>
          {handle}
        </Text>
      </View>
      {isDelete && (
        <TouchableOpacity onPress={func}>
        <Image source={require('../../../../assets/icon/closer.png')} style={{width: 10, height: 10, tintColor: colors.textSecondary, resizeMode: 'contain'}}/>
      </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default User;

const styles = StyleSheet.create({});
