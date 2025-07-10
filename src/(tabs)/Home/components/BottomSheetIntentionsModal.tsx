import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import CustomPopupModal, {
  CustomPopupModalRef,
} from '../../../../components/Global/CustomPopupModal';

export interface IntentionOptionConfig {
  id: string;
  label: string;
}

export interface BottomSheetIntentionsModalRef {
  open: () => void;
  close: () => void;
}

interface BottomSheetIntentionsModalProps {
  title?: string;
  subtitle?: string;
  content?: string;
  options: IntentionOptionConfig[];
  onSelect: (id: string) => void;
}

const BottomSheetIntentionsModal = forwardRef<
  BottomSheetIntentionsModalRef,
  BottomSheetIntentionsModalProps
>(
  (
    {
      title = 'Báo cáo',
      subtitle = 'Tại sao bạn báo cáo bài viết này?',
      content = 'Báo cáo của bạn sẽ được ẩn danh. Nếu ai đó đang gặp nguy hiểm, đừng chần chừ mà hãy báo ngay cho dịch vụ khẩn cấp tại địa phương.',
      options,
      onSelect,
    },
    ref,
  ) => {
    const popupRef = useRef<CustomPopupModalRef>(null);
    const {theme} = useTheme();
    const palette = Colors[theme];

    useImperativeHandle(ref, () => ({
      open: () => popupRef.current?.open(),
      close: () => popupRef.current?.close(),
    }));

    const handlePress = (id: string) => {
      popupRef.current?.close();
      onSelect(id);
    };

    return (
      <CustomPopupModal
        ref={popupRef}
        backgroundColor={palette.background}
        cancelText="Huỷ"
        cancelTextColor="#ff3b30">
        <View style={styles.container}>
          <Text style={[styles.title, {color: palette.text}]}>{title}</Text>
          <View style={styles.separator} />
          <View style={styles.inner}>
            <Text style={[styles.subtitle, {color: palette.text}]}>
              {subtitle}
            </Text>
            <Text style={[styles.content, {color: palette.text}]}>
              {content}
            </Text>

            <View style={styles.choicesWrapper}>
              {options.map((opt, idx) => (
                <React.Fragment key={opt.id}>
                  <TouchableOpacity
                    onPress={() => handlePress(opt.id)}
                    activeOpacity={0.7}>
                    <Text style={[styles.choiceText, {color: palette.text}]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                  {idx < options.length - 1 && (
                    <View style={styles.choiceSpacing} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>
      </CustomPopupModal>
    );
  },
);

export default BottomSheetIntentionsModal;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 16,
  },
  inner: {
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  content: {
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  choicesWrapper: {
    gap: 8,
  },
  choiceText: {
    fontSize: 16,
    fontWeight: '500',
  },
  choiceSpacing: {
    height: 12,
  },
});
