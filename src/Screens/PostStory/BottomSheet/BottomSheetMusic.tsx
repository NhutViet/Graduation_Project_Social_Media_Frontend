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
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import ItemMusic from '../Component/itemMusic';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {fetchAllMusic} from '../../../../services/musicRedux/musicSlice';

const maxHeight = Dimensions.get('window').height;
const height = Dimensions.get('window').height * 0.8;
const width = Dimensions.get('window').width - 100;

export type BottomSheetRef = {
  open: () => void;
  close: () => void;
};

const BottomSheet = forwardRef<BottomSheetRef>(({}, ref) => {
  const translateY = useSharedValue(height);
  const isOpen = useSharedValue(false);

  const open = () => {
    translateY.value = withSpring(0, {
      damping: 20,
    });
    isOpen.value = true;
  };

  const close = () => {
    translateY.value = withSpring(height, {damping: 20});
    isOpen.value = false;
  };

  useImperativeHandle(ref, () => ({open, close}));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: isOpen.value ? 1 : 0,
    display: isOpen.value ? 'flex' : 'none',
  }));

  const {theme} = useTheme();
  const color = Colors[theme];
  const [search, setSearch] = useState<string>('');

  const dispatch = useDispatch<AppDispatch>();
  const {musicList, loading} = useSelector((state: RootState) => state.music);

  useEffect(() => {
    dispatch(fetchAllMusic());
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
  }, [search]);

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
      <FlashList
        data={musicList}
        renderItem={({item}) => <ItemMusic {...item} />}
        estimatedItemSize={50}
      />
    </View>
  );

  const SecondRoute = () => (
    <View style={styles.tab}>
      <FlashList
        data={musicList}
        renderItem={({item}) => <ItemMusic {...item} />}
        estimatedItemSize={50}
      />
    </View>
  );

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Original audio'},
    {key: 'second', title: 'Music'},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableWithoutFeedback onPress={close}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          animatedStyle,
          {backgroundColor: color.background},
        ]}>
        <View style={[styles.handle, {backgroundColor: color.text}]} />
        <View style={styles.searchContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.blockIcon}>
              <Image
                style={[styles.icon, {tintColor: color.text}]}
                source={require('../../../../assets/icon/search.png')}
              />
            </View>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search music"
              placeholderTextColor={color.text}
              style={[styles.input, {color: color.text}]}
            />
          </View>
          {search && (
            <TouchableOpacity
              style={[styles.blockIcon, {padding: 5}]}
              onPress={() => setSearch('')}>
              <Image
                style={styles.icon}
                source={require('../../../../assets/icon/closer.png')}
              />
            </TouchableOpacity>
          )}
        </View>

        {keyboardVisible || search ? (
          <View style={{flex: 1, paddingVertical: 20, marginHorizontal: 16}}>
            <FlashList
              data={filteredData}
              bounces={false}
              renderItem={({item}) => <ItemMusic {...item} />}
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
                <Image
                  style={[styles.icon, {tintColor: color.text}]}
                  source={require('../../../../assets/icon/left.png')}
                />
              </TouchableOpacity>
              <Text style={[styles.textNormal, {color: color.text}]}>
                Saved
              </Text>
              <View style={styles.blockIcon}></View>
            </View>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{width: Dimensions.get('window').width}}
              renderTabBar={props => (
                <TabBar
                  {...props}
                  indicatorStyle={{backgroundColor: color.text}}
                  style={{
                    backgroundColor: color.transparent,
                    marginBottom: 10,
                  }}
                  labelStyle={{color: color.text, textTransform: 'none'}}
                  pressColor="transparent"
                  pressOpacity={1}
                />
              )}
            />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setShowSavedView(true)}>
              <View style={styles.blockIcon}>
                <Image
                  style={[styles.icon, {tintColor: color.text}]}
                  source={require('../../../../assets/icon/bookmark.png')}
                />
              </View>
              <Text
                style={[
                  styles.textNormal,
                  {color: color.text, fontWeight: 'bold'},
                ]}>
                Saved
              </Text>
            </TouchableOpacity>
            <View style={styles.rowContainer}>
              <Text
                style={[
                  styles.textNormal,
                  {fontWeight: 'bold', color: color.text},
                ]}>
                For you
              </Text>
              <TouchableOpacity>
                <Text style={[styles.textNormal, {color: color.text}]}>
                  See more
                </Text>
              </TouchableOpacity>
            </View>
            <NativeViewGestureHandler ref={nativeGestureRef}>
              <View style={{flex: 1, marginHorizontal: 16}}>
                <FlashList
                  data={musicList}
                  bounces={false}
                  renderItem={({item}) => {
                    return <ItemMusic {...item} />;
                  }}
                  showsVerticalScrollIndicator={false}
                  estimatedItemSize={50}
                />
              </View>
            </NativeViewGestureHandler>
          </View>
        )}
      </Animated.View>
    </>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  sheet: {
    position: 'absolute',
    top: maxHeight - height,
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
    paddingVertical: 8,
    backgroundColor: Colors.input,
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
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 40,
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
    paddingVertical: 7,
    backgroundColor: Colors.input,
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
  },
});

export default BottomSheet;
