import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {relationAction} from '../../../../services/relationRedux/relationSlice';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../services/store';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';
import CustomPopupModal, {
  CustomPopupModalRef,
} from '../../../../components/Global/CustomPopupModal';

interface OptionModalProps {
  userID: string;
  isBlock: boolean;
  onBlockChange: (newState: boolean) => void;
}

const OptionModal = forwardRef<CustomPopupModalRef, OptionModalProps>(
  ({userID, isBlock: initialIsBlock, onBlockChange}, ref) => {
    const {theme} = useTheme();
    const color = Colors[theme];
    const dispatch = useDispatch<AppDispatch>();

    const modalRef = useRef<CustomPopupModalRef>(null);
    useImperativeHandle(ref, () => ({
      open: () => modalRef.current?.open(),
      close: () => modalRef.current?.close(),
    }));

    const [isBlock, setIsBlock] = useState(initialIsBlock);

    useEffect(() => {
      setIsBlock(initialIsBlock);
    }, [initialIsBlock]);

    const toggleBlock = async () => {
      const actionType = isBlock ? 'unblock' : 'block';
      // optimistic update
      setIsBlock(!isBlock);
      onBlockChange(!isBlock);
      try {
        await dispatch(
          relationAction({
            targetId: userID,
            action: actionType,
          }),
        ).unwrap();
      } catch (error) {
        GlobalAlertManager.show('Thất bại', 'Vui lòng thử lại sau.');
        // rollback nếu lỗi
        setIsBlock(isBlock);
        onBlockChange(isBlock);
      }
    };

    return (
      <CustomPopupModal
        ref={modalRef}
        title={undefined}
        showCancelButton={true}
        cancelText="Huỷ"
        cancelTextColor="red"
        backgroundColor={color.background}
        onCancel={() => modalRef.current?.close()}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Hạn chế</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={toggleBlock}>
            <Text style={styles.optionText}>
              {isBlock ? 'Bỏ chặn' : 'Chặn'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Báo cáo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={[styles.optionText, {color: color.text}]}>
              Sao chép URL Trang cá nhân
            </Text>
          </TouchableOpacity>
        </View>
      </CustomPopupModal>
    );
  },
);

export default OptionModal;

const styles = StyleSheet.create({
  content: {
    justifyContent: 'flex-start',
  },
  option: {
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    color: 'red',
  },
});
