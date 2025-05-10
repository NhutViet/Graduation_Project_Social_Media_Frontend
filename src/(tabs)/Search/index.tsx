import {
  Animated,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import {useTheme} from '../../util/ThemeContext';
import {SearchStyles} from '../../StyleSheet/SearchStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistoryItem from './Components/HistoryItem';
import User from '../../../components/User';
import GridMedia from './Components/GridMedia';
import {Colors} from '../../../assets/color/Colors';
import SearchResult from './Components/SearchResult';
import {Key} from 'lucide-react-native';
import { useIsFocused } from '@react-navigation/native';

const generateImages = (count: number) =>
  Array.from({length: count}, (_, i) => ({
    id: `${i}`,
    uri: 'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
  }));

const dataUser = [
  {
    id: 1,
    name: 'user1',
    image:
      'https://i.pinimg.com/736x/b7/25/61/b72561fd1ec7018c0418c84a3c2d5a57.jpg',
    status: 1,
  },
  {
    id: 2,
    name: 'user2',
    image:
      'https://i.pinimg.com/736x/c1/70/e8/c170e84663405785c80ba367cd5e3b85.jpg',
    status: 1,
  },
  {
    id: 3,
    name: 'user3',
    image:
      'https://i.pinimg.com/736x/8b/ae/77/8bae77c63f046f5a307a864a9d230da2.jpg',
    status: 0,
  },
  {
    id: 4,
    name: 'user4',
    image:
      'https://i.pinimg.com/736x/56/81/64/5681646985e7ddc1b2cd4b826763b541.jpg',
    status: 0,
  },
];

const SEARCH_HISTORY_KEY = 'search_history';

export const Search = () => {
  const theme = useTheme();
  const color = Colors[theme.theme];
  const [images, setImages] = useState(generateImages(20));
  const styles = SearchStyles(theme.theme);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [isShowResult, setIsShowResult] = useState(false);
  const isFocusedPage = useIsFocused();

  //animated value cho opacity ẩn hiện
  const searchOpacity = useRef(new Animated.Value(0)).current;
  const mediaOpacity = useRef(new Animated.Value(1)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;

  // Xử lý video
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number | null>(
    null,
  );

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentVisibleIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {viewAreaCoveragePercentThreshold: 50};

  // Tải thêm ảnh
  const loadMore = () => {
    const newImages = generateImages(images.length + 20);
    setImages(newImages);
  };

  const numBlocks = Math.ceil(images.length / 3);
  const data = Array.from({length: numBlocks}, (_, index) => index);

  // Xử lý tìm kiếm
  const [searchText, setSearchText] = useState('');
  const [combinedResults, setCombinedResults] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Tải lịch sử tìm kiếm
  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error(
        'Screens/Search/index_line_118: Load search history: ',
        error,
      );
    }
  };

  // Lưu lịch sử tìm kiếm
  const saveSearchHistory = async (query: string) => {
    if (!query.trim()) return;

    let updatedHistory = [
      query,
      ...searchHistory.filter(item => item !== query),
    ];
    if (updatedHistory.length > 10) {
      updatedHistory = updatedHistory.slice(0, 10);
    }

    setSearchHistory(updatedHistory);
    await AsyncStorage.setItem(
      SEARCH_HISTORY_KEY,
      JSON.stringify(updatedHistory),
    );
  };

  // Xóa mục lịch sử
  const deleteHistoryItem = async (query: string) => {
    const updatedHistory = searchHistory.filter(item => item !== query);
    setSearchHistory(updatedHistory);
    await AsyncStorage.setItem(
      SEARCH_HISTORY_KEY,
      JSON.stringify(updatedHistory),
    );
  };

  // Tải lịch sử khi mount
  useEffect(() => {
    loadSearchHistory();
  }, []);

  // Logic tìm kiếm
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchText.trim().length > 0) {
        const filteredUsers = dataUser.filter((user: any) =>
          user.name.toLowerCase().includes(searchText.trim().toLowerCase()),
        );

        const filteredHistory = searchHistory.filter((historyItem: string) =>
          historyItem.toLowerCase().includes(searchText.trim().toLowerCase()),
        );

        const combined = [
          ...filteredHistory.map(item => ({type: 'history', value: item})),
          ...filteredUsers.map(item => ({type: 'user', value: item})),
        ];

        setCombinedResults(combined);
      } else {
        setCombinedResults(
          searchHistory.map(item => ({type: 'history', value: item})),
        );
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchText, searchHistory]);

  // hiệu ứng opacity khi focused thay đổi
  useEffect(() => {
    Animated.parallel([
      Animated.timing(searchOpacity, {
        toValue: isFocused && !isShowResult ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(mediaOpacity, {
        toValue: isFocused || isShowResult ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(resultOpacity, {
        toValue: isShowResult ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isFocused, isShowResult]);

  return (
    <View style={[styles.container]}>
      <View style={styles.searchContainer}>
        {isShowResult && (
          <TouchableOpacity
            onPress={() => {
              setIsShowResult(false);
              setSearchText('');
            }}>
            <Image
              source={require('../../../assets/icon/left.png')}
              style={[styles.icon, {marginRight: 10}]}
            />
          </TouchableOpacity>
        )}
        <View style={styles.row}>
          <TextInput
            ref={inputRef}
            placeholder="Searching..."
            placeholderTextColor={color.text}
            style={styles.search}
            onFocus={() => setIsFocused(true)}
            value={searchText}
            onChangeText={setSearchText}
          />
          <Image
            source={require('../../../assets/icon/search.png')}
            style={styles.iconSearch}
          />
        </View>
        {isFocused && (
          <TouchableOpacity
            onPress={() => {
              inputRef.current?.blur();
              setIsFocused(false);
              setSearchText('');
            }}>
            <Text style={styles.textHuy}>Hủy</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.container}>
        {/* Kết quả tìm kiếm (ẩn/hiện bằng display) */}
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
              func={() => {
                saveSearchHistory(searchText);
                setSearchText(searchText);
                setIsFocused(false);
                setIsShowResult(true);
                inputRef.current?.blur();
              }}
            />
          )}
          <FlashList
            data={combinedResults}
            renderItem={({item}: any) => {
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
                    name={item.value.name}
                    image={item.value.image}
                    status={item.value.status}
                    isStory={false}
                  />
                );
              }
            }}
            estimatedItemSize={100}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
        {/* kêts quả tìm kiếmkiếm (ẩn/hiện bằng display) */}
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
          <SearchResult searchText={searchText} />
        </Animated.View>

        {/* Lưới media (ẩn/hiện bằng display) */}
        <Animated.View
          style={[styles.container, {opacity: mediaOpacity}]}
          pointerEvents={isFocused || isShowResult ? 'none' : 'auto'}>
          <FlashList
            data={data}
            
            keyExtractor={item => item.toString()}
            renderItem={({item, index}) => (
              <GridMedia
                images={images}
                index={index}
                isFocused={isFocused}
                isFocusedPage={isFocusedPage}
                currentVisibleIndex={currentVisibleIndex}
              />
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            estimatedItemSize={200}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        </Animated.View>
        
      </View>
    </View>
  );
};
