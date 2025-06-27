import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import {FlashList} from '@shopify/flash-list';
import PostItem from './Components/PostItem';
import {LikedStyles} from '../../StyleSheet/LikedStyles';
import {useTheme} from '../../util/ThemeContext';
import FilterModal from './Components/filter';
import {useNavigation} from '@react-navigation/native';
import { ChevronLeft, ChevronDown } from 'lucide-react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState} from '../../../services/store';
import { getLikedPosts } from '@services/postUserRedux/postUserSlice';
import { unlikePost } from '@services/reactionRedux/reactionSlice';
import { LikedPostItem } from '@services/postUserRedux/postUserType';

const Filter = [
  {id: 'sort', label: 'Mới nhất đến cũ nhất'},
  {id: 'date', label: 'Tất cả các ngày'},
  {id: 'content', label: 'Tất cả loại nội dung'},
];

export const LikedScreen = () => {
  const [selected, setSelected] = useState<any[]>([]);
  const {theme} = useTheme();
  const styles = LikedStyles(theme);
  const {refreshToken, likedPosts, isLoading} = useSelector((state: RootState) => ({
    refreshToken: state.user.refreshToken,
    likedPosts: state.postUser.likedPosts,
    isLoading: state.postUser.isLoading,
  }), shallowEqual);

  const dispatch = useDispatch<AppDispatch>();

  // Filter states
  const [filterType, setFilterType] = useState<'date' | 'sort' | 'content'>(
    'date',
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedContents, setSelectedContents] = useState<string[]>([]);
  const navigation = useNavigation();

  const handleFilterSelect = (filter: string) => {
    switch (filterType) {
      case 'date':
        setSelectedDate(filter);
        break;
      case 'sort':
        setSortOrder(filter);
        break;
      case 'content':
        setSelectedContents(filter.split(','));
        break;
    }
  };

  useEffect(() => {
    dispatch(getLikedPosts({refreshToken}));
  }, [dispatch, refreshToken]);

  const onHandleSelect = useCallback(
    (item: any) => {
      setSelected(prev => {
        if (prev.some(i => i._id === item._id)) {
          return prev.filter(i => i._id !== item._id);
        }
        return [...prev, item];
      });
    },
    []
  );

  const onUnlike = () => {
    selected.forEach(item => {
      dispatch(unlikePost({postId: item._id, refreshToken}));
      console.log(item._id);
    });
    setSelected([]);
    // refetch
    dispatch(getLikedPosts({refreshToken}));
  };

  const data: LikedPostItem[] = likedPosts.items;

  const filterData = useCallback(() => {
    if (!data || data.length === 0) return [];

    let filteredData = [...data];

    switch (filterType) {
      case 'sort': {
        filteredData.sort((a, b) => {
          const dateA = new Date(a.likedAt).getTime();
          const dateB = new Date(b.likedAt).getTime();
          return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
        break;
      }
      case 'date': {
        const now = new Date();
        filteredData = filteredData.filter(item => {
          const likedDate = new Date(item.likedAt);
          if (selectedDate === 'week') {
            const lastWeek = new Date();
            lastWeek.setDate(now.getDate() - 7);
            return likedDate >= lastWeek && likedDate <= now;
          }
          if (selectedDate === 'month') {
            const lastMonth = new Date();
            lastMonth.setMonth(now.getMonth() - 1);
            return likedDate >= lastMonth && likedDate <= now;
          }
          if (selectedDate === 'year') {
            const lastYear = new Date();
            lastYear.setFullYear(now.getFullYear() - 1);
            return likedDate >= lastYear && likedDate <= now;
          }
          return true; // 'all'
        });
        break;
      }
      case 'content': {
        filteredData = filteredData.filter(item =>
          selectedContents.includes(item.type)
        );
        break;
      }
    }

    return filteredData;
  }, [data, filterType, sortOrder, selectedDate, selectedContents]);

  const filteredData = filterData();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={styles.iconBack.tintColor}/>
        </TouchableOpacity>
        <Text style={styles.title}>Lượt thích</Text>
        <TouchableOpacity onPress={() => setSelected([])}>
          <Text style={styles.cancel}>Hủy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.horiContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {Filter.map(item => (
            <TouchableOpacity
              onPress={() => {
                setFilterType(item.id as 'date' | 'sort' | 'content');
                setIsModalVisible(true);
              }}
              style={styles.filterContainer}
              key={item.id}>
              <Text style={styles.textFilter}>{item.label}</Text>
              <ChevronDown color={styles.iconBack.tintColor}/>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FilterModal
        visible={isModalVisible}
        type={filterType}
        onClose={() => setIsModalVisible(false)}
        onSelectFilter={handleFilterSelect}
        selectedFilter={
          filterType === 'date'
            ? selectedDate
            : filterType === 'sort'
            ? sortOrder
            : ''
        }
        multiSelect={filterType === 'content'}
        selectedItems={filterType === 'content' ? selectedContents : []}
        onApply={items => {
          if (filterType === 'content') {
            setSelectedContents(items);
          }
        }}
      />

      {isLoading && <ActivityIndicator size="large" color={styles.textFilter.color} style={{marginTop: 20}} />}

      {!isLoading && data.length === 0 && (
        <View style={styles.container}>
          <Text style={styles.title}>Chưa có bài nào được thích.</Text>
        </View>
      )}

      {!isLoading && data.length > 0 && filteredData.length > 0 && (
        <View style={styles.container}>
          <FlashList
            data={data}
            numColumns={3}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              const isSelect = selected.some(i => i._id === item._id);
              return (
                <PostItem
                  data={item}
                  onHandle={() => onHandleSelect(item)}
                  isSelect={isSelect}
                />
              );
            }}
            extraData={selected}
          />
        </View>
      )}
      
      {selected.length > 0 && (
        <View style={styles.unlikeContainer}>
          <TouchableOpacity style={styles.horiContainer} onPress={onUnlike}>
            <Text style={styles.unlike}>Bỏ thích ({selected.length})</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
