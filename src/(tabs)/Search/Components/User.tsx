import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../../../src/util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';

interface UserProps {
  id?: string;
  name?: string;
  image?: string;
  handle?: string;
}

const User = (props: UserProps) => {
  const {id, name, image, handle} = props;
  const {theme} = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 24,
        marginVertical: 10,
        gap: 10,
      }}
      onPress={() => {
        navigation.navigate('ProfileComp', {userID: id, handleName: handle});
      }}>
      <Image
        source={{uri: image}}
        style={{
          width: 40,
          height: 40,
          resizeMode: 'cover',
          borderRadius: 100,
        }}
      />
      <View style={{flex: 1}}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: colors.text,
          }}>
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
    </TouchableOpacity>
  );
};

export default User;

const styles = StyleSheet.create({});
