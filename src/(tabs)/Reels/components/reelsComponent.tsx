import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';

import {Dimensions} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height - 60;

const ReelsComponent = (props: any) => {
  const {
    _id,
    caption,
    share,
    media,
    user,
    muted,
    currentVisible,
    isFocused,
    showBottomSheet,
    likeCount,
    commentCount,
    openComment,
  } = props;
  const navigation = useNavigation<any>();

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num?.toString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.video}>
        <Video
          source={{uri: media[0]?.videoUrl}}
          resizeMode="contain"
          style={{width: '100%', height: '100%'}}
          repeat
          paused={!currentVisible || !isFocused}
          muted={muted}
          maxBitRate={1500000}
          progressUpdateInterval={500}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.block1}>
          <View style={styles.rowContainer}>
            <TouchableOpacity style={styles.imgContainer}>
              <Image style={styles.img} source={{uri: user.profilePic}} />
            </TouchableOpacity>
            <Text style={styles.name}>{user.handleName}</Text>
            <TouchableOpacity style={styles.btnFollow}>
              <Text style={{fontSize: 14, color: Colors.dark.text}}>
                Theo dõi
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.textNormal} numberOfLines={1}>
            {caption}
          </Text>
        </View>
        <View style={styles.block2}>
          <View style={styles.containerVertical}>
            <TouchableOpacity style={styles.iconContainer}>
              <Image
                style={styles.icon}
                source={require('../../../../assets/icon/heart.png')}
              />
            </TouchableOpacity>
            <Text style={styles.textNormal}>{formatNumber(likeCount)}</Text>
          </View>
          <View style={styles.containerVertical}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={openComment}>
              <Image
                style={styles.icon}
                source={require('../../../../assets/icon/comment.png')}
              />
            </TouchableOpacity>
            <Text style={styles.textNormal}>{formatNumber(commentCount)}</Text>
          </View>
          <View style={styles.containerVertical}>
            <TouchableOpacity style={styles.iconContainer}>
              <Image
                style={styles.icon}
                source={require('../../../../assets/icon/share.png')}
              />
            </TouchableOpacity>
            <Text style={styles.textNormal}>{formatNumber(share)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.containerVertical, styles.iconContainer]}
            onPress={showBottomSheet}>
            <Image
              style={styles.icon}
              source={require('../../../../assets/icon/menu-dots-vertical.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconMusicContainer}
            onPress={() => navigation.navigate('SaveMusic')}>
            <Image
              style={styles.icon}
              source={require('../../../../assets/icon/musical-note.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnFollow: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: Colors.light.transparent,
    borderWidth: 1,
    marginLeft: 10,
    borderColor: Colors.light.background,
  },
  textNormal: {
    fontSize: 14,
    color: Colors.light.background,
    marginTop: 5,
  },
  container: {
    position: 'relative',
    width: width,
    height: height,
    backgroundColor: Colors.dark.background,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 25,
    height: 25,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: Colors.dark.text,
  },
  bottomContainer: {
    position: 'absolute',
    width: width,
    bottom: 0,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: Colors.dark.transparent,
  },
  block1: {
    width: '80%',
  },
  imgContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  block2: {
    alignItems: 'center',
  },
  containerVertical: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconMusicContainer: {
    width: 25,
    height: 25,
    padding: 5,
    borderRadius: 2,
    borderColor: Colors.dark.text,
    borderWidth: 1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default ReelsComponent;
