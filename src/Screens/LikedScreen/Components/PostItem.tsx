import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Video from 'react-native-video';
import { useTheme } from '../../../util/ThemeContext';
import { Colors } from '../../../../assets/color/Colors';

const {width} = Dimensions.get('window');

const PostItem = (props: any) => {
    const {theme} = useTheme();
    const color = Colors[theme];
  const {data, onHandle, isSelect} = props;
  return (
    <TouchableOpacity onPress={onHandle} style={{width: (width)/3,
        aspectRatio: 1,}}>
      {(data.image_url.length === 0 && data.video.length > 0) ? (
        <View>
            <Video
          source={{uri: data.video[0]}}
          resizeMode="cover"
          style={[styles.container]}
          muted={true}
          paused={true}
        />
        <Image source={require('../../../../assets/icon/clapperboard.png')} style={[styles.note, {tintColor: color.background}]}/>
        </View>
      ) : (data.image_url.length > 1 || (data.image_url.length > 0 && data.video.length > 0)) ? (
        <View>
            <Image source={{uri: data.image_url[0]}} style={styles.container}/>
            <Image source={require('../../../../assets/icon/gallery.png')} style={[styles.note, {tintColor: color.background}]}/>
        </View>
      ) : (
        <Image source={{uri: data.image_url[0]}} style={styles.container}/>
      )}
      {isSelect ? (
        <Image source={require('../../../../assets/icon/checked.png')} style={[styles.tick, {tintColor: color.text}]}/>
      ) : (
        <View style={[styles.rounded, {borderColor: color.textSecondary}]}/>
      )}
    </TouchableOpacity>
  );
};

export default PostItem;

const styles = StyleSheet.create({
    container: {
        width: (width)/3,
        aspectRatio: 1,
        resizeMode: 'cover',
    },
    rounded: {
        width: 20,
        aspectRatio: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderWidth: 2,
        borderRadius: 100,
        position: 'absolute',
        bottom: 5,
        right: 5,
    },
    tick: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        position: 'absolute',
        bottom: 5,
        right: 5,
        zIndex: 1,
    },
    note: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        position: 'absolute',
        top: 10,
        right: 10,
    },
});
