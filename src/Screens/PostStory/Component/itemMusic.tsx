import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {
  addMusicToPlaylist,
  removeMusicFromPlaylist,
} from '../../../../services/bookmarkRedux/bookmarkSlice';
import {
  addToBookmark,
  removeFromBookmark,
} from '../../../../services/musicRedux/musicReducer';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';

type ItemMusicProps = {
  _id: string;
  coverImg: string;
  song: string;
  author: string;
  countVideoUsed?: number;
  onPress?: () => void;
  isBookmarked?: boolean;
};

const ItemMusic = (props: ItemMusicProps) => {
  const {
    _id,
    coverImg,
    song,
    author,
    countVideoUsed = 0,
    onPress,
    isBookmarked,
  } = props;
  const {theme} = useTheme();
  const color = Colors[theme];
  const dispatch = useDispatch<AppDispatch>();
  const {refreshToken} = useSelector((state: RootState) => state.user);
  const {musicList, musicBookmark} = useSelector(
    (state: RootState) => state.music,
  );
  const [isSave, setIsSave] = useState(isBookmarked);
  const {messageError, isError} = useSelector(
    (state: RootState) => state.bookmark,
  );

  useEffect(() => {
    const isNowSaved = musicBookmark.some(item => item._id === _id);
    setIsSave(isNowSaved);
  }, [musicBookmark, _id]);

  const handleBookmark = () => {
    if (isSave) {
      setIsSave(false);
      dispatch(removeMusicFromPlaylist({musicId: _id, refreshToken}))
        .unwrap()
        .then(res => {
          dispatch(removeFromBookmark(_id));
        })
        .catch(res => {
          setIsSave(true);
          if (isError) {
            GlobalAlertManager.show('Thông báo', messageError);
          }
        });
    } else {
      setIsSave(true);
      dispatch(addMusicToPlaylist({musicId: _id, refreshToken}))
        .unwrap()
        .then(res => {
          const currentMusic = musicList.find(item => item._id === _id);
          if (currentMusic) {
            dispatch(addToBookmark(currentMusic));
          }
        })
        .catch(res => {
          setIsSave(false);
          if (isError) {
            GlobalAlertManager.show('Thông báo', messageError);
          }
        });
    }
  };

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

      <TouchableOpacity style={styles.playBlock} onPress={handleBookmark}>
        <Image
          style={[styles.play, {tintColor: isSave ? '#F2C641' : color.text}]}
          source={
            isSave
              ? require('../../../../assets/icon/bookmark_fill.png')
              : require('../../../../assets/icon/bookmark.png')
          }
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
