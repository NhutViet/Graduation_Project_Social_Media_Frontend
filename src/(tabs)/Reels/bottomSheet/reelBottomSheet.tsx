import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import CustomPopupModal, {
  CustomPopupModalRef,
} from '../../../../components/Global/CustomPopupModal';
import {Colors} from '../../../../assets/color/Colors';
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
import {PostWithMedia} from '@services/postRedux/postTypes';
import {Bookmark, EyeOff, Flag} from 'lucide-react-native';

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
    const popupRef = useRef<CustomPopupModalRef>(null);
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
      } else if (selectedItem?._id) {
        dispatch(removeReelBookmark(selectedItem._id));
      }
    }, [isBookmarked, selectedItem]);

    useImperativeHandle(ref, () => ({
      open: () => popupRef.current?.open(),
      close: () => popupRef.current?.close(),
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
      <CustomPopupModal
        ref={popupRef}
        backgroundColor={colors.white}
        cancelText="Huỷ"
        cancelTextColor="#ff3b30">
        <View style={{paddingTop: 8}}>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handleBookmarkAction}>
            <Bookmark
              size={22}
              color={isBookmark ? '#F2C641' : colors.black}
              fill={isBookmark ? '#F2C641' : Colors.transparent}
              style={styles.icon}
            />
            <Text style={styles.textItem}>{isBookmark ? 'Đã lưu' : 'Lưu'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowItem}>
            <EyeOff size={22} color={colors.black} style={styles.icon} />
            <Text style={styles.textItem}>Không quan tâm</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowItem}>
            <Flag size={22} color="red" style={styles.icon} />
            <Text style={[styles.textItem, {color: 'red'}]}>Báo cáo</Text>
          </TouchableOpacity>
        </View>
      </CustomPopupModal>
    );
  },
);

const styles = StyleSheet.create({
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 16,
  },
  textItem: {
    fontSize: 16,
    color: Colors.black,
  },
});

export default BottomSheetReels;
