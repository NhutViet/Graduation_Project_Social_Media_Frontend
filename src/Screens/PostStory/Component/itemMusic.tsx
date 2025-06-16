import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

const ItemMusic = (props: any) => {
  const {coverImg, song, author, countVideoUsed = 0, onPress} = props;
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftContainer}>
        <View style={styles.imageContainer}>
          <Image style={styles.img} source={{uri: coverImg}} />
        </View>
        <View style={{width: '70%'}}>
          <Text
            style={[styles.text, {color: color.text, fontWeight: 'bold'}]}
            numberOfLines={1}>
            {song}
          </Text>
          <View style={styles.leftContainer}>
            <Text style={[styles.text, {color: color.text}]}>{author} </Text>
            <Text style={[styles.text, {color: color.text}]}>
              · {countVideoUsed} bài đăng
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.playBlock}>
        <Image
          style={[styles.play, {tintColor: color.text}]}
          source={require('../../../../assets/icon/bookmark.png')}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  text: {
    fontSize: 14,
  },
  playBlock: {
    width: 20,
    height: 20,
    borderRadius: 15,
  },
  play: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default ItemMusic;
