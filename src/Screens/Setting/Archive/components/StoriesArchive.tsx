import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Header from '../../../../../components/Header';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../../../../assets/color/Colors';
import {useTheme} from '../../../../util/ThemeContext';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import StoriesTab from './StoriesTab';
import HighlightsTab from './HighlightsTab';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../../services/store';
import {fetchGetPostedSotry} from '../../../../../services/StoryRedux/StorySlice';
import {Alert} from 'react-native';
import HighlightCreateModal from './HighlightCreateModal';

// Giả lập action creator (thay bằng action thực tế khi có API)
const fetchCreateHighlight =
  (data: {storyIds: string[]}) => async (dispatch: AppDispatch) => {
    try {
      console.log('Creating highlight with storyIds:', data.storyIds);
      return {success: true, data: {highlightId: 'fake-highlight-id'}};
    } catch (error) {
      console.error('Error creating highlight:', error);
      throw error;
    }
  };

const TopTab = createMaterialTopTabNavigator();

// Định nghĩa ITEM_SIZE trong StoryArchive
const {width} = Dimensions.get('window');
const ITEM_SIZE = width / 3;

const StoryArchive = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const dispatch = useDispatch<AppDispatch>();
  const {myStories, loading} = useSelector((state: RootState) => state.stories);
  const ModalArchiveRef = useRef<Modalize>(null);
  const ModalOptionRef = useRef<Modalize>(null);
  const [isHighlightModalOpen, setIsHighlightModalOpen] = useState(false);

  const openArchiveModal = useCallback((): void => {
    requestAnimationFrame(() => {
      ModalArchiveRef.current?.open();
    });
  }, []);

  const openOptionModal = useCallback((): void => {
    requestAnimationFrame(() => {
      ModalOptionRef.current?.open();
    });
  }, []);

  const openHighlightCreateModal = useCallback((): void => {
    dispatch(fetchGetPostedSotry()); // Đảm bảo tải dữ liệu story trước
    setIsHighlightModalOpen(true); // Mở modal chỉ khi nhấn
  }, [dispatch]);

  const closeHighlightModal = useCallback((): void => {
    setIsHighlightModalOpen(false);
  }, []);

  const goBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  const createHighlight = async (selectedStoryIds: string[]) => {
    if (selectedStoryIds.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một story.');
      return;
    }
    try {
      const response = await dispatch(
        fetchCreateHighlight({storyIds: selectedStoryIds}),
      ).unwrap();
      if (response.success) {
        Alert.alert('Thành công', 'Tin nổi bật đã được tạo.');
        closeHighlightModal();
      }
    } catch (error) {
      console.error('Lỗi khi tạo highlight:', error);
      Alert.alert('Lỗi', 'Không thể tạo tin nổi bật. Vui lòng thử lại.');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <View style={{width: '100%', height: 60}}>
        <Header
          pressableTitle="Kho lưu trữ tin"
          pressableTilFunc={openArchiveModal}
          iconBack={require('../../../../../assets/icon/left.png')}
          func={goBack}
          iconLeft={require('../../../../../assets/icon/menu-dots-vertical.png')}
          funcLeft={openOptionModal}
          navigation={navigation}
        />
      </View>
      <View style={{width: '100%', height: '100%'}}>
        <TopTab.Navigator
          screenOptions={{
            tabBarLabelStyle: {
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'lowercase',
            },
            tabBarStyle: {
              backgroundColor: color.background,
            },
            tabBarIndicatorStyle: {
              backgroundColor: color.text,
              height: 3,
            },
            tabBarActiveTintColor: color.text,
            tabBarInactiveTintColor: color.textSecondary,
          }}>
          <TopTab.Screen
            name="StoriesTab"
            component={StoriesTab}
            options={{
              tabBarIcon: () => (
                <Image
                  source={require('../../../../../assets/icon/story.png')}
                  style={{tintColor: color.text, width: 20, height: 20}}
                />
              ),
              tabBarShowLabel: false,
            }}
          />
          <TopTab.Screen
            name="HighlightsTab"
            component={HighlightsTab}
            options={{
              tabBarIcon: () => (
                <Image
                  source={require('../../../../../assets/icon/highlight.png')}
                  style={{tintColor: color.text, width: 20, height: 20}}
                />
              ),
              tabBarShowLabel: false,
            }}
          />
        </TopTab.Navigator>
        <Portal>
          <Modalize
            ref={ModalArchiveRef}
            adjustToContentHeight={false}
            modalHeight={Dimensions.get('window').height * 0.3}
            modalStyle={[styles.modal, {backgroundColor: color.modal}]}
            handleStyle={styles.modalHandle}
            handlePosition="inside"
            panGestureEnabled={true}
            onOverlayPress={() => ModalArchiveRef.current?.close()}
            scrollViewProps={{
              showsVerticalScrollIndicator: false,
            }}>
            <View style={{marginTop: 35}}>
              <TouchableOpacity style={styles.modalPressable}>
                <Text style={[styles.modalText, {color: color.text}]}>
                  Kho lưu trữ tin
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalPressable}>
                <Text style={[styles.modalText, {color: color.text}]}>
                  Kho lưu trữ bài viết
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalPressable}>
                <Text style={[styles.modalText, {color: color.text}]}>
                  Kho lưu trữ buổi phát trực tiếp
                </Text>
              </TouchableOpacity>
            </View>
          </Modalize>
        </Portal>
        <Portal>
          <Modalize
            ref={ModalOptionRef}
            adjustToContentHeight={false}
            modalHeight={Dimensions.get('window').height * 0.3}
            modalStyle={[styles.modal, {backgroundColor: color.modal}]}
            handleStyle={styles.modalHandle}
            handlePosition="inside"
            panGestureEnabled={true}
            onOverlayPress={() => ModalOptionRef.current?.close()}
            scrollViewProps={{
              showsVerticalScrollIndicator: false,
            }}>
            <View style={{marginTop: 35}}>
              <View style={{paddingVertical: 20, justifyContent: 'center'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    color: color.text,
                  }}>
                  Lựa chọn khác
                </Text>
              </View>
              <View
                style={{flex: 1, borderWidth: 1, borderColor: color.gray}}
              />
              <TouchableOpacity
                style={styles.modalPressable}
                onPress={openHighlightCreateModal}>
                <Text style={[styles.modalText, {color: color.text}]}>
                  Tạo tin nổi bật
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalPressable}>
                <Text style={[styles.modalText, {color: color.text}]}>
                  Cài đặt
                </Text>
              </TouchableOpacity>
            </View>
          </Modalize>
        </Portal>
        <HighlightCreateModal
          isOpen={isHighlightModalOpen}
          onClose={closeHighlightModal}
          myStories={myStories}
          loading={loading}
          onCreateHighlight={createHighlight}
        />
      </View>
    </SafeAreaView>
  );
};

export default StoryArchive;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
  },
  modalHandle: {
    backgroundColor: '#ccc',
    height: 4,
    width: 50,
    alignSelf: 'center',
    borderRadius: 2,
  },
  modalHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bio: {
    color: '#888',
    fontSize: 14,
  },
  followButton: {
    width: 89,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#007BFF',
  },
  disabledButton: {
    borderWidth: 1,
    borderRadius: 10,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalPressable: {
    flex: 1,
    marginVertical: 15,
  },
  modalText: {
    fontSize: 18,
  },
});
