import React from 'react';
import BottomSheetReels, { BottomSheetReelsRef } from '../bottomSheet/reelBottomSheet';
import BottomSheetComment, { BottomSheetCommentRef } from '../../../../src/(tabs)/Home/components/CommentSection';
import { PostWithMedia } from '@services/postRedux/postTypes';

interface Props {
  sheetRef: React.RefObject<BottomSheetReelsRef>;
  sheetRefComment: React.RefObject<BottomSheetCommentRef>;
  isBookmarked: boolean;
  selectedItem?: PostWithMedia | null;
  selectedPostId: { postId: string; receiverId: string };
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
        postId={selectedPostId.postId}
        receiverId={selectedPostId.receiverId}
      />
    </>
  );
};

export default ReelsBottomSheets;
