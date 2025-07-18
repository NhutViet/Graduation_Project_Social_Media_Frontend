import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {MoreVertical} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

type ItemListProps = {
  uri: string;
  handle: string;
  name: string;
  onHandleMessage?: () => void;
  isMine?: boolean;
  isAdmin?: boolean;
  id: string;
  isFollow: boolean;
};

const ItemList = (props: ItemListProps) => {
  const {
    uri,
    handle,
    name,
    id,
    isFollow,
    onHandleMessage,
    isMine = false,
    isAdmin = false,
  } = props;
  const {theme} = useTheme();
  const colors = Colors[theme];
  const navigate = useNavigation<any>();
  return (
    <TouchableOpacity style={[styles.container]} onPress={() => {navigate.navigate('ProfileComp', {userID: id})}}>
      <Image source={{uri: uri}} style={styles.avatar} />
      <View style={styles.midContainer}>
        <Text
          style={[styles.message, {color: colors.text}]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {name}
        </Text>
        <Text
          style={[styles.textHandle, {color: colors.textSecondary}]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {isAdmin && 'Admin . '}
          {handle}
        </Text>
      </View>
      {!isMine && (
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.btnContainer, {borderColor: isFollow ? colors.text : 'transparent', backgroundColor: isFollow ? colors.transparent : colors.primary}]}
            onPress={onHandleMessage}>
            <Text style={[styles.message, {color: isFollow ? colors.text : colors.background, fontSize: 14}]}>
              {isFollow ? 'Đã theo dõi' : 'Theo dõi'}
            </Text>
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
