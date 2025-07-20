import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  Video,
  FileText,
  Image as ImageIcon,
  CircleFadingArrowUp,
  Camera,
  Sparkles,
} from 'lucide-react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import CustomPopupModal, {
  CustomPopupModalRef,
} from '../../../../components/Global/CustomPopupModal';

export type ModalCreateRef = {
  open: () => void;
  close: () => void;
};

interface ModalCreateProps {
  onSelect: (optionId: string) => void;
}

const options = [
  {id: 'reels', label: 'Thước phim', icon: Video},
  {id: 'post', label: 'Bài viết', icon: FileText},
  {id: 'story', label: 'Tin', icon: ImageIcon},
  {id: 'highlight', label: 'Tin nổi bật', icon: CircleFadingArrowUp},
];

const ModalCreate = forwardRef<ModalCreateRef, ModalCreateProps>(
  ({onSelect}, ref) => {
    const popupRef = useRef<CustomPopupModalRef>(null);
    const {theme} = useTheme();
    const color = Colors[theme];

    useImperativeHandle(ref, () => ({
      open: () => popupRef.current?.open(),
      close: () => popupRef.current?.close(),
    }));

    return (
      <CustomPopupModal
        ref={popupRef}
        title="Tạo mới"
        cancelText="Hủy"
        cancelTextColor="#FF3B30"
        backgroundColor={color.background}>
        <View style={{gap: 10, paddingBottom: 10}}>
          {options.map(({id, label, icon: Icon}) => (
            <TouchableOpacity
              key={id}
              style={[styles.option, {backgroundColor: color.background}]}
              onPress={() => {
                onSelect(id);
                popupRef.current?.close();
              }}>
              <View style={styles.icon}>
                <Icon size={22} color={color.text} />
              </View>
              <Text style={[styles.label, {color: color.text}]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </CustomPopupModal>
    );
  },
);

export default ModalCreate;

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  icon: {
    width: 30,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
});
