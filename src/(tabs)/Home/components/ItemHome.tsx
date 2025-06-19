import React, {useEffect} from 'react';
import {View, Text, FlatList, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Portal} from 'react-native-portalize';
import Sound from 'react-native-sound';
import {ItemHomeStyles} from '../component_styles/ItemHomeStyles';
import {formatTimeAgo} from '../util';
import {
  addLikedPost,
  removeLikedPost,
} from '../../../../services/reactionRedux/reactionReducer';
import {AppDispatch, RootState} from '../../../../services/store';
import ModalShare from './ModalShare';
import ModalReaction from './ModalReaction';
import BottomSheetIntentionsModal from './BottomSheetIntentionsModal';
import BottomSheetOptionsModal from './BottomSheetOptionsModal';
import {
  RenderMediaItem,
  RenderMuteButton,
  RenderPagination,
} from './MediaComponent';
import {ItemHomeProps} from '../types';
import {useItemHomeState} from '../hook/useItemHomeState';
import {useItemHomeActions} from '../hook/useItemHomeActions';
import {useItemHomeModal} from '../hook/useItemHomeModal';
import {useItemHomeUtils} from '../util/itemHomeUtils';
import {useItemHomeAudio} from '../hook/useItemHomeAudio';
import {ItemHomeHeader} from './ItemHomeHeader';
import {ItemHomeActions} from './ItemHomeActions';

Sound.setCategory('Playback');
const screenWidth = Dimensions.get('window').width;

const ItemHome = (props: ItemHomeProps) => {
  const {
    _id,
    type,
    caption,
    createdAt,
    media,
    user,
    openComment,
    isFocused,
    currentVisible,
    isLike,
    isBookmarked,
    commentCount,
    likeCount,
    share,
    music,
  } = props;
  const navigation: any = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const state = useItemHomeState(props);
  const actions = useItemHomeActions(props, state);
  const modal = useItemHomeModal(actions, state);
  const utils = useItemHomeUtils(props, state);

  useEffect(() => {
    state.setIsBookmark(isBookmarked);
  }, [isBookmarked]);

  const isLikedFromRedux = useSelector((state: RootState) =>
    state.reactions.likePosts.includes(_id),
  );

  useEffect(() => {
    state.setIsLiked(isLikedFromRedux);
  }, [isLikedFromRedux]);

  useItemHomeAudio(props, state.muted);

  useEffect(() => {
    state.setNumLike(likeCount);
  },[likeCount]);

  useEffect(() => {
    state.setIsLiked(isLike);
    if (isLike) {
      dispatch(addLikedPost(_id));
    } else {
      dispatch(removeLikedPost({postId: _id}));
    }
  }, [_id, isLike]);

  const handleUserPress = () => {
    navigation.navigate('ProfileComp', {userID: user._id});
  };

  const handleMediaScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / screenWidth);
    state.setCurrentIndex(newIndex);
  };

  return (
    <View style={ItemHomeStyles.wrapper}>
      <BottomSheetOptionsModal
        sheetRef={modal.sheetRef}
        isBookmarked={state.isBookmark}
        topOptions={modal.topOptions}
        firstListOptions={modal.firstListOptions}
        secondListOptions={modal.secondListOptions}
        onSelect={modal.handleOptionSelect}
      />

      <BottomSheetIntentionsModal
        sheetRef={modal.intentRef}
        options={modal.intentionOptions}
        onSelect={modal.handleIntentionSelect}
      />

      <View style={ItemHomeStyles.container}>
        {!utils.isReel && <View style={ItemHomeStyles.blockWhite} />}

        <View style={ItemHomeStyles.video}>
          <FlatList
            data={media}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item._id.toString()}
            renderItem={({item}) => (
              <RenderMediaItem
                item={item}
                isFocused={isFocused}
                currentVisible={currentVisible}
                muted={state.muted}
              />
            )}
            onMomentumScrollEnd={handleMediaScroll}
          />
          <RenderPagination media={media} currentIndex={state.currentIndex} />
        </View>

        <ItemHomeHeader
          user={user}
          textColor={utils.textColor}
          borderColor={utils.borderColor}
          iconTintColor={utils.iconTintColor}
          follow={state.follow}
          onUserPress={handleUserPress}
          onFollowPress={actions.handleFollowAction}
          onOptionsPress={modal.openOptions}
        />

        <RenderMuteButton
          muted={state.muted}
          setMuted={state.setMuted}
          isPostWithoutMusic={type === 'post' && !music}
        />
      </View>

      <View style={{backgroundColor: utils.color.background, padding: 10}}>
        <ItemHomeActions
          iconColor={utils.iconColor}
          likedColor={utils.likedColor}
          bookmarkColor={utils.bookmarkColor}
          isLiked={state.isLiked}
          isBookmarked={state.isBookmark}
          numLike={state.numLike}
          commentCount={commentCount}
          share={share}
          onLikePress={actions.handleLike}
          onCommentPress={() => openComment(_id)}
          onSharePress={actions.handleOpenModalShare}
          onBookmarkPress={actions.handleBookmarkAction}
          onReactionModalPress={modal.handleOpenReactionModal}
        />

        <Text style={[ItemHomeStyles.title, {color: utils.iconColor}]}>
          {caption}
        </Text>
        <Text style={{color: utils.iconColor, fontSize: 12}}>
          {formatTimeAgo(createdAt)}
        </Text>
      </View>

      <ModalShare
        visible={state.visibleModalShare}
        onClose={() => state.setVisibleModalShare(false)}
        friends={utils.follows}
      />

      <Portal>
        <ModalReaction
          ref={modal.modalReactionRef}
          postId={_id}
          isLiked={state.isLiked}
        />
      </Portal>
    </View>
  );
};

const areEqual = (prev: ItemHomeProps, next: ItemHomeProps) => {
  return (
    prev._id === next._id &&
    prev.currentVisible === next.currentVisible &&
    prev.isFocused === next.isFocused
  );
};

export default React.memo(ItemHome, areEqual);
