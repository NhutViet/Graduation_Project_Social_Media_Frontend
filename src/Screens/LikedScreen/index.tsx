import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList
} from 'react-native';
import React, {useCallback, useState, useEffect, useRef} from 'react';
import {FlashList} from '@shopify/flash-list';
import PostItem from './Components/PostItem';
import {LikedStyles} from '../../StyleSheet/LikedStyles';
import {useTheme} from '../../util/ThemeContext';
import FilterModal from './Components/filter';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeft, ChevronDown} from 'lucide-react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState} from '../../../services/store';
import { getLikedPosts } from '@services/postUserRedux/postUserSlice';
import { unlikePost } from '@services/reactionRedux/reactionSlice';
import { LikedPostItem, TimeRange, SortOrder } from '@services/postUserRedux/postUserType';
import {clearLikedPosts} from '@services/postUserRedux/postUserReducer'
import { Colors } from '@assets/color/Colors';

const Filter = [
  {id: 'sort', label: 'Mới nhất đến cũ nhất'},
  {id: 'date', label: 'Tất cả các ngày'},
  {id: 'content', label: 'Tất cả loại nội dung'},
];

export const LikedScreen = () => {
  const [selected, setSelected] = useState<any[]>([]);
  const {theme} = useTheme();
  const styles = LikedStyles(theme);
  const {currentUser, refreshToken, likedPosts, isLoading} = useSelector((state: RootState) => ({
    currentUser: state.user.user,
    refreshToken: state.user.refreshToken,
    likedPosts: state.postUser.likedPosts,
    isLoading: state.postUser.isLoading,
  }), shallowEqual);

  const dispatch = useDispatch<AppDispatch>();

  // Filter states
  const [filterType, setFilterType] = useState<'date' | 'sort' | 'content'>(
    'date',
  );
  const [isUnlikeMode, setIsUnlikeMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('all');
  const [page, setPage] = useState(1);
  const [timeRange, setTimeRange] = useState<TimeRange | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const [contentFilter, setContentFilter] = useState<'all'|'posts'|'reels'>('all');
  const onEndReachedCalledRef = useRef(false);
  const navigation = useNavigation<any>();

  const prevSort = useRef(sortOrder);
  const prevRange = useRef(timeRange);
  const prevContent = useRef(contentFilter);

  useEffect(() => {
     if (
      prevSort.current !== sortOrder ||
      prevRange.current !== timeRange
    ) {
      setPage(1);
      dispatch(clearLikedPosts());
      prevSort.current = sortOrder;
      prevRange.current = timeRange;
      prevContent.current = contentFilter;
    }
  }, [dispatch, timeRange, sortOrder, contentFilter]);

  useEffect(() => {
    dispatch(getLikedPosts({ page, limit: 18, timeRange, sortOrder, refreshToken }));
  }, [dispatch, page, timeRange, sortOrder, refreshToken, contentFilter]);

  const handleEndReached = useCallback(() => {
    if (!isLoading && likedPosts.pagination.hasNextPage) {
      setPage(p => p + 1);
    }
  }, [isLoading, likedPosts.pagination.hasNextPage]);

  const filtered = React.useMemo(() => {
    return likedPosts.items.filter(i => {
      if (contentFilter === 'all') {
        return i.type === 'post' || i.type === 'reel';
      }
      const typeKey = contentFilter === 'posts' ? 'post' : 'reel';
      return i.type === typeKey;
    });
  }, [likedPosts.items, contentFilter]);
  
  const handleFilterSelect = (filter: string) => {
    switch (filterType) {
      case 'date':
        setSelectedDate(filter as 'all'|'today'|'week'|'month'|'year');
        if(filter === "today") setTimeRange(TimeRange.TODAY);
        else if(filter === "week") setTimeRange(TimeRange.LAST_WEEK);
        else if(filter === "month") setTimeRange(TimeRange.LAST_MONTH);
        else if(filter === "year") setTimeRange(TimeRange.LAST_YEAR);
        else setTimeRange(undefined);
        break;
      case 'sort':
        setSortOrder(filter === "newest" ? SortOrder.DESC : SortOrder.ASC);
        break;
      case 'content':
        setContentFilter(filter as 'all'|'posts'|'reels');
        break;
    }
  };

  const handleItemPress = (item: LikedPostItem) => {
    if (isUnlikeMode) {
      setSelected(prev =>
        prev.some(i => i._id === item._id)
          ? prev.filter(i => i._id !== item._id)
          : [...prev, item]
      );
    } else {
      navigation.navigate('AllPostOfCollection', {
        posts: likedPosts.items,
        targetPostId: item._id!,
        playlistName: 'Bài viết đã thích',
      });
    }
  };

  const onUnlike = useCallback(async () => {
    if (!currentUser) return;

    try {
      const promises = selected.map(item =>
        dispatch(
          unlikePost({
            postId: item._id!,
            refreshToken,
            receiverId: item.userID,
            handleName: currentUser.handleName,
          })
        ).unwrap()
      );

      await Promise.all(promises);

      setSelected([]);
      setPage(1);
      dispatch(clearLikedPosts());
      dispatch(getLikedPosts({ page: 1, limit: 18, timeRange, sortOrder, refreshToken }));
    } catch (err) {
      console.error('Unliking failed', err);
    }
  }, [dispatch, selected, currentUser, refreshToken, timeRange, sortOrder]);

  const data: LikedPostItem[] = likedPosts.items;

  const getFilterLabel = (filterId: 'date' | 'sort' | 'content') => {
    switch (filterId) {
      case 'date':
        switch (timeRange) {
          case TimeRange.TODAY:       return 'Hôm nay';
          case TimeRange.LAST_WEEK:  return 'Tuần trước';
          case TimeRange.LAST_MONTH:  return 'Tháng trước';
          case TimeRange.LAST_YEAR:   return 'Năm trước';
          default:                    return 'Tất cả các ngày';
        }
      case 'sort':
        return sortOrder === SortOrder.DESC
          ? 'Mới nhất đến cũ nhất'
          : 'Cũ nhất đến mới nhất';
      case 'content':
        if (contentFilter === 'all')   return 'Tất cả loại nội dung';
        if (contentFilter === 'posts') return 'Bài đăng';
        if (contentFilter === 'reels') return 'Reels'; 
        return 'Tất cả loại nội dung';
    }
  };

  const toggleUnlikeMode = () => {
    setIsUnlikeMode(prev => {
      const next = !prev;
      if (!next) {
        setSelected([]);
      }
      return next;
    });
  };

  // const filteredData = React.useMemo(() => {
  //   return data.filter(item => {
  //     return item.media && item.media.length > 0;
  //   });
  // }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.title}>Lượt thích</Text>
        <TouchableOpacity onPress={toggleUnlikeMode}>
          <Text style={styles.cancel}>
            {isUnlikeMode ? 'Hủy bỏ thích' : 'Bỏ thích'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.horiContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {Filter.map(item => {
            const label = getFilterLabel(item.id as 'date' | 'sort' | 'content');
            return(
              <TouchableOpacity
                onPress={() => {
                  setFilterType(item.id as 'date' | 'sort' | 'content');
                  setIsModalVisible(true);
                }}
                style={styles.filterContainer}
                key={item.id}>
                <Text style={styles.textFilter}>
                  {label}
                </Text>
                <ChevronDown
                  size={16}
                  color={theme === 'dark' ? '#fff' : '#000'}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FilterModal
        visible={isModalVisible}
        type={filterType}
        onClose={() => setIsModalVisible(false)}
        onSelectFilter={handleFilterSelect}
        selectedFilter={
          filterType === 'date'    ? selectedDate
          : filterType === 'sort'  ? (sortOrder==='desc'?'newest':'oldest')
          : contentFilter
        }
      />

      {isLoading && page === 1 && <ActivityIndicator size="large" color={styles.textFilter.color} style={{marginTop: 20}} />}

      {!isLoading && filtered.length === 0 && page === 1 && (
        <View style={styles.container}>
          <Text style={styles.title}>Chưa có bài nào được thích.</Text>
        </View>
      )}

      {!isLoading && filtered.length > 0 && (
        <SafeAreaView style={styles.container}>
          <FlashList
            data={filtered}
            keyExtractor={item => item._id!}
            numColumns={3}
            estimatedItemSize={200}
            onEndReached={() => {
              if(!onEndReachedCalledRef.current && !isLoading && likedPosts.pagination.hasNextPage){
                handleEndReached();
                onEndReachedCalledRef.current = true;
              }
            }}
            onMomentumScrollBegin={() => {
              onEndReachedCalledRef.current = false;
            }}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              const isSelected = selected.some(
                prev => prev._id === item._id,
              );
              if ((item as any).dummy) return null;
              return (
                <PostItem
                  data={item}
                  onHandle={() => handleItemPress(item)}
                  isSelect={isSelected}
                  showSelect={isUnlikeMode}
                />
              );
            }}
            extraData={[selected, isUnlikeMode]}
          />
        </SafeAreaView>
      )}

      {isUnlikeMode && selected.length > 0 && (
        <TouchableOpacity style={styles.btnUnlike} onPress={onUnlike}>
          <Text style={styles.unlike}>Bỏ thích ({selected.length})</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
