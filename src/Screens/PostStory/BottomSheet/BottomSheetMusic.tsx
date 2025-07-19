import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import ItemMusic from '../Component/itemMusic';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {fetchAllMusic} from '../../../../services/musicRedux/musicSlice';
import AudioTrimModal from '../../PostSetting/Components/MusicModal';
import {Music} from '../../../../services/musicRedux/musicType';
import {
  addToBookmark,
  removeFromBookmark,
} from '../../../../services/musicRedux/musicReducer';
import {
  Search,
  X,
  ArrowLeft,
  Bookmark as BookmarkIcon,
} from 'lucide-react-native';

const height = Dimensions.get('window').height * 0.8;
const width = Dimensions.get('window').width - 100;

export type BottomSheetRef = {
  open: () => void;
  close: () => void;
};

export type Props = {
  onDoneSelect: (data: {
    musicId: string;
    timeStart: number;
    timeEnd: number;
    song: string;
    songImage: string;
  }) => void;
  songUrl?: (value: string) => void;
};

const BottomSheet = forwardRef<BottomSheetRef, Props>(
  ({onDoneSelect, songUrl}, ref) => {
    const [visible, setVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const translateY = useRef(new Animated.Value(height)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const open = () => {
      setVisible(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 20,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const close = () => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }),
        Animated.timing(translateY, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }),
      ]).start(() => {
        setVisible(false);
      });
    };

    useImperativeHandle(ref, () => ({open, close}));

    const {theme} = useTheme();
    const color = Colors[theme];
    const [search, setSearch] = useState<string>('');

    const dispatch = useDispatch<AppDispatch>();
    const {refreshToken} = useSelector((state: RootState) => state.user);
    const {musicList, musicBookmark} = useSelector(
      (state: RootState) => state.music,
    );
    const [music, setMusic] = useState<Music>();

    useEffect(() => {
      dispatch(fetchAllMusic({refreshToken}));
    }, [dispatch]);

    const [filteredData, setFilteredData] = useState(musicList);

    useEffect(() => {
      if (search.trim() === '') {
        setFilteredData(musicList);
      } else {
        const lowerSearch = search.toLowerCase();
        const filtered = musicList.filter(item =>
          item.song.toLowerCase().includes(lowerSearch),
        );
        setFilteredData(filtered);
      }
    }, [search, musicList]);

    useEffect(() => {
      musicList.forEach(item => {
        if (item.isBookmarked) {
          dispatch(addToBookmark(item));
        } else {
          dispatch(removeFromBookmark(item._id));
        }
      });
    }, [musicList]);

    const nativeGestureRef = useRef(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
      const keyboardShow = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardVisible(true);
      });
      const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardVisible(false);
      });

      return () => {
        keyboardShow.remove();
        keyboardHide.remove();
      };
    }, []);

    const [showSavedView, setShowSavedView] = useState(false);

    const FirstRoute = () => (
      <View style={styles.tab}>
        {musicBookmark.length > 0 ? (
          <FlashList
            data={musicBookmark}
            renderItem={({item}) => <ItemMusic {...item} />}
            estimatedItemSize={50}
          />
        ) : (
          <Text style={styles.noti}>Bạn không có âm thanh nào đã lưu.</Text>
        )}
      </View>
    );

    const SecondRoute = () => (
      <View style={styles.tab}>
        {musicBookmark.length > 0 ? (
          <FlashList
            data={musicBookmark}
            renderItem={({item}) => <ItemMusic {...item} />}
            estimatedItemSize={50}
          />
        ) : (
          <Text style={styles.noti}>Bạn không có âm thanh nào đã lưu.</Text>
        )}
      </View>
    );

    const [index, setIndex] = useState(0);
    const [routes] = useState([
      {key: 'first', title: 'Âm thanh gốc'},
      {key: 'second', title: 'Nhạc'},
    ]);

    const renderScene = SceneMap({
      first: FirstRoute,
      second: SecondRoute,
    });

    if (!visible) return null;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={close}
        statusBarTranslucent>
        <TouchableWithoutFeedback onPress={close}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: opacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: color.background,
              transform: [{translateY}],
            },
          ]}>
          <View style={[styles.handle, {backgroundColor: color.text}]} />
          <View
            style={[
              styles.searchContainer,
              {backgroundColor: color.backgroundSecondary},
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={styles.blockIcon}>
                <Search size={20} color={color.text} />
              </View>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Tìm kiếm âm thanh"
                placeholderTextColor={color.text}
                style={[styles.input, {color: color.text}]}
              />
            </View>
            {search ? (
              <TouchableOpacity
                style={[styles.blockIcon, {padding: 5}]}
                onPress={() => setSearch('')}>
                <X size={20} color={color.text} />
              </TouchableOpacity>
            ) : null}
          </View>

          {keyboardVisible || search ? (
            <View style={{flex: 1, paddingVertical: 20, marginHorizontal: 16}}>
              <FlashList
                data={filteredData}
                bounces={false}
                renderItem={({item}) => (
                  <ItemMusic
                    {...item}
                    onPress={() => {
                      setIsModalOpen(true);
                      setMusic(item);
                    }}
                  />
                )}
                showsVerticalScrollIndicator={false}
                estimatedItemSize={50}
              />
            </View>
          ) : showSavedView ? (
            <View style={{flex: 1}}>
              <View style={styles.spaceContainer}>
                <TouchableOpacity
                  onPress={() => setShowSavedView(false)}
                  style={styles.blockIcon}>
                  <ArrowLeft size={22} color={color.text} />
                </TouchableOpacity>
                <Text style={[styles.textNormal, {color: color.text}]}>
                  Đã lưu
                </Text>
                <View style={styles.blockIcon} />
              </View>
              <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{width: Dimensions.get('window').width}}
                renderTabBar={tabBarProps => (
                  <TabBar
                    {...tabBarProps}
                    indicatorStyle={{backgroundColor: color.primary}}
                    activeColor={color.primary}
                    inactiveColor={color.text}
                    style={{
                      backgroundColor: color.background,
                      shadowColor: 'transparent',
                      borderBottomWidth: 0.5,
                      borderBottomColor: color.gray,
                    }}
                  />
                )}
              />
            </View>
          ) : (
            <View style={{flex: 1}}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  {backgroundColor: color.backgroundSecondary},
                ]}
                onPress={() => setShowSavedView(true)}>
                <View style={styles.blockIcon}>
                  <BookmarkIcon size={22} color={color.text} />
                </View>
                <Text
                  style={[
                    styles.textNormal,
                    {color: color.text, fontWeight: 'bold'},
                  ]}>
                  Đã lưu
                </Text>
              </TouchableOpacity>
              <View style={styles.rowContainer}>
                <Text
                  style={[
                    styles.textNormal,
                    {fontWeight: 'bold', color: color.text},
                  ]}>
                  Dành cho bạn
                </Text>
                <TouchableOpacity>
                  <Text style={[styles.textNormal, {color: color.text}]}>
                    Xem thêm
                  </Text>
                </TouchableOpacity>
              </View>
              <NativeViewGestureHandler ref={nativeGestureRef}>
                <View style={{flex: 1, marginHorizontal: 16}}>
                  <FlashList
                    data={musicList}
                    bounces={false}
                    renderItem={({item}) => {
                      return (
                        <ItemMusic
                          {...item}
                          onPress={() => {
                            setIsModalOpen(true);
                            setMusic(item);
                          }}
                        />
                      );
                    }}
                    showsVerticalScrollIndicator={false}
                    estimatedItemSize={50}
                  />
                </View>
              </NativeViewGestureHandler>
            </View>
          )}
        </Animated.View>
        <AudioTrimModal
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          audioUrl={music?.link ?? ''}
          songInfo={{
            _id: music?._id ?? '',
            image: music?.coverImg ?? '',
            title: music?.song ?? '',
            artist: music?.author ?? '',
          }}
          onDoneSelect={onDoneSelect}
          songUrl={songUrl}
        />
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    zIndex: 2,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 6,
    marginHorizontal: 16,
    borderRadius: 7,
  },
  blockIcon: {
    width: 20,
    height: 20,
    padding: 2,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  input: {
    height: 20,
    width: width,
    padding: 0,
    marginLeft: 10,
  },
  textNormal: {
    fontSize: 14,
    marginHorizontal: 10,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 40,
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
    paddingVertical: 7,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 16,
  },
  spaceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.transparent,
    paddingTop: 15,
  },
  noti: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
});

export default BottomSheet;
