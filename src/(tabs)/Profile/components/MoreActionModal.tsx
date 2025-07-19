import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '@assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import CustomPopupModal, {
  CustomPopupModalRef,
} from '../../../../components/Global/CustomPopupModal';

export type MoreActionPopupRef = {
  open: () => void;
  close: () => void;
  setUser: (id: string) => void;
};

type MoreActionPopupProps = {
  onUnfollow: (targetId: string) => void;
  onReport: (targetId: string) => void;
};

const MoreActionPopup = forwardRef<MoreActionPopupRef, MoreActionPopupProps>(
  ({onUnfollow, onReport}, ref) => {
    const modalRef = useRef<CustomPopupModalRef>(null);
    const {theme} = useTheme();
    const colors = Colors[theme];
    const userIdRef = useRef<string | null>(null);

    useImperativeHandle(ref, () => ({
      open: () => modalRef.current?.open(),
      close: () => modalRef.current?.close(),
      setUser: (id: string) => (userIdRef.current = id),
    }));

    const handleUnfollow = () => {
      if (userIdRef.current) onUnfollow(userIdRef.current);
      modalRef.current?.close();
    };

    const handleReport = () => {
      if (userIdRef.current) onReport(userIdRef.current);
      modalRef.current?.close();
    };

    return (
      <CustomPopupModal
        ref={modalRef}
        backgroundColor={colors.white}
        cancelText="Hủy"
        cancelTextColor="#FF3B30">
        <TouchableOpacity style={styles.option} onPress={handleUnfollow}>
          <Text style={[styles.text, {color: '#FF3B30'}]}>Bỏ theo dõi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleReport}>
          <Text style={[styles.text, {color: colors.text}]}>Báo cáo</Text>
        </TouchableOpacity>
      </CustomPopupModal>
    );
  },
);

export default MoreActionPopup;

const styles = StyleSheet.create({
  option: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
    fontWeight: '500',
  },
});
