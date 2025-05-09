import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';
import {Colors} from '../assets/color/Colors';
import {useTheme} from '../src/util/ThemeContext';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

const ItemHome = (props: any) => {
  const {
    id,
    uriVideo,
    img,
    imgUser,
    name,
    like,
    comment,
    share,
    title,
    date,
    currentVisible,
    modalizeRef,
    setCurrentPost,
    isFocused,
  } = props;

  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const [muted, setMuted] = useState(true);

  // hàm chuyển đổi
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  };

  return (
    <View style={{width: '100%', marginTop: 10}}>
      <View style={styles.container}>
        <View style={styles.video}>
          {uriVideo ? (
            <Video
              source={{uri: uriVideo}}
              resizeMode="cover"
              style={{width: '100%', height: '100%'}}
              repeat
              paused={currentVisible !== id || !isFocused}
              muted={muted}
            />
          ) : (
            <>
              <View style={styles.blockWhite}></View>
              <Image
                source={{uri: img}}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
              />
            </>
          )}
        </View>
        <View style={styles.headerItem}>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.blockImg}
              onPress={() => {
                navigation.navigate('InfoUser', {id});
              }}>
              <Image style={styles.imgUser} source={{uri: imgUser}} />
            </TouchableOpacity>
            <View>
              <Text
                style={[
                  styles.textNormal,
                  {color: uriVideo ? Colors.dark.text : color.text},
                ]}>
                {name}
              </Text>
              <Text
                style={[
                  styles.text,
                  {color: uriVideo ? Colors.dark.text : color.text},
                ]}>
                Gợi ý cho bạn
              </Text>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={[
                styles.btnFollow,
                {
                  borderColor: uriVideo ? Colors.light.background : color.text,
                },
              ]}>
              <Text
                style={[
                  styles.textNormal,
                  {color: uriVideo ? Colors.dark.text : color.text},
                ]}>
                Theo dõi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                style={{
                  tintColor: uriVideo ? Colors.light.background : color.text,
                }}
                source={require('../assets/icon/menu-dots-vertical.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.muteButton}
          onPress={() => setMuted(!muted)}>
          <Image
            source={
              muted
                ? require('../assets/icon/mute.png')
                : require('../assets/icon/volume.png')
            }
            style={{width: 24, height: 24, tintColor: Colors.dark.text}}
          />
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: color.background, padding: 10}}>
        <View style={[styles.rowContainer, {justifyContent: 'space-between'}]}>
          <View style={styles.rowContainer}>
            <TouchableOpacity style={styles.iconBlock}>
              <Image
                style={[{tintColor: color.text}, styles.icon]}
                source={require('../assets/icon/heart.png')}
              />
            </TouchableOpacity>
            <Text
              style={{color: color.text, marginLeft: 8, marginRight: 16}}
              onPress={() => {
                modalizeRef?.current?.open();
              }}>
              {formatNumber(like)}
            </Text>
            <TouchableOpacity style={styles.iconBlock}>
              <Image
                style={[{tintColor: color.text}, styles.icon]}
                source={require('../assets/icon/comment.png')}
              />
            </TouchableOpacity>
            <Text style={{color: color.text, marginLeft: 8, marginRight: 16}}>
              {formatNumber(comment)}
            </Text>
            <TouchableOpacity style={styles.iconBlock}>
              <Image
                style={[{tintColor: color.text}, styles.icon]}
                source={require('../assets/icon/share.png')}
              />
            </TouchableOpacity>
            <Text style={{color: color.text, marginLeft: 8, marginRight: 16}}>
              {formatNumber(share)}
            </Text>
          </View>
          <TouchableOpacity style={styles.iconBlock}>
            <Image
              style={[{tintColor: color.text}, styles.icon]}
              source={require('../assets/icon/bookmark.png')}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.title, {color: color.text}]}>{title}</Text>
        <Text style={{color: color.text, fontSize: 12}}>{date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  video: {
    width: '100%',
    height: 600,
  },
  headerItem: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.light.transparent,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
  },
  imgUser: {
    width: '100%',
    height: '100%',
  },
  textNormal: {
    fontSize: 14,
  },
  text: {
    fontSize: 12,
  },
  btnFollow: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.light.transparent,
    borderWidth: 1,
    borderColor: Colors.light.background,
    marginRight: 10,
  },
  iconBlock: {
    width: 24,
    height: 24,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  title: {
    marginVertical: 10,
    fontSize: 14,
  },
  muteButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  blockWhite: {
    width: '100%',
    height: 60,
    backgroundColor: Colors.light.transparent,
  },
});

export default ItemHome;
