import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Colors} from '../../../../assets/color/Colors';
import {Portal} from 'react-native-portalize';
import {useTheme} from '../../../util/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {
  addBookmark,
  removeReelBookmark,
} from '../../../../services/reelBookmarkRedux/reelBookmarkReducer';
import {
  removeBookmark,
  saveBookmark,
} from '../../../../services/bookmarkRedux/bookmarkSlice';
import { PostWithMedia } from '@services/postRedux/postTypes';

const height = Dimensions.get('window').height * 0.7;

export type BottomSheetReelsRef = {
  open: () => void;
  close: () => void;
};

type BottomSheetReelsProps = {
  isBookmarked?: boolean;
  selectedItem?: PostWithMedia | null;
};

const BottomSheetReels = forwardRef<BottomSheetReelsRef, BottomSheetReelsProps>(
  ({isBookmarked, selectedItem}, ref) => {
    const modalRef = useRef<Modalize>(null);
    const {theme} = useTheme();
    const colors = Colors[theme];
    const dispatch = useDispatch<AppDispatch>();
    const {bookmark} = useSelector((state: RootState) => state.reelBookmark);
    const {refreshToken} = useSelector((state: RootState) => state.user);
    const isBookmark = useMemo(() => {
      return selectedItem?._id
        ? bookmark.some(item => item.postId === selectedItem._id)
        : false;
    }, [bookmark, selectedItem]);

    useEffect(() => {
      if (isBookmarked && selectedItem?._id) {
        dispatch(addBookmark({postId: selectedItem._id}));
      }else if (selectedItem?._id){
        dispatch(removeReelBookmark(selectedItem._id));
      }
    }, [isBookmarked, selectedItem]);

    useImperativeHandle(ref, () => ({
      open: () => modalRef.current?.open(),
      close: () => modalRef.current?.close(),
    }));

    const handleBookmarkAction = () => {
      const postId = selectedItem?._id;
      if (!postId) return;

      if (isBookmark) {
        dispatch(removeReelBookmark(postId));
        dispatch(removeBookmark({postIds: [postId], refreshToken}))
          .unwrap()
          .catch(() => {
            dispatch(addBookmark({postId}));
          });
      } else {
        dispatch(addBookmark({postId}));
        dispatch(saveBookmark({postId, refreshToken}))
          .unwrap()
          .catch(() => {
            dispatch(removeReelBookmark(postId));
          });
      }
    };

    return (
      <Portal>
        <Modalize
          ref={modalRef}
          modalStyle={{
            backgroundColor: Colors.white,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingHorizontal: 16,
          }}
          handleStyle={{
            backgroundColor: Colors.black,
            height: 6,
            width: 40,
            marginBottom: 8,
          }}
          handlePosition="inside"
          panGestureEnabled
          scrollViewProps={{scrollEnabled: false}}
          adjustToContentHeight>
          <View style={{height: height, marginTop: 40}}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.headerBlock}
                onPress={handleBookmarkAction}>
                <View style={styles.blockIcon}>
                  <Image
                    style={[
                      styles.icon,
                      {tintColor: isBookmark ? '#F2C641' : colors.black},
                    ]}
                    source={
                      isBookmark
                        ? require('../../../../assets/icon/bookmark_fill.png')
                        : require('../../../../assets/icon/bookmark.png')
                    }
                  />
                </View>
                <Text style={styles.textHeader}>
                  {isBookmark ? 'Đã lưu' : 'Lưu'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBlock}>
                <View style={styles.blockIcon}>
                  <Image
                    style={styles.icon}
                    source={require('../../../../assets/icon/remix_reels.png')}
                  />
                </View>
                <Text style={styles.textHeader}>Remix</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBlock}>
                <View style={styles.blockIcon}>
                  <Image
                    style={styles.icon}
                    source={require('../../../../assets/icon/sequence.png')}
                  />
                </View>
                <Text style={styles.textHeader}>Sequence</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buttonFeature}>
              <View style={styles.blockIcon}>
                <Image
                  style={styles.icon}
                  source={require('../../../../assets/icon/translation.png')}
                />
              </View>
              <Text style={styles.textNormal}>Bản dịch</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonFeature}>
              <View style={styles.blockIcon}>
                <Image
                  style={styles.icon}
                  source={require('../../../../assets/icon/cc.png')}
                />
              </View>
              <Text style={styles.textNormal}>Phụ đề</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonFeature}>
              <View style={styles.blockIcon}>
                <Image
                  style={styles.icon}
                  source={require('../../../../assets/icon/full_screen.png')}
                />
              </View>
              <Text style={styles.textNormal}>Xem toàn màn hình</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonFeature}>
              <View style={styles.blockIcon}>
                <Image
                  style={styles.icon}
                  source={require('../../../../assets/icon/qrlink.png')}
                />
              </View>
              <Text style={styles.textNormal}>Mã QR</Text>
            </TouchableOpacity>

            <View style={styles.feelingContainer}>
              <TouchableOpacity style={styles.buttonFeeling}>
                <View style={styles.blockIcon}>
                  <Image
                    style={styles.icon}
                    source={require('../../../../assets/icon/view.png')}
                  />
                </View>
                <Text style={styles.textNormal}>Quan tâm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonFeeling}>
                <View style={styles.blockIcon}>
                  <Image
                    style={styles.icon}
                    source={require('../../../../assets/icon/hide.png')}
                  />
                </View>
                <Text style={styles.textNormal}>Không quan tâm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonFeeling}>
                <View style={styles.blockIcon}>
                  <Image
                    style={[styles.icon, {tintColor: 'red'}]}
                    source={require('../../../../assets/icon/report.png')}
                  />
                </View>
                <Text style={[styles.textNormal, {color: 'red'}]}>Báo cáo</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buttonFeature}>
              <View style={styles.blockIcon}>
                <Image
                  style={styles.icon}
                  source={require('../../../../assets/icon/equalizer.png')}
                />
              </View>
              <Text style={styles.textNormal}>
                Quản lý tùy chọn về nội dung
              </Text>
            </TouchableOpacity>
          </View>
        </Modalize>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerBlock: {
    width: '31%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.whiteSmoke,
  },
  blockIcon: {
    width: 20,
    height: 20,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: Colors.black,
  },
  textHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    color: Colors.black,
  },
  buttonFeature: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.whiteSmoke,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10,
  },
  textNormal: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.black,
  },
  feelingContainer: {
    width: '100%',
    backgroundColor: Colors.whiteSmoke,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonFeeling: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default BottomSheetReels;
