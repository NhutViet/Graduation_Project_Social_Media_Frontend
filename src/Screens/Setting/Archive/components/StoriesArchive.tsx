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

  const openArchiveModal = useCallback((): void => {
    requestAnimationFrame(() => {
      ModalArchiveRef.current?.open();
    });
  }, []);

  const goBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <View style={{width: '100%', height: 60}}>
        <Header
          pressableTitle="Kho lưu trữ tin"
          pressableTilFunc={openArchiveModal}
          iconBack={require('../../../../../assets/icon/left.png')}
          func={goBack}
          iconLeft={require('../../../../../assets/icon/add.png')}
          funcLeft={() => navigation.navigate('HighlightCreateScreen')}
          navigation={navigation}
        />
      </View>
      <View style={{width: '100%', height: '100%'}}>
        <TopTab.Navigator
          tabBar={({state, descriptors, navigation, position}) => (
            <View
              style={{flexDirection: 'row', backgroundColor: color.background}}>
              {state.routes.map((route, index) => {
                const {options} = descriptors[route.key];
                const isFocused = state.index === index;
                const icon =
                  route.name === 'StoriesTab'
                    ? require('../../../../../assets/icon/story.png')
                    : require('../../../../../assets/icon/highlight.png');

                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  } as const);

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                };

                return (
                  <TouchableOpacity
                    key={route.key}
                    onPress={onPress}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: 10,
                      borderBottomWidth: isFocused ? 3 : 0,
                      borderBottomColor: isFocused ? color.text : 'transparent',
                    }}>
                    <Image
                      source={icon}
                      style={{
                        width: 22,
                        height: 22,
                        tintColor: isFocused ? color.text : color.textSecondary,
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}>
          <TopTab.Screen name="StoriesTab" component={StoriesTab} />
          <TopTab.Screen name="HighlightsTab" component={HighlightsTab} />
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
