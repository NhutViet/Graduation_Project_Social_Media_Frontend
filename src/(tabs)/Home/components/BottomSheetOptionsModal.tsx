import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import CustomPopupModal, {
  CustomPopupModalRef,
} from '../../../../components/Global/CustomPopupModal';
import {X} from 'lucide-react-native';

export interface ConfigOption {
  id: string;
  icon: any;
  label: string;
  labelColor?: string;
  onPress?: () => void;
}

export interface CustomBottomSheetOptionsRef {
  open: () => void;
  close: () => void;
}

interface Props {
  isBookmarked?: boolean;
  topOptions?: ConfigOption[];
  firstListOptions: ConfigOption[];
  secondListOptions: ConfigOption[];
  onBookmarkPress: () => void;
  onDeleteMyPost?: () => void;
  isCurrentUser?: boolean;
}

const CustomBottomSheetOptions = forwardRef<CustomBottomSheetOptionsRef, Props>(
  (
    {
      isBookmarked,
      topOptions = [],
      firstListOptions,
      secondListOptions,
      onBookmarkPress,
      onDeleteMyPost,
      isCurrentUser = false,
    },
    ref,
  ) => {
    const modalRef = useRef<CustomPopupModalRef>(null);
    const {theme} = useTheme();
    const palette = Colors[theme];

    useImperativeHandle(ref, () => ({
      open: () => modalRef.current?.open(),
      close: () => modalRef.current?.close(),
    }));

    const allOptions = [
      ...topOptions,
      ...firstListOptions,
      ...secondListOptions,
    ];

    return (
      <CustomPopupModal ref={modalRef} backgroundColor={palette.background}>
        {isCurrentUser ? (
          <TouchableOpacity style={styles.optionButton} onPress={onDeleteMyPost}>
            <View style={styles.optionIcon}>
              <X size={22} color={palette.text} />
            </View>
            <Text style={[styles.optionLabel, {color: palette.text}]}>
              Xóa bài viết
            </Text>
          </TouchableOpacity>
        ) : (
          allOptions.map(opt => {
            const Icon = opt.icon;
            return (
              <TouchableOpacity
                key={opt.id}
                style={styles.optionButton}
                onPress={opt.id === 'bookmark' ? onBookmarkPress : opt.onPress}>
                <View style={styles.optionIcon}>
                  <Icon
                    size={22}
                    color={
                      opt.labelColor ??
                      (isBookmarked && opt.id === 'bookmark'
                        ? '#F2C641'
                        : palette.text)
                    }
                    {...(isBookmarked && opt.id === 'bookmark'
                      ? {fill: '#F2C641'}
                      : {})}
                  />
                </View>
                <Text
                  style={[
                    styles.optionLabel,
                    {color: opt.labelColor ?? palette.text},
                  ]}>
                  {isBookmarked && opt.id === 'bookmark' ? 'Đã lưu' : opt.label}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </CustomPopupModal>
    );
  },
);

export default CustomBottomSheetOptions;

const styles = StyleSheet.create({
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionIcon: {
    width: 24,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});
