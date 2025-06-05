import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { useTheme } from '../../../util/ThemeContext';
import { Colors } from '../../../../assets/color/Colors';

const ItemUnlock = (props: any) => {
    const {uri, handle, onHandleUnBlock} = props;
    const {theme} = useTheme();
    const colors = Colors[theme];
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.imgContainer}>
          <View style={[styles.outCircle, {backgroundColor: colors.lightGray, borderColor: colors.gray}]}/>
          <Image source={{uri: uri}} style={[styles.imgMain, {borderColor: colors.background}]}/>
        </View>
        <View style={{flex: 1}} >
          <Text style={[styles.textHandle, {color: colors.text}]} numberOfLines={1} ellipsizeMode='tail'>{handle}</Text>
          <Text style={[styles.textNote, {color: colors.lightDark}]} numberOfLines={2} ellipsizeMode='tail'>Bao gồm các tài khoản khác mà họ có hoặc có thể tạo</Text>
        </View>
      </View>
      <TouchableOpacity style={[styles.btn, {backgroundColor: colors.primary}]} onPress={onHandleUnBlock}>
        <Text style={[styles.textUnBlock, {color: colors.background}]}>Bỏ chặn</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ItemUnlock;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    leftContainer: {
        flexDirection: 'row',
        gap: 10,
        flex: 1,
    },
    imgContainer: {
        width: 60, height: 60,
    },
    outCircle: {
        width: 50, height: 50,
        borderRadius: 100,
        borderWidth: 1,
    },
    imgMain: {
        width: 52, height: 52,
        borderWidth: 2,
        borderRadius: 100,
        resizeMode: 'cover',
        position: 'absolute',
        bottom: 0, right: 0,
    },
    textHandle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    textNote: {
        fontWeight: '400',
        fontSize: 13,
    },
    btn: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    textUnBlock: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
