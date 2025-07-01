import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

interface ItemUnlockProps {
  uri: string;
  handle: string;
  onHandleUnBlock: () => void;
}

const ItemUnlock: React.FC<ItemUnlockProps> = ({
  uri,
  handle,
  onHandleUnBlock,
}) => {
  const {theme} = useTheme();
  const colors = Colors[theme];

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.imgContainer}>
          <Image
            source={{uri}}
            style={[styles.imgMain, {borderColor: colors.gray}]}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            style={[styles.textHandle, {color: colors.text}]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {handle}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.btn, {backgroundColor: colors.primary}]}
        onPress={onHandleUnBlock}>
        <Text style={[styles.textUnBlock, {color: colors.background}]}>
          Bỏ chặn
        </Text>
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
    gap: 15,
    flex: 1,
  },
  imgContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgMain: {
    width: 52,
    height: 52,
    borderWidth: 2,
    borderRadius: 26, 
    resizeMode: 'cover',
  },
  textHandle: {
    fontSize: 14,
    fontWeight: 'bold',
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