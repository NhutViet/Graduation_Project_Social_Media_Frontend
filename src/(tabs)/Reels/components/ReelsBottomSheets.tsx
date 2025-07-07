import React from 'react';
import BottomSheetReels, { BottomSheetReelsRef } from './bottomSheet/reelBottomSheet';
import BottomSheetComment, { BottomSheetCommentRef } from '../Home/components/CommentSection';

interface Props {
  sheetRef: React.RefObject<BottomSheetReelsRef>;
  sheetRefComment: React.RefObject<BottomSheetCommentRef>;
  isBookmarked: boolean;
  selectedItem: any;
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
