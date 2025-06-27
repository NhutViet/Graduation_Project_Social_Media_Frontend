import {useCallback, useMemo, useRef} from 'react';
import {Modalize} from 'react-native-modalize';
import {
  postTopOptions,
  postFirstList,
  postSecondList,
  reportChoices,
} from '../../../config/postOptions';
import { useNavigation } from '@react-navigation/native';

export const useItemHomeModal = (actions: any, state: any) => {
  const navigation: any = useNavigation();
  const intentRef = useRef<Modalize>(null);
  const sheetRef = useRef<Modalize>(null);
  const modalReactionRef = useRef<Modalize>(null);

  const {handleHidePost, handleFollowAction, handleBookmarkAction} = actions;
  const {setIsModalVisible} = state;

  /** Open bottom sheet options */
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

  /** Handle selecting an option from the first sheet */
  const handleOptionSelect = useCallback(
    (id: string) => {
      switch (id) {
        case 'hide':
          handleHidePost();
          break;
        case 'unfollow':
          handleFollowAction();
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
    [handleHidePost, handleFollowAction, openIntentions],
  );

  const handleIntentionSelect = useCallback((id: string) => {
    intentRef.current?.close();
  }, []);

  const topOptions = useMemo(
    () =>
      postTopOptions.map(opt => ({
        ...opt,
        onPress: () => handleOptionSelect(opt.id),
      })),
    [handleOptionSelect],
  );

  const firstListOptions = useMemo(
    () => {
      return postFirstList.map(opt => {
        if (opt.id === 'unfollow') {
          const isOwnPost = state.postUserID === state.userID;
          return {
            ...opt,
            label: isOwnPost
              ? 'Tài khoản của bạn'
              : state.follow
              ? 'Bỏ theo dõi'
              : 'Theo dõi',
            onPress: () => handleOptionSelect(opt.id)
          };
        } else {
          return {
            ...opt,
            onPress: () => handleOptionSelect(opt.id),
          };
        }
      });
    }, [handleOptionSelect, state.follow, state.postUserID, state.userID, navigation, postFirstList]);

  const secondListOptions = useMemo(
    () =>
      postSecondList.map(opt => ({
        ...opt,
        onPress: () => handleOptionSelect(opt.id),
      })),
    [handleOptionSelect],
  );

  const intentionOptions = useMemo(
    () =>
      reportChoices.map(opt => ({
        ...opt,
        onPress: () => handleIntentionSelect(opt.id),
      })),
    [handleIntentionSelect],
  );

  return {
    intentRef,
    sheetRef,
    modalReactionRef,
    openOptions,
    openIntentions,
    closeOptions,
    handleOpenReactionModal,
    handleOptionSelect,
    handleIntentionSelect,
    topOptions,
    firstListOptions,
    secondListOptions,
    intentionOptions,
  };
};
