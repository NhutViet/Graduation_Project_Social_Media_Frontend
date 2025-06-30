import React, {Suspense} from 'react';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useTheme} from '../../../util/ThemeContext';
import BottomSheetOptions from '../../../../components/BottomSheetOptions';
import {Colors} from '../../../../assets/color/Colors';

const BottomSheetOptionsModal = ({
  sheetRef,
  isBookmarked,
  onBookmarkPress,
  topOptions,
  firstListOptions,
  secondListOptions,
  onSelect,
}: {
  sheetRef: React.RefObject<Modalize>;
  isBookmarked?: boolean;
  isFollowing?: boolean;
  topOptions?: any[];
  firstListOptions: any[];
  secondListOptions: any[];
  onBookmarkPress: () => void;
  onSelect: (value: any) => void;
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <Portal>
      <Suspense fallback={null}>
        <Modalize
          ref={sheetRef}
          adjustToContentHeight
          handlePosition="inside"
          modalStyle={{
            backgroundColor: color.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            overflow: 'hidden',
            paddingTop: 24,
          }}
          handleStyle={{
            backgroundColor: color.text,
            width: 40,
            height: 5,
            borderRadius: 2.5,
            marginVertical: 8,
            alignSelf: 'center',
            top: 8,
          }}>
          <BottomSheetOptions
            topOptions={topOptions ?? []}
            isBookmarked={isBookmarked}
            listOptionGroups={[firstListOptions, secondListOptions]}
            onSelect={onSelect}
            onBookmarkPress={onBookmarkPress}
          />
        </Modalize>
      </Suspense>
    </Portal>
  );
};

export default BottomSheetOptionsModal;
