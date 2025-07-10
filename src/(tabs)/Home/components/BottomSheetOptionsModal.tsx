import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import CustomPopupModal, {
  CustomPopupModalRef,
} from '../../../../components/Global/CustomPopupModal';

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
}

const CustomBottomSheetOptions = forwardRef<CustomBottomSheetOptionsRef, Props>(
  (
    {
      isBookmarked,
      topOptions = [],
      firstListOptions,
      secondListOptions,
      onBookmarkPress,
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
        {allOptions.map(opt => {
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
        })}
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
