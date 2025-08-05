import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '@assets/color/Colors';
import { useTheme } from '../../../../src/util/ThemeContext';

export interface ModalOtherReportHandle {
  open: () => void;
  close: () => void;
}
interface ModalOtherReportProps {
  onSubmit: (description?: string) => void;
}

const SNAP_POINT = Dimensions.get('window').height * 0.4;

const ModalOtherReport = forwardRef<ModalOtherReportHandle, ModalOtherReportProps>(
  ({ onSubmit }, ref) => {
    const { theme } = useTheme();
    const color = Colors[theme];
    const modalizeRef = useRef<Modalize>(null);
    const [description, setDescription] = useState('');

    // Expose open/close
    useImperativeHandle(ref, () => ({
      open: () => {
        setDescription('');
        modalizeRef.current?.open();
      },
      close: () => {
        modalizeRef.current?.close();
      },
    }));

    const handleSend = () => {
      onSubmit(description.trim());
    };

    const handleCancel = () => {
      modalizeRef.current?.close();
    };

    return (
      <Modalize
        ref={modalizeRef}
        snapPoint={SNAP_POINT}
        modalStyle={[styles.modal, { backgroundColor: color.background }]}
        handleStyle={[styles.handle, { backgroundColor: color.backgroundSecondary }]}
        adjustToContentHeight
        handlePosition="inside"
        panGestureEnabled>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboard}>
          <View style={[styles.container, { backgroundColor: color.background }]}>
            <TouchableOpacity style={styles.backRow} onPress={handleCancel}>
              <ChevronLeft size={20} color={color.text} />
              <Text style={[styles.backText, { color: color.text }]}>Hủy</Text>
            </TouchableOpacity>

            <Text style={[styles.title, { color: color.text }]}>Khác</Text>

            <TextInput
              style={[styles.input, { borderColor: color.gray, color: color.text }]}
              placeholder="Mô tả chi tiết..."
              placeholderTextColor={color.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: color.primary }]}
                onPress={handleSend}>
                <Text style={[styles.btnText, { color: color.white }]}>Gửi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modalize>
    );
  }
);

export default ModalOtherReport;

const styles = StyleSheet.create({
  modal: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
  },
  keyboard: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  container: {
    padding: 16,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backText: {
    fontSize: 16,
    marginLeft: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    marginVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
