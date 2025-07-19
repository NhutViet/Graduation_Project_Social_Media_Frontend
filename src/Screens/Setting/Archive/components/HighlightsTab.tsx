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
import React, {useEffect, useCallback, useState} from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../../../../assets/color/Colors';
import {useTheme} from '../../../../util/ThemeContext';
import {Archive} from 'lucide-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@services/store';
import {fetchHighlightStory} from '@services/StoryRedux/StorySlice';
import {clearHighlightStories} from '@services/StoryRedux/StoryReducer';
import {handleHighlightPress as handleHighlightPressUtil} from '../../../../(tabs)/Home/util/index';
import { SearchSkeletonGrid } from '../../../../../components/SkeletonGrid';
import LoadingModal from '../../../../../components/Global/LoadingModal';

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
const ITEM_SIZE = (width - 32) / 3; // Trừ đi padding và khoảng cách

const HighlightsTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {highlightStories, loading} = useSelector(
    (state: RootState) => state.stories,
  );
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [itemLoading, setItemLoading] = useState(false);

  // Fetch highlight stories when component mounts and when focused
  useFocusEffect(
    useCallback(() => {
      if (currentUser?._id) {
        dispatch(fetchHighlightStory({userId: currentUser._id}));
      }
    }, [dispatch, currentUser?._id]),
  );

  // Clear highlight stories when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearHighlightStories());
    };
  }, [dispatch]);

  const handleHighlightPress = useCallback(
    async (highlight: any) => {
      if (!currentUser) return;

      setItemLoading(true);
      try {
        await handleHighlightPressUtil(
          {
            ...highlight,
            storyIds: highlight.storyId || [],
          },
          dispatch,
          navigation,
          currentUser,
          true, // isOwner = true since this is user's own highlights
          highlightStories,
        );
      } catch (error) {
        console.error('Error handling highlight press:', error);
      } finally {
        setItemLoading(false);
      }
    },
    [currentUser, dispatch, navigation, highlightStories],
  );

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={[styles.itemContainer, {backgroundColor: color.black}]}>
        <Pressable onPress={() => handleHighlightPress(item)}>
          <Image 
            source={
              item.thumbnail
                ? {uri: item.thumbnail}
                : require('../../../../../assets/icon/logo.png')
            }
            style={styles.media}
            resizeMode="cover"
          />
        </Pressable>
        <View style={[styles.titleBadge, {backgroundColor: color.background}]}>
          <Text style={[styles.titleText, {color: color.text}]} numberOfLines={1}>
            {item.collectionName || 'Untitled'}
          </Text>
        </View>
        <View style={[styles.dateBadge, {backgroundColor: color.background}]}>
          <Text style={[styles.dateText, {color: color.text}]}>
            {formatMonthText(item.createdAt)}
          </Text>
        </View>
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
      {highlightStories && highlightStories.length > 0 ? (
        <FlatList
          data={highlightStories}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          numColumns={3}
          contentContainerStyle={{paddingBottom: 16, paddingHorizontal: 8}}
          columnWrapperStyle={{justifyContent: 'flex-start'}}
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
            <Archive size={70} color={color.text} />
          </View>
          <Text
            style={{
              fontSize: 19,
              fontWeight: 'bold',
              color: color.text,
              marginVertical: 10,
            }}>
            Chưa lưu trữ tin nổi bật nào
          </Text>
          <Text
            style={{fontSize: 15, color: color.secondary, textAlign: 'center'}}>
            Tin nổi bật mà bạn lưu trữ sẽ hiển thị ở đây. Chỉ bạn mới xem được các
            tin này.
          </Text>
        </View>
      )}
      
      {itemLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingModal withBackdrop={false} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HighlightsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 2,
    marginBottom: 8,
    marginHorizontal:4,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  titleBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  titleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  dateBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 17,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
