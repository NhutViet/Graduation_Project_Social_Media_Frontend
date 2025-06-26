import {useNavigation, useRoute} from '@react-navigation/native';
import {fetchCommentsByPost} from '@services/commentRedux/commentSlice';
import {AppDispatch} from '@services/store';
import {FlashList} from '@shopify/flash-list';
import {Colors} from '../assets/color/Colors';
import {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from '../src/(tabs)/Home/components/CommentSection';
import BottomSheetReels, {
  BottomSheetReelsRef,
} from '../src/(tabs)/Reels/bottomSheet/reelBottomSheet';
import ReelsComponent from '../src/(tabs)/Reels/components/reelsComponent';
import {useTheme} from '../src/util/ThemeContext';
import {IHandles} from 'react-native-modalize/lib/options';
import ModalReaction from '../src/(tabs)/Home/components/ModalReaction';
import { ChevronLeft, Camera } from 'lucide-react-native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const AllReels = () => {
  const navigation = useNavigation();
  const route = useRoute<any>(); // Hoặc bạn có thể dùng kiểu tường minh với RouteProp nếu muốn
  const {reels, initialId} = route.params;

  const dispatch = useDispatch<AppDispatch>();
  const {theme} = useTheme();
  const color = Colors[theme];

  const sheetRef = useRef<BottomSheetReelsRef>(null);
  const sheetRefComment = useRef<BottomSheetCommentRef>(null);
  const flashListRef = useRef<FlashList<any>>(null);

  const [currentVisible, setCurrentVisible] = useState<string | null>(
    initialId,
  );
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isCurrentBookmarked, setIsCurrentBookmarked] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  //lấy danh sách lượt like
  const modalReactionRef = useRef<IHandles>(null);
  const [reactionPostId, setReactionPostId] = useState<string>('');
  const [reactionIsLiked, setReactionIsLiked] = useState<boolean>(false);

  const openReactionModal = (postId: string, isLiked: boolean) => {
    setReactionPostId(postId);
    setReactionIsLiked(isLiked);
    modalReactionRef.current?.open();
  };

  useEffect(() => {
    const index = reels.findIndex((item: any) => item._id === initialId);
    if (index !== -1 && flashListRef.current) {
      flashListRef.current.scrollToIndex({index, animated: false});
    }
  }, [initialId, reels]);

  const onViewRef = useRef(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0];
      const id = visibleItem?.item?._id;
      if (id) {
        setCurrentVisible(id);
      }
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={() => navigation.goBack()}>
          <View style={styles.iconDownContainer}>
            <ChevronLeft color={Colors.dark.text}/>
          </View>
          <Text style={styles.textHeader}>Reels</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Camera color={Colors.dark.text}/>
        </TouchableOpacity>
      </View>

      <FlashList
        ref={flashListRef}
        data={reels}
        renderItem={({item}) => {
          const shouldPlay = item._id === currentVisible;
          return (
            <ReelsComponent
              {...item}
              isFocused={true}
              currentVisible={shouldPlay}
              isFollow={item?.isFollow}
              muted={false}
              showBottomSheet={() => {
                setSelectedItem(item);
                setIsCurrentBookmarked(item.isBookmarked);
                sheetRef?.current?.open();
              }}
              openComment={() => {
                setSelectedPostId(item._id);
                dispatch(fetchCommentsByPost(item._id));
                sheetRefComment.current?.open();
              }}
              openReactionModal={() => openReactionModal(item._id, item.isLiked)}
            />
          );
        }}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{itemVisiblePercentThreshold: 70}}
        estimatedItemSize={height}
      />

      <BottomSheetReels
        ref={sheetRef}
        isBookmarked={isCurrentBookmarked}
        selectedItem={selectedItem}
      />
      <BottomSheetComment ref={sheetRefComment} postId={selectedPostId} />
      <ModalReaction ref={modalReactionRef} postId={reactionPostId} isLiked={reactionIsLiked}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: Colors.dark.transparent,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
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
    tintColor: Colors.dark.text,
  },
});

export default AllReels;
