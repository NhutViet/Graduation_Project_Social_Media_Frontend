import React, {useCallback, useMemo} from 'react';
import BottomSheetReels, {
  BottomSheetReelsRef,
} from '../bottomSheet/reelBottomSheet';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from '../../../../src/(tabs)/Home/components/CommentSection';
import {PostWithMedia} from '@services/postRedux/postTypes';
import ModalOtherReport, {
  ModalOtherReportHandle,
} from '../../../../src/(tabs)/Home/components/ModalOtherReport';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '@services/store';
import {reportPost} from '@services/reportPost/reportSlice';
import {hidePost} from '@services/postRedux/postSlice';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';
import {useHeadAlert} from '../../../../components/Global/HeadAlertProvider';
import {reportChoices} from '../../../../src/config/postOptions';
import {CustomBottomSheetOptionsRef} from '../../../../src/(tabs)/Home/components/BottomSheetOptionsModal';
import BottomSheetIntentionsModal from '../../../../src/(tabs)/Home/components/BottomSheetIntentionsModal';

interface Props {
  sheetRef: React.RefObject<BottomSheetReelsRef>;
  sheetRefComment: React.RefObject<BottomSheetCommentRef>;
  isBookmarked: boolean;
  selectedItem?: PostWithMedia | null;
  selectedPostId: React.RefObject<{postId: string; receiverId: string}>;
  otherRef: React.RefObject<ModalOtherReportHandle>;
  postId: string;
  intentRef: React.RefObject<CustomBottomSheetOptionsRef>;
}

const ReelsBottomSheets = ({
  sheetRef,
  sheetRefComment,
  isBookmarked,
  selectedItem,
  selectedPostId,
  otherRef,
  postId,
  intentRef,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const {showAlert} = useHeadAlert();
  const handleHidePost = useCallback(() => {
    dispatch(hidePost(postId))
      .unwrap()
      .catch(() => GlobalAlertManager.show('Thất bại', 'Ẩn bài viết lỗi'));
  }, [postId, dispatch]);

  const handleIntentionSelect = useCallback(
    (label: string, description?: string) => {
      if (label !== 'other') {
        dispatch(reportPost({targetId: postId, reason: label}))
          .unwrap()
          .then(() => {
            showAlert(
              'Thành công',
              'Bài viết này sẽ được báo cáo và kiểm duyệt.',
            );
            handleHidePost();
            intentRef.current?.close();
          })
          .catch(() => {
            showAlert('Thất bại', 'Có lỗi xảy ra khi báo cáo.');
          });
      } else {
        otherRef.current?.open();
      }
    },
    [],
  );

  const intentionOptions = useMemo(
    () =>
      reportChoices.map(opt => ({
        ...opt,
        onPress: () => handleIntentionSelect(opt.id),
      })),
    [handleIntentionSelect],
  );
  return (
    <>
      <BottomSheetReels
        ref={sheetRef}
        isBookmarked={isBookmarked}
        selectedItem={selectedItem}
        handleReportPost={() => {
          sheetRef.current?.close();
          intentRef.current?.open();
        }}
      />

      <BottomSheetIntentionsModal
        ref={intentRef}
        options={intentionOptions}
        onSelect={handleIntentionSelect}
      />

      <BottomSheetComment
        ref={sheetRefComment}
        selectedPostRef={selectedPostId}
      />
      <ModalOtherReport
        ref={otherRef}
        onSubmit={desc => {
          dispatch(
            reportPost({targetId: postId, reason: 'OTHER', description: desc}),
          )
            .unwrap()
            .then(() => {
              showAlert(
                'Thành công',
                'Bài viết sẽ được báo cáo và kiểm duyệt.',
              );
              handleHidePost();
              otherRef.current?.close();
            })
            .catch(() => {
              showAlert('Thất bại', 'Có lỗi xảy ra khi báo cáo.');
            });
        }}
      />
    </>
  );
};

export default ReelsBottomSheets;
