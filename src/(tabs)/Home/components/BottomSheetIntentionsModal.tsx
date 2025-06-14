import React, {Suspense} from 'react';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import BottomSheetIntentions from '../../../../components/BottomSheetIntentions';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

const BottomSheetIntentionsModal = ({
  sheetRef,
  title = 'Báo cáo',
  subtitle = 'Tại sao bạn báo cáo bài viết này?',
  content = 'Báo cáo của bạn sẽ được ẩn danh. Nếu ai đó đang gặp nguy hiểm, đừng chần chừ mà hãy báo ngay cho dịch vụ khẩn cấp tại địa phương.',
  options,
  onSelect,
}: {
  sheetRef: React.RefObject<Modalize>;
  title?: string;
  subtitle?: string;
  content?: string;
  options: any[];
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
          <BottomSheetIntentions
            title={title}
            subtitle={subtitle}
            content={content}
            options={options}
            onSelect={onSelect}
          />
        </Modalize>
      </Suspense>
    </Portal>
  );
};

export default BottomSheetIntentionsModal;
