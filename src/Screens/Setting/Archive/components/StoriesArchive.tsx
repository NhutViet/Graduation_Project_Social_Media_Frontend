import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../../../util/ThemeContext';
import {Colors} from '../../../../../assets/color/Colors';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import StoriesTab from './StoriesTab';
import HighlightsTab from './HighlightsTab';
import Header from '../../../../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../../services/store';
import {fetchGetPostedSotry} from '../../../../../services/StoryRedux/StorySlice';
import HighlightCreateModal from './HighlightCreateModal';
import {GlobalAlertManager} from '../../../../../components/Global/AlertModal';

const {width, height} = Dimensions.get('window');
const modalContentHeight = Dimensions.get('window').height * 0.3;

const StoryArchive = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const dispatch = useDispatch<AppDispatch>();
  const {myStories, loading} = useSelector((state: RootState) => state.stories);
  const ModalArchiveRef = useRef<Modalize>(null);
  const ModalOptionRef = useRef<Modalize>(null);
  const [isHighlightModalOpen, setIsHighlightModalOpen] = useState(false);

  const openHighlightCreateModal = useCallback((): void => {
    dispatch(fetchGetPostedSotry());
    setIsHighlightModalOpen(true);
  }, [dispatch]);

  const closeHighlightModal = useCallback((): void => {
    setIsHighlightModalOpen(false);
  }, []);

  const createHighlight = async (selectedStoryIds: string[]) => {
    if (selectedStoryIds.length === 0) {
      GlobalAlertManager.show('Lỗi', 'Vui lòng chọn ít nhất một story.');
      return;
    }
    try {
      // Gọi API
      GlobalAlertManager.show('Thành công', 'Tin nổi bật đã được tạo.');
      closeHighlightModal();
    } catch (error) {
      GlobalAlertManager.show('Lỗi', 'Tạo thất bại, thử lại sau.');
    }
  };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'stories', title: 'Stories'},
    {key: 'highlights', title: 'Highlights'},
  ]);

  const renderScene = SceneMap({
    stories: StoriesTab,
    highlights: HighlightsTab,
  });


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <View style={{height: 60, overflow: 'hidden'}}>
        <Header
        pressableTitle="Kho lưu trữ tin"
        pressableTilFunc={() => ModalArchiveRef.current?.open()}
        iconBack={require('../../../../../assets/icon/left.png')}
        func={() => navigation.goBack()}
        iconLeft={require('../../../../../assets/icon/menu-dots-vertical.png')}
        funcLeft={() => ModalOptionRef.current?.open()}
        navigation={navigation}
      />
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

      {/* Modal Archive */}
      <Portal>
        <Modalize
          ref={ModalArchiveRef}
          adjustToContentHeight
          modalStyle={{backgroundColor: color.modal}}
          handlePosition="inside"
          handleStyle={styles.modalHandle}>
            <View style={{height: modalContentHeight}}>
              <View style={{flex: 1, marginTop: 35}}>
                {[
                  'Kho lưu trữ tin',
                  'Kho lưu trữ bài viết',
                  'Kho lưu trữ buổi phát trực tiếp',
                ].map((text, i) => (
                  <TouchableOpacity key={i} style={styles.modalPressable}>
                    <Text style={[styles.modalText, {color: color.text}]}>
                      {text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
        </Modalize>
      </Portal>

      {/* Modal Option */}
      <Portal>
        <Modalize
          ref={ModalOptionRef}
          adjustToContentHeight
          modalStyle={{backgroundColor: color.modal}}
          handlePosition="inside"
          handleStyle={styles.modalHandle}>
            <View style={{height: modalContentHeight}}>
              <View style={{flex: 1, marginTop: 35}}>
                <View style={{paddingVertical: 20, justifyContent: 'center'}}>
                  <Text
                    style={{fontSize: 15, fontWeight: '500', color: color.text}}>
                    Lựa chọn khác
                  </Text>
                </View>
                <View style={{borderWidth: 1, borderColor: color.gray}} />
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
