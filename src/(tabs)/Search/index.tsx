/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import {FlashList} from '@shopify/flash-list';
import {useTheme} from '../../util/ThemeContext';
import {SearchStyles} from '../../StyleSheet/SearchStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistoryItem from './Components/HistoryItem';
import {Colors} from '../../../assets/color/Colors';
import SearchResult from './Components/SearchResult';
import {useIsFocused} from '@react-navigation/native';
import {RootState} from '../../../services/store';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../../services/store';
import ExploreSection, {ExploreMedia} from './Components/ExploreTile';
import {useDebounce} from 'use-debounce';
import {
  fetchSearchPost,
  fetchSearchUser,
  clearSearchResults,
} from '../../../services/searchRedux/searchSlice';
import {
  selectSearchLoading,
  UserR,
} from '../../../services/searchRedux/searchType';
import User from './Components/User';
import {clearPosts, clearReels} from '@services/searchRedux/searchReducer';
import {fetchMedia} from '@services/SearchPost/searchPostReducer';

const SEARCH_HISTORY_KEY = 'search_history';

export const Search: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const postsData = useSelector((state: RootState) => state.searchPost.items);
  const {
    pagination,
    isLoading: loading,
  } = useSelector((state: RootState) => state.searchPost);
  const {refreshToken} = useSelector((state: RootState) => state.user);
  const {users, isError} = useSelector((state: RootState) => state.search);
  const isLoading = useSelector(selectSearchLoading);

  const theme = useTheme();
  const color = Colors[theme.theme];
  const styles = SearchStyles(theme.theme);

  // Local state
  const [isFocused, setIsFocused] = useState(false);
  const [isShowResult, setIsShowResult] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // Refs
  const inputRef = useRef<TextInput>(null);
  const isFocusedPage = useIsFocused();

  // View tracking
  const [_visibleIndexView1, setVisibleIndexView1] = useState<number | null>(
    null,
  );
  const [visibleIndexView2, setVisibleIndexView2] = useState<number | null>(
    null,
  );

  // Debounced input
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cleanup = useCallback(() => {
    // Cancel ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Clear search state
    dispatch(clearSearchResults());

    // Reset local state
    setSearchText('');
    setIsShowResult(false);
    setIsFocused(false);
  }, [dispatch]);

  // Enhanced search effect with cleanup
  useEffect(() => {
    const keyword = debouncedSearchText.trim();

    if (keyword && keyword !== lastSearch.current) {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      lastSearch.current = keyword;

      dispatch(fetchSearchUser({refreshToken, keyword, mode: 'username'}));
      dispatch(fetchSearchPost({refreshToken, keyword}));
    }

    if (!keyword) {
      lastSearch.current = '';
      dispatch(clearSearchResults());
      dispatch(clearPosts());
      dispatch(clearReels());
    }
  }, [debouncedSearchText, dispatch, refreshToken]);

  // Cleanup on unmount and page blur
  useEffect(() => {
    if (!isFocusedPage) {
      cleanup();
    }
  }, [isFocusedPage, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Fetch posts once
  useEffect(() => {
    dispatch(fetchMedia({page: 1}));
  }, [dispatch]);

  //load more
  const loadMore = useCallback(() => {
    if (pagination && pagination.hasNextPage && !loading) {
      dispatch(fetchMedia({page: pagination.currentPage + 1}));
    }
  }, [pagination, loading, dispatch]);

  const renderFooter = () => {
    if (pagination?.hasNextPage && loading) {
      return (
        <View style={{paddingVertical: 20, alignItems: 'center'}}>
          <ActivityIndicator size="small" color={color.primary} />
        </View>
      );
    }
    return null;
  };

  // Screen dims for grid
  const screenDimensions = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    const SMALL = (screenWidth - 6) / 3;
    const BIG = SMALL * 2 + 2;
    return {SMALL, BIG};
  }, []);

  // Viewability handlers
  const onViewableItemsChangedView1 = useCallback(({viewableItems}: any) => {
    const idx = viewableItems[0]?.index ?? null;
    setVisibleIndexView1(prev => (prev !== idx ? idx : prev));
  }, []);

  const onViewableItemsChangedView2 = useCallback(({viewableItems}: any) => {
    const idx = viewableItems[0]?.index ?? null;
    setVisibleIndexView2(prev => (prev !== idx ? idx : prev));
  }, []);

  const viewabilityConfig = useMemo(
    () => ({viewAreaCoveragePercentThreshold: 50}),
    [],
  );

  // Search API
  const lastSearch = useRef('');
  useEffect(() => {
    const keyword = debouncedSearchText.trim();
    if (keyword && keyword !== lastSearch.current) {
      lastSearch.current = keyword;
      dispatch(fetchSearchUser({refreshToken, keyword, mode: 'username'}));
      dispatch(fetchSearchPost({refreshToken, keyword}));
    }
    if (!keyword) {
      lastSearch.current = '';
    }
  }, [debouncedSearchText, dispatch, refreshToken]);

  // Combine history + users
  const combinedResults = useMemo(() => {
    const keyword = debouncedSearchText.trim().toLowerCase();
    if (keyword && !isLoading && !isError) {
      const hist = searchHistory
        .filter(item => item.toLowerCase().includes(keyword))
        .slice(0, 2);
      const userItems = (users as UserR)?.items || [];
      return [
        ...hist.map((h, i) => ({
          type: 'history',
          value: h,
          id: `history-${i}`,
        })),
        ...userItems.map((u: any, i: any) => ({
          type: 'user',
          value: u,
          id: `user-${u._id || i}`,
        })),
      ];
    }
    return searchHistory.map((h, i) => ({
      type: 'history',
      value: h,
      id: `history-${i}`,
    }));
  }, [debouncedSearchText, searchHistory, users, isLoading, isError]);

  // History persistence
  const loadHistory = useCallback(async () => {
    const raw = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    if (raw) {
      setSearchHistory(JSON.parse(raw));
    }
  }, []);

  const saveHistory = useCallback(async (q: string) => {
    if (!q) {
      return;
    }
    setSearchHistory(prev => {
      const updated = [q, ...prev.filter(x => x !== q)].slice(0, 10);
      AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteHistory = useCallback(async (q: string) => {
    setSearchHistory(prev => {
      const updated = prev.filter(x => x !== q);
      AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Reset on blur
  useEffect(() => {
    if (!isFocusedPage) {
      setIsFocused(false);
      setIsShowResult(false);
      setSearchText('');
    }
  }, [isFocusedPage]);

  // Handlers
  const handleSearchSubmit = useCallback(() => {
    if (!searchText.trim()) {
      return;
    }
    saveHistory(searchText);
    setIsFocused(false);
    setIsShowResult(true);
    inputRef.current?.blur();
  }, [searchText, saveHistory]);

  const handleCancel = useCallback(() => {
    inputRef.current?.blur();
    setIsFocused(false);
    setSearchText('');
  }, []);

  const handleBack = useCallback(() => {
    setIsShowResult(false);
    setSearchText('');
  }, []);

  const renderSearchItem = useCallback(
    ({item}: any) => {
      if (item.type === 'history') {
        return (
          <HistoryItem
            name={item.value}
            onPress={() => {
              setSearchText(item.value);
              saveHistory(item.value);
              setIsFocused(false);
              setIsShowResult(true);
              inputRef.current?.blur();
            }}
            onDelete={() => deleteHistory(item.value)}
          />
        );
      }
      return (
        <User
          id={item.value._id}
          name={item.value.username}
          image={item.value.profilePic}
          handle={item.value.handleName}
        />
      );
    },
    [deleteHistory, saveHistory],
  );

  useEffect(() => {
    if (postsData.length > 0 && isInitializing) {
      setIsInitializing(false);
    }
  }, [postsData, isInitializing]);

  const mediaGroups = useMemo(() => {
    const groups: ExploreMedia[][] = [];
    for (let i = 0; i < postsData.length; i += 5) {
      const group = postsData
        .slice(i, i + 5)
        .filter(post => post.media && post.media.length > 0)
        .map(post => ({
          _id: post._id,
          media: post.media,
        }));

      if (group.length === 5) {
        groups.push(group);
      }
    }
    return groups;
  }, [postsData]);
  // console.log('>>>>>>>>>mediaGroups: ', mediaGroups);
  const renderExploreItem = useCallback(({item, index}: any) => {
    return <ExploreSection media={item} index={index} data={postsData}/>;
  }, [postsData]);

  if (isInitializing) {
    return (
      <SafeAreaView style={[styles.container]}>
        <View
          style={[
            styles.container,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isShowResult && isLoading && (
        <View style={styles.overlay} pointerEvents="auto">
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      )}

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        {isShowResult && (
          <TouchableOpacity onPress={handleBack}>
            <Image
              source={require('../../../assets/icon/left.png')}
              style={[styles.icon, {marginRight: 10}]}
            />
          </TouchableOpacity>
        )}
        <View style={styles.row}>
          <TextInput
            ref={inputRef}
            placeholder="Tìm kiếm..."
            placeholderTextColor={color.text}
            style={styles.search}
            onFocus={() => {
              setIsFocused(true);
              setIsShowResult(false);
            }}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          <Image
            source={require('../../../assets/icon/search.png')}
            style={styles.iconSearch}
          />
        </View>
        {isFocused && (
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.textHuy}>Hủy</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.container}>
        {/* 📍 Hiển thị lịch sử và gợi ý khi đang nhập tìm kiếm */}
        {isFocused && !isShowResult && (
          <View
            style={[
              styles.container,
              {position: 'absolute', top: 0, bottom: 0, left: 0, right: 0},
            ]}>
            {searchText === '' && searchHistory.length > 0 && (
              <View style={styles.rowSpace}>
                <Text style={styles.textGD}>Gần đây</Text>
                <Text style={styles.textAll}>Xem tất cả</Text>
              </View>
            )}
            {searchText !== '' && (
              <HistoryItem
                name={searchText}
                onPress={handleSearchSubmit}
                onDelete={() => {}}
              />
            )}
            <FlashList
              data={combinedResults}
              renderItem={renderSearchItem}
              estimatedItemSize={60}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id}
              removeClippedSubviews
            />
          </View>
        )}

        {/* 📍 Kết quả tìm kiếm */}
        {isShowResult && (
          <View
            style={[
              styles.container,
              {position: 'absolute', top: 0, bottom: 0, left: 0, right: 0},
            ]}>
            <SearchResult
              searchText={debouncedSearchText}
              currentVisibleIndex={visibleIndexView2}
              onViewableItemsChanged={onViewableItemsChangedView2}
              isPause={isShowResult}
            />
          </View>
        )}

        {/* 📍 Mạng lưới media explore */}
        {!isFocused && !isShowResult && (
          <View style={styles.container}>
            <FlashList
              data={mediaGroups}
              keyExtractor={(_, i) => `media-group-${i}`}
              renderItem={renderExploreItem}
              estimatedItemSize={screenDimensions.BIG + 4}
              onViewableItemsChanged={onViewableItemsChangedView1}
              viewabilityConfig={viewabilityConfig}
              removeClippedSubviews
              onEndReached={loadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
              getItemType={() => 'media-group'}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
