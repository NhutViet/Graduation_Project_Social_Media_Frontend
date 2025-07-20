import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Colors } from '@assets/color/Colors';
import { useTheme } from '../../../../src/util/ThemeContext';
import { ReportReason } from '@services/reportUserRedux/reportUserTypes';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@services/store';
import { fetchReportUser } from '@services/reportUserRedux/reportUserSlice';
import { Modalize } from 'react-native-modalize';
import { ChevronLeft } from 'lucide-react-native';
import { GlobalAlertManager } from '../../../../components/Global/AlertModal';

interface ReportUserModalProps {
  //
}

export interface ReportUserModalHandle {
  open: (targetId: string) => void;
  close: () => void;
}

const reasonLabels: Record<ReportReason, string> = {
  [ReportReason.HARASSMENT_AND_BULLYING]: 'Quấy rối và bắt nạt',
  [ReportReason.HATE_SPEECH]: 'Lời nói thù địch',
  [ReportReason.IMPERSONATION_FAKE_ACCOUNTS]: 'Giả mạo/tài khoản giả',
  [ReportReason.GRAPHIC_CONTENT]: 'Nội dung bạo lực/đẫm máu',
  [ReportReason.THREATS_AND_VIOLENCE]: 'Đe dọa và bạo lực',
  [ReportReason.SCAMS_AND_FRAUD]: 'Lừa đảo và gian lận',
  [ReportReason.SENSITIVE_PERSONAL_INFO]: 'Tiết lộ thông tin cá nhân nhạy cảm',
  [ReportReason.SELF_HARM]: 'Tự làm hại bản thân',
  [ReportReason.OTHER]: 'Khác',
};

const modalHeight1 = Dimensions.get('window').height * 0.9;
const modalHeight2 = Dimensions.get('window').height * 0.4;

const ReportUserModal = forwardRef<
  ReportUserModalHandle,
  ReportUserModalProps
>((_props, ref) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const modalizeRef = useRef<Modalize>(null);
  const [targetId, setTargetId] = useState<string>('');
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState<string>('');
  const descriptionInputRef = useRef<TextInput>(null);
  const dispatch = useDispatch<AppDispatch>();

  // expose open/close ra bên ngoài
  useImperativeHandle(ref, () => ({
    open: (id: string) => {
      setTargetId(id);
      setStep(1);
      setSelectedReason(null);
      setDescription('');
      modalizeRef.current?.open();
    },
    close: () => {
      modalizeRef.current?.close();
    },
  }));

  const onChooseReason = (reason: ReportReason) => {
    setSelectedReason(reason);
    setStep(2);
    setTimeout(() => {
      descriptionInputRef.current?.focus();
    }, 100);
  };

  const onSubmit = async () => {
    if (!selectedReason) return;
      try {
      await dispatch(
        fetchReportUser({
          targetId,
          reason: selectedReason,
          description: description.trim(),
        })
      ).unwrap();

      GlobalAlertManager.show(
        'Thành công',
        'Báo cáo người dùng thành công',
      );
    } catch (err: any) {
      GlobalAlertManager.show(
        'Thất bại',
        err?.message || 'Báo cáo không thành công, vui lòng thử lại sau.'
      );
    } finally {
      modalizeRef.current?.close();
    }
  };

  const onReturn = () => {
    setStep(1);
    setDescription('');
    setSelectedReason(null);
  }

  return (
    <Modalize
      ref={modalizeRef}
      snapPoint={400}
      modalStyle={[styles.modal, {backgroundColor: color.background}]}
      handleStyle={[styles.handle, {backgroundColor: color.backgroundSecondary}]}
      adjustToContentHeight
      handlePosition="inside"
      panGestureEnabled={true}>
      <KeyboardAvoidingView style={{borderTopLeftRadius: 16, borderTopRightRadius: 16,}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.container, {height: step === 1 ? modalHeight1 : modalHeight2, backgroundColor: color.background}]}>
          {step === 1 && (
            <>
              <Text style={[styles.title, {color: color.text}]}>Báo cáo</Text>
              <Text style={[styles.subtitle, {color: color.text}]}>Bạn muốn báo cáo điều gì?</Text>
              <Text style={[styles.note, {color: color.textSecondary}]}>
                Báo cáo của bạn sẽ được ẩn danh. Nếu ai đó đang gặp nguy hiểm, đừng
                chần chừ mà hãy liên hệ khẩn cấp.
              </Text>

              <View style={styles.options}>
                {Object.values(ReportReason).map(reason => (
                  <TouchableOpacity
                    key={reason}
                    style={styles.option}
                    onPress={() => onChooseReason(reason)}>
                    <Text style={[styles.optionText, {color: color.text}]}>
                      {reasonLabels[reason as ReportReason]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          
          {step === 2 && selectedReason && (
            <>
              <TouchableOpacity onPress={onReturn}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <ChevronLeft size={17} color={color.text}/>
                  <Text style={[styles.backText, {color: color.text}]}>Chọn lại lý do</Text>
                </View>
              </TouchableOpacity>
              <Text style={[styles.title, {color: color.text}]}>{reasonLabels[selectedReason]}</Text>
              <TextInput
                style={[styles.input, {color: color.text, borderColor: color.gray}]}
                placeholder="Mô tả chi tiết..."
                placeholderTextColor={color.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                ref={descriptionInputRef}
              />

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.btn, {backgroundColor: color.primary}]}
                  onPress={onSubmit}
                >
                  <Text style={[styles.btnText, { color: color.white }]}>
                    Gửi
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modalize>
  );
});

export default ReportUserModal;

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
  container: {
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },
  note: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  options: {
    maxHeight: 250,
  },
  option: {
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 16,
  },
  backText: { marginBottom: 3 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    marginVertical: 12,
  },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  btnText: { fontSize: 16 },
});