import React from 'react';
import BottomSheetReels, { BottomSheetReelsRef } from '../bottomSheet/reelBottomSheet';
import BottomSheetComment, { BottomSheetCommentRef } from '../../../../src/(tabs)/Home/components/CommentSection';
import { PostWithMedia } from '@services/postRedux/postTypes';

interface Props {
  sheetRef: React.RefObject<BottomSheetReelsRef>;
  sheetRefComment: React.RefObject<BottomSheetCommentRef>;
  isBookmarked: boolean;
  selectedItem?: PostWithMedia | null;
  selectedPostId: React.RefObject<{ postId: string; receiverId: string }>;
}

const ReelsBottomSheets = ({
  sheetRef,
  sheetRefComment,
  isBookmarked,
  selectedItem,
  selectedPostId,
}: Props) => {
  return (
    <>
      <BottomSheetReels
        ref={sheetRef}
        isBookmarked={isBookmarked}
        selectedItem={selectedItem}
      />
      <BottomSheetComment
        ref={sheetRefComment}
        selectedPostRef={selectedPostId}
      />
    </>
  );
};

export default ReelsBottomSheets;
