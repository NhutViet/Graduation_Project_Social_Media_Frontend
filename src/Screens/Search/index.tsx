import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import {useTheme} from '../../util/ThemeContext';
import {SearchStyles} from '../../StyleSheet/SearchStyles';
import Video from 'react-native-video';
import User from '../../../components/User';

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

export const Search = () => {
  const theme = useTheme();
  const [images, setImages] = useState(generateImages(20));
  const styles = SearchStyles(theme.theme);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  //chạy videovideo
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number | null>(
    null,
  );

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentVisibleIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {viewAreaCoveragePercentThreshold: 50};

  const loadMore = () => {
    const newImages = generateImages(images.length + 20);
    setImages(newImages);
  };

  //render ảnh 
  const renderItem = ({item, index}: any) => {
    const bigImage = images[index * 5];
    const smallImage1 = images[index * 5 + 1];
    const smallImage2 = images[index * 5 + 2];
    const smallImage3 = images[index * 5 + 3];
    const smallImage4 = images[index * 5 + 4];

    if (!bigImage) return null;

    const isReversed = index % 2 === 0;
    const isPlaying = currentVisibleIndex === index;

    return (
      <View
        style={{
          flexDirection: isReversed ? 'row' : 'row-reverse',
          gap: 2,
          marginBottom: 2,
        }}>
        {bigImage && (
          <TouchableOpacity style={{flex: 1}}>
            <Video
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/project-no1-daseinzumtode.appspot.com/o/video-phuc%2FDownload.mp4?alt=media&token=77311316-23f5-43da-bf98-ad67aec92965',
              }}
              style={styles.bigImage}
              resizeMode="cover"
              repeat
              muted={true}
              paused={isFocused || !isPlaying}
            />
          </TouchableOpacity>
        )}
        <View style={styles.smallImages}>
          {smallImage1 && (
            <TouchableOpacity>
              <Image
                source={{uri: smallImage1.uri}}
                style={styles.smallImage}
              />
              <Image
                source={require('../../../assets/icon/gallery.png')}
                style={styles.iconDif}
              />
            </TouchableOpacity>
          )}
          {smallImage2 && (
            <TouchableOpacity>
              <Image
                source={{uri: smallImage2.uri}}
                style={styles.smallImage}
              />
              <Image
                source={require('../../../assets/icon/gallery.png')}
                style={styles.iconDif}
              />
            </TouchableOpacity>
          )}
          {smallImage3 && (
            <TouchableOpacity>
              <Image
                source={{uri: smallImage3.uri}}
                style={styles.smallImage}
              />
              <Image
                source={require('../../../assets/icon/gallery.png')}
                style={styles.iconDif}
              />
            </TouchableOpacity>
          )}
          {smallImage4 && (
            <TouchableOpacity>
              <Image
                source={{uri: smallImage4.uri}}
                style={styles.smallImage}
              />
              <Image
                source={require('../../../assets/icon/gallery.png')}
                style={styles.iconDif}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const numBlocks = Math.ceil(images.length / 3);
  const data = Array.from({length: numBlocks}, (_, index) => index);

  //xử lý tìm kiếm
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResults] = useState<any>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchText.trim().length > 0) {
        const filtered = dataUser.filter((user: any) =>
          user.name.toLowerCase().includes(searchText.trim().toLowerCase()),
        );
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
    }, 500);

    // nếu user gõ tiếp trước 500ms, clear timer cũ
    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  return (
    <View style={[styles.container]}>
      <View style={styles.searchContainer}>
        <TextInput
          ref={inputRef}
          placeholder="Searching..."
          style={styles.search}
          onFocus={() => setIsFocused(true)}
          value={searchText}
          onChangeText={setSearchText}
        />
        <Image
          source={require('../../../assets/icon/search.png')}
          style={styles.iconSearch}
        />
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

      {isFocused ? (
        <View style={styles.container}>
            <FlashList
                data={searchResult}
                renderItem={({item}: any) => (
                  <User
                    name={item.name}
                    image={item.image}
                    status={item.status}
                    isStory={false}
                  />
                )}
                estimatedItemSize={100}
                showsVerticalScrollIndicator={false}
              />
        </View>
      ) : (
        <FlashList
          data={data}
          keyExtractor={item => item.toString()}
          renderItem={({item, index}) => renderItem({item, index})}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          estimatedItemSize={200}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      )}
    </View>
  );
};
