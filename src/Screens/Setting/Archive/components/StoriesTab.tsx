import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../../../../assets/color/Colors';
import {useTheme} from '../../../../util/ThemeContext';
import Video from 'react-native-video';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../../services/store';
import {fetchGetPostedSotry} from '../../../../../services/StoryRedux/StorySlice';
import {History, CircleFadingArrowUp, Play} from 'lucide-react-native';
import {handleHighlightPress} from '../../../../(tabs)/Home/util/index';
import { SearchSkeletonGrid } from '../../../../../components/SkeletonGrid';

const formatMonthText = (dateString?: string): string => {
  if (!dateString) return '--\n--';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '--\n--';

  const months = [
    'TH1',
    'TH2',
    'TH3',
    'TH4',
    'TH5',
    'TH6',
    'TH7',
    'TH8',
    'TH9',
    'TH10',
    'TH11',
    'TH12',
  ];
  return `${date.getDate()}\n${months[date.getMonth()]}`;
};

const {width} = Dimensions.get('window');
const ITEM_SIZE = width / 3;

const StoriesTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {myStories, loading} = useSelector((state: RootState) => state.stories);
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const user = useSelector((state: RootState) => state.user.user);
  const storyDetails = useSelector(
    (state: RootState) => state.stories.storyDetails,
  );

  useEffect(() => {
    dispatch(fetchGetPostedSotry());
    console.log('📦 myStories fetched:', myStories);
  }, []);

  const [isPause, setIsPause] = useState<boolean>(true);

  const renderItem = ({item}: {item: any}) => {
    const handleOpenStory = (item: any) => {
      console.log('🟢 Nhấn vào story ID:', item._id);

      if (!user) {
        console.warn('⚠️ Không có thông tin user!');
        return;
      }

      const mockUserItem = {
        _id: user._id,
        handleName: user.handleName,
        profilePic: user.profilePic,
        username: user.username,
        stories: [item._id],
      };

      handleHighlightPress(
        {
          ...mockUserItem,
          storyIds: [item._id],
        },
        dispatch,
        navigation,
        user,
        true,
      );
    };
    return (
      <View style={[styles.itemContainer, {backgroundColor: color.black}]}>
        <Pressable onPress={() => handleOpenStory(item)}>
          {item.mediaUrl ? (
            item.mediaUrl.endsWith('.mp4') ? (
              <TouchableOpacity onPress={() => setIsPause(!isPause)}>
                <Video
                  source={{uri: item.mediaUrl}}
                  style={styles.media}
                  resizeMode="contain"
                  repeat={false}
                  paused={isPause}
                />
                {isPause && (
                  <Play size={14} style={styles.playButtonOverlay} />
                )}
              </TouchableOpacity>
            ) : (
              <Image source={{uri: item.mediaUrl}} style={styles.media} />
            )
          ) : null}
        </Pressable>
        <View style={[styles.dateBadge, {backgroundColor: color.background}]}>
          <Text style={[styles.dateText, {color: color.text}]}>
            {formatMonthText(item.createdAt)}
          </Text>
        </View>
        {item.saved && (
          <TouchableOpacity style={styles.heartIcon}>
            <CircleFadingArrowUp color={color.text} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SearchSkeletonGrid itemWidth={115} itemHeight={230}/>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      {myStories.length > 0 ? (
        <FlatList
          data={[...myStories].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          numColumns={3}
          contentContainerStyle={{paddingBottom: 16}}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{
            height: '90%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 65,
            backgroundColor: color.background,
          }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderWidth: 1,
              borderRadius: 80,
              borderColor: color.text,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <History size={70} color={color.text} />
          </View>
          <Text
            style={{
              fontSize: 19,
              fontWeight: 'bold',
              color: color.text,
              marginVertical: 10,
            }}>
            Thêm vào tin của bạn
          </Text>
          <Text
            style={{fontSize: 15, color: color.secondary, textAlign: 'center'}}>
            Sử dụng kho lưu trữ để giữ lại các tin của bạn khi chúng biến mất để
            sau này có thể ôn lại kỷ niệm. Chỉ bạn mới xem được nội dung trong
            kho lưu trữ của mình.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default StoriesTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 2,
    margin: 1,
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  dateBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 17,
    textAlign: 'center',
  },
  heartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
  },
  icon: {
    width: 16,
    height: 16,
  },
  note: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonOverlay: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    top: (Dimensions.get('window').height * 50 / 100 - 20),
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 25,
  },
});
