import {useCallback, useMemo, useRef} from 'react';
import {
  postTopOptions,
  postFirstList,
  postSecondList,
  reportChoices,
  icons,
} from '../../../config/postOptions';
import {useSelector} from 'react-redux';
import {RootState} from '@services/store';
import {
  ConfigOption,
  CustomBottomSheetOptionsRef,
} from '../components/BottomSheetOptionsModal';

export const useItemHomeModal = (
  actions: any,
  state: any,
  isFollow: boolean,
) => {
  const intentRef = useRef<CustomBottomSheetOptionsRef>(null);
  const sheetRef = useRef<CustomBottomSheetOptionsRef>(null);
  const modalReactionRef = useRef<CustomBottomSheetOptionsRef>(null);
  const modalShareRef = useRef<CustomBottomSheetOptionsRef>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const {handleHidePost, handleFollowAction, handleBookmarkAction} = actions;
  const {setIsModalVisible} = state;

  const openOptions = useCallback(() => {
    sheetRef.current?.open();
  }, []);

  const openIntentions = useCallback(() => {
    intentRef.current?.open();
  }, []);

  const closeOptions = useCallback(() => {
    sheetRef.current?.close();
    setIsModalVisible(false);
  }, [setIsModalVisible]);

  const handleOpenReactionModal = useCallback(() => {
    modalReactionRef.current?.open();
  }, []);

  const handleOpenShareModal = useCallback(() => {
    modalShareRef.current?.open();
  }, []);

  const handleOptionSelect = useCallback(
    (id: string) => {
      switch (id) {
        case 'hide':
          handleHidePost();
          break;
        case 'unfollow':
          handleFollowAction(user);
          break;
        case 'report':
          openIntentions();
          break;
        case 'bookmark':
          handleBookmarkAction();
          break;
        default:
          break;
      }
      sheetRef.current?.close();
    },
    [
      handleHidePost,
      handleFollowAction,
      handleBookmarkAction,
      openIntentions,
      user,
    ],
  );

  const handleIntentionSelect = useCallback((id: string) => {
    intentRef.current?.close();
  }, []);

  const topOptions = useMemo<ConfigOption[]>(() => {
    return postTopOptions.map(opt => ({
      id: opt.id,
      label: opt.label,
      icon: opt.icon,
      labelColor: opt.labelColor,
      onPress: () => handleOptionSelect(opt.id),
    }));
  }, [handleOptionSelect]);

  const firstListOptions = useMemo<ConfigOption[]>(() => {
    return postFirstList.map(opt => ({
      id: opt.id,
      label:
        opt.id === 'unfollow'
          ? isFollow
            ? 'Bỏ theo dõi'
            : 'Theo dõi'
          : opt.label,
      icon:
        opt.id === 'unfollow'
          ? isFollow
            ? icons.unfollow
            : icons.follow
          : opt.icon,
      labelColor: opt.labelColor,
      onPress: () => handleOptionSelect(opt.id),
    }));
  }, [isFollow, handleOptionSelect]);

  const secondListOptions = useMemo<ConfigOption[]>(() => {
    return postSecondList.map(opt => ({
      id: opt.id,
      label: opt.label,
      icon: opt.icon,
      labelColor: opt.labelColor,
      onPress: () => handleOptionSelect(opt.id),
    }));
  }, [handleOptionSelect]);

  const intentionOptions = useMemo(() => {
    return reportChoices.map(opt => ({
      ...opt,
      onPress: () => handleIntentionSelect(opt.id),
    }));
  }, [handleIntentionSelect]);

  return {
    intentRef,
    sheetRef,
    modalReactionRef,
    modalShareRef,
    openOptions,
    openIntentions,
    closeOptions,
    handleOpenReactionModal,
    handleOpenShareModal,
    handleOptionSelect,
    handleIntentionSelect,
    topOptions,
    firstListOptions,
    secondListOptions,
    intentionOptions,
  };
};
