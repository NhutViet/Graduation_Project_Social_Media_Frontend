import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import {FlashList} from '@shopify/flash-list';
import {useTheme} from '../../util/ThemeContext';
import {SearchStyles} from '../../StyleSheet/SearchStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistoryItem from './Components/HistoryItem';
import User from '../Home/components/Story';
import {Colors} from '../../../assets/color/Colors';
import SearchResult from './Components/SearchResult';
import {useIsFocused} from '@react-navigation/native';
import {RootState} from '../../../services/store';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPostsWithMedia} from '../../../services/postRedux/postSlice';
import {AppDispatch} from '../../../services/store';
import {Media} from '../../../services/postRedux/postTypes';
import ExploreSection from './Components/ExploreTile';
import {useDebounce} from 'use-debounce';
import { fetchSearchPost, fetchSearchUser } from '../../../services/searchRedux/searchSlice';

const SEARCH_HISTORY_KEY = 'search_history';

export const Search = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const postsData = useSelector((state: RootState) => state.post.posts);
  const {refreshToken} = useSelector((state: RootState) => state.user);
  const {users, isLoading, isError} = useSelector((state: RootState) => state.search);

  const theme = useTheme();
  const color = Colors[theme.theme];
  const styles = SearchStyles(theme.theme);
  
  // State management
  const [isFocused, setIsFocused] = useState(false);
  const [isShowResult, setIsShowResult] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // CRITICAL: Use a ref to track if we've already fetched posts
  const hasInitialized = useRef(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Refs
  const inputRef = useRef<TextInput>(null);
  const isFocusedPage = useIsFocused();

  // Animated values
  const searchOpacity = useRef(new Animated.Value(0)).current;
  const mediaOpacity = useRef(new Animated.Value(1)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;

  // Video handling
  const [visibleIndexView1, setVisibleIndexView1] = useState<number | null>(null);
  const [visibleIndexView2, setVisibleIndexView2] = useState<number | null>(null);

  const [debouncedSearchText] = useDebounce(searchText, 500);

  // FIXED: Only fetch posts once when component mounts
  useEffect(() => {
    if (!hasInitialized.current) {
      console.log('🚀 Fetching posts - INITIALIZATION');
      hasInitialized.current = true;
      dispatch(fetchPostsWithMedia());
    }
  }, [dispatch]);

  // FIXED: Update initialization state when posts arrive
  useEffect(() => {
    if (postsData && postsData.length > 0 && isInitializing) {
      console.log('✅ Posts loaded, initialization complete');
      setIsInitializing(false);
    }
  }, [postsData, isInitializing]);

  // FIXED: Memoize media calculation with stable dependencies
  const postMedia = useMemo(() => {
    if (!postsData || postsData.length === 0) return [];
    
    const media = postsData.flatMap(post => post.media || []);
    console.log('📊 Processing media:', media.length, 'items');
    return media;
  }, [postsData]);

  // FIXED: Memoize media groups with stable dependencies
  const mediaGroups = useMemo(() => {
    if (postMedia.length === 0) return [];
    
    const groups: Media[][] = [];
    for (let i = 0; i < postMedia.length; i += 5) {
      groups.push(postMedia.slice(i, i + 5));
    }
    return groups;
  }, [postMedia]);

  // Memoize screen dimensions
  const screenDimensions = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    const SMALL = (screenWidth - 2 * 3) / 3;
    const BIG = SMALL * 2 + 2;
    return { SMALL, BIG };
  }, []);

  // FIXED: Optimize viewability handlers with useCallback
  const onViewableItemsChangedView1 = useCallback(({viewableItems}: any) => {
    const newIndex = viewableItems.length > 0 ? viewableItems[0].index : null;
    setVisibleIndexView1(prev => prev !== newIndex ? newIndex : prev);
  }, []);

  const onViewableItemsChangedView2 = useCallback(({viewableItems}: any) => {
    const newIndex = viewableItems.length > 0 ? viewableItems[0].index : null;
    setVisibleIndexView2(prev => prev !== newIndex ? newIndex : prev);
  }, []);

  const viewabilityConfig = useMemo(() => ({
    viewAreaCoveragePercentThreshold: 50
  }), []);

  // FIXED: Search API calls - prevent duplicate calls
  const lastSearchText = useRef('');
  useEffect(() => {
    if (debouncedSearchText.trim().length > 0 && debouncedSearchText !== lastSearchText.current) {
      console.log('🔍 Searching for:', debouncedSearchText);
      lastSearchText.current = debouncedSearchText;
      
      dispatch(fetchSearchUser({refreshToken, keyword: debouncedSearchText, mode: 'username'}));
      dispatch(fetchSearchPost({refreshToken, keyword: debouncedSearchText}));
    } else if (debouncedSearchText.trim().length === 0) {
      lastSearchText.current = '';
    }
  }, [debouncedSearchText, dispatch, refreshToken]);

  // FIXED: Optimize combined results with stable dependencies
  const combinedResults = useMemo(() => {
    if (debouncedSearchText.trim().length > 0 && !isLoading && !isError) {
      const filteredHistory = searchHistory.filter((historyItem: string) =>
        historyItem.toLowerCase().includes(debouncedSearchText.trim().toLowerCase()),
      );

      const userItems = (users as any)?.items || [];

      return [
        ...filteredHistory.map((item, index) => ({type: 'history', value: item, id: `history-${index}`})),
        ...userItems.map((item: any, index: number) => ({type: 'user', value: item, id: `user-${item._id || index}`})),
      ];
    } else {
      return searchHistory.map((item, index) => ({type: 'history', value: item, id: `history-${index}`}));
    }
  }, [debouncedSearchText, users, searchHistory, isLoading, isError]);

  // Search history functions with useCallback
  const loadSearchHistory = useCallback(async () => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Load search history error:', error);
    }
  }, []);

  const saveSearchHistory = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setSearchHistory(prevHistory => {
      const updatedHistory = [
        query,
        ...prevHistory.filter(item => item !== query),
      ].slice(0, 10); // Limit to 10 items

      // Save to AsyncStorage
      AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory))
        .catch(error => console.error('Save search history error:', error));

      return updatedHistory;
    });
  }, []);

  const deleteHistoryItem = useCallback(async (query: string) => {
    setSearchHistory(prevHistory => {
      const updatedHistory = prevHistory.filter(item => item !== query);
      
      // Save to AsyncStorage
      AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory))
        .catch(error => console.error('Delete history item error:', error));

      return updatedHistory;
    });
  }, []);

  // Load search history on mount
  useEffect(() => {
    loadSearchHistory();
  }, [loadSearchHistory]);

  // FIXED: Animation effects with proper dependencies
  useEffect(() => {
    const animations = [
      Animated.timing(searchOpacity, {
        toValue: isFocused && !isShowResult ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(mediaOpacity, {
        toValue: isFocused || isShowResult ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(resultOpacity, {
        toValue: isShowResult ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start();
  }, [isFocused, isShowResult, searchOpacity, mediaOpacity, resultOpacity]);

  // Reset state when page loses focus
  useEffect(() => {
    if (!isFocusedPage) {
      setIsFocused(false);
      setIsShowResult(false);
      setSearchText('');
    }
  }, [isFocusedPage]);

  // FIXED: Render functions with proper key extraction
  const renderSearchItem = useCallback(({item}: any) => {
    if (item.type === 'history') {
      return (
        <HistoryItem
          name={item.value}
          deleteFunc={() => deleteHistoryItem(item.value)}
          func={() => {
            setSearchText(item.value);
            saveSearchHistory(item.value);
            setIsFocused(false);
            setIsShowResult(true);
            inputRef.current?.blur();
          }}
        />
      );
    } else {
      return (
        <User
          name={item.value.username}
          image={item.value.profilePic}
          status={item.value.status}
          isStory={false}
        />
      );
    }
  }, [deleteHistoryItem, saveSearchHistory]);

  const renderExploreItem = useCallback(({item, index}: any) => (
    <ExploreSection
      media={item}
      index={index}
      isPause={isFocused || isShowResult}
      isFocused={isFocused}
      isFocusedPage={isFocusedPage}
      currentVisibleIndex={visibleIndexView1}
    />
  ), [isFocused, isShowResult, isFocusedPage, visibleIndexView1]);

  const handleSearchSubmit = useCallback(() => {
    if (searchText.trim()) {
      saveSearchHistory(searchText);
      setIsFocused(false);
      setIsShowResult(true);
      inputRef.current?.blur();
    }
  }, [searchText, saveSearchHistory]);

  const handleCancel = useCallback(() => {
    inputRef.current?.blur();
    setIsFocused(false);
    setSearchText('');
  }, []);

  const handleBackFromResult = useCallback(() => {
    setIsShowResult(false);
    setSearchText('');
  }, []);

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <SafeAreaView style={[styles.container]}>
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.searchContainer}>
        {isShowResult && (
          <TouchableOpacity onPress={handleBackFromResult}>
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
        {/* Search History/Results */}
        <Animated.View
          pointerEvents={isFocused && !isShowResult ? 'auto' : 'none'}
          style={[
            styles.container,
            {
              opacity: searchOpacity,
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            },
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
              func={handleSearchSubmit}
            />
          )}
          <FlashList
            data={combinedResults}
            renderItem={renderSearchItem}
            estimatedItemSize={60}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            removeClippedSubviews={true}
          />
        </Animated.View>

        {/* Search Results */}
        <Animated.View
          pointerEvents={isShowResult ? 'auto' : 'none'}
          style={[
            styles.container,
            {
              opacity: resultOpacity,
              position: 'absolute',
              right: 0,
              left: 0,
              top: 0,
              bottom: 0,
            },
          ]}>
          <SearchResult
            searchText={debouncedSearchText}
            currentVisibleIndex={visibleIndexView2}
            onViewableItemsChanged={onViewableItemsChangedView2}
            isPause={isShowResult}
          />
        </Animated.View>

        {/* Media Grid */}
        <Animated.View
          style={[styles.container, {opacity: mediaOpacity}]}
          pointerEvents={isFocused || isShowResult ? 'none' : 'auto'}>
          <FlashList
            data={mediaGroups}
            keyExtractor={(_, index) => `media-group-${index}`}
            renderItem={renderExploreItem}
            estimatedItemSize={screenDimensions.BIG + 4}
            onViewableItemsChanged={onViewableItemsChangedView1}
            viewabilityConfig={viewabilityConfig}
            removeClippedSubviews={true}
            getItemType={() => 'media-group'}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};