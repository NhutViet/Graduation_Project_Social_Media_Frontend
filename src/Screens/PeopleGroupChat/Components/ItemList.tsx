import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

const ItemList = (props: any) => {
  const {uri, handle, name, onHandleMessage, isMine = false, isAdmin=false} = props;
  const {theme} = useTheme();
  const colors = Colors[theme];
  return (
    <TouchableOpacity style={[styles.container]}>
      <Image source={{uri: uri}} style={styles.avatar} />
      <View style={styles.midContainer}>
        <Text style={[styles.message, {color: colors.text}]} numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
        <Text style={[styles.textHandle, {color: colors.textSecondary}]} numberOfLines={1} ellipsizeMode='tail'>
            {isAdmin && 'Admin . '}
          {handle}
        </Text>
      </View>
      {!isMine && (
        <View style={styles.row}>
          <Image source={require('../../../../assets/icon/ellipsis.png')} style={styles.ellipses}/>
          <TouchableOpacity style={[styles.btnContainer, {borderColor: colors.text}]}>
            <Text style={[styles.message, {color: colors.text, fontSize: 14}]}>Message</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ItemList;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    gap: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    borderRadius: 100,
  },
  midContainer: {
    flex: 1,
  },
  ellipses: {
    width: 25,
    resizeMode: 'contain',
  },
  message: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  textHandle: {
    fontSize: 12,
    fontWeight: '400',
  },
});
