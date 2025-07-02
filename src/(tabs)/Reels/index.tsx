/* eslint-disable react/react-in-jsx-scope */
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ReelsComponent from './components/reelsComponent';
import {useIsFocused} from '@react-navigation/native';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Dimensions} from 'react-native';
import {Colors} from '../../../assets/color/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {fetchReelsWithMedia} from '../../../services/postRedux/postSlice';
import BottomSheetReels, {
  BottomSheetReelsRef,
} from './bottomSheet/reelBottomSheet';
import {fetchCommentsByPost} from '../../../services/commentRedux/commentSlice';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from '../Home/components/CommentSection';
import {useFocusEffect} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import ModalShare from '../Home/components/ModalShare';
import {Portal} from 'react-native-portalize';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Reels = forwardRef((props, ref) => {
  const isFocused = useIsFocused();

  const sheetRef: any = useRef<BottomSheetReelsRef>(null);
  const sheetRefComment: any = useRef<BottomSheetCommentRef>(null);
  const modalShareRef = useRef<Modalize>(null);

  const [currentVisible, setCurrentVisible] = useState<string | null>(null);
  const [isCurrentBookmarked, setIsCurrentBookmarked] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const onViewRef = useRef(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0];
      const id = visibleItem?.item?._id;
      if (id) {
        setCurrentVisible(id);
      }
    }
  });

  const handleOpenShareModal = useCallback(() => {
    modalShareRef.current?.open();
  }, []);

  useImperativeHandle(ref, () => ({
    reload: () => {
      dispatch(fetchReelsWithMedia());
    },
  }));

  // fetch api
  const dispatch = useDispatch<AppDispatch>();
  const {reels, loading} = useSelector((state: RootState) => state.post);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchReelsWithMedia());
    }, [dispatch]),
  );
  ///////////////////////////////

  const [selectedPostId, setSelectedPostId] = useState<string>('');

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.black,
        }}>
        <ActivityIndicator size="large" color={Colors.white} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.rowContainer}>
          <Text style={styles.textHeader}>Reels</Text>
          <View style={styles.iconDownContainer}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/down.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
      <FlashList
        data={reels}
        extraData={[currentVisible, isFocused]}
        renderItem={({item}: any) => {
          const shouldPlay = item?._id === currentVisible;
          return (
            <ReelsComponent
              {...item}
              isFocused={isFocused}
              currentVisible={shouldPlay}
              isFollow={item?.isFollow}
              muted={false}
              showBottomSheet={() => {
                setSelectedItem(item);
                setIsCurrentBookmarked(item.isBookmarked);
                sheetRef?.current.open();
              }}
              openComment={() => {
                setSelectedPostId(item._id);
                dispatch(fetchCommentsByPost(item._id));
                sheetRefComment.current?.open();
              }}
              openReactionModal={() => {}}
              openShareModal={handleOpenShareModal}
            />
          );
        }}
        pagingEnabled={true}
        // avoiding overscroll too fast
        overScrollMode="never"
        decelerationRate="fast"
        disableHorizontalListHeightMeasurement={true}
        estimatedFirstItemOffset={3}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={height}
        estimatedListSize={{height, width}}
        keyExtractor={(item: any) => item._id}
        onViewableItemsChanged={onViewRef.current}
        // viewabilityConfig is for select which item is visible && play it
        viewabilityConfig={{
          itemVisiblePercentThreshold: 90,
          minimumViewTime: 300,
        }}
      />
      <BottomSheetReels
        ref={sheetRef}
        isBookmarked={isCurrentBookmarked}
        selectedItem={selectedItem}
      />
      <BottomSheetComment ref={sheetRefComment} postId={selectedPostId} />

      <Portal>
        <ModalShare ref={modalShareRef} />
      </Portal>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    position: 'absolute',
    width: width,
    top: 0,
    zIndex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.transparent,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginRight: 8,
  },
  iconDownContainer: {
    width: 12,
    height: 12,
  },
  iconContainer: {
    width: 20,
    height: 20,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
});

export default Reels;
