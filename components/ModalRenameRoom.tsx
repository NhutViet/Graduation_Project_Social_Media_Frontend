import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Colors} from '../assets/color/Colors';

export const ModalRenameRoom = ({
  visible,
  onClose,
  onSubmit,
  currentName,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newName: string) => void;
  currentName: string;
  theme: 'light' | 'dark';
}) => {
  const [name, setName] = useState(currentName);
  const color = Colors[theme];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, {backgroundColor: color.background}]}>
          <Text style={[styles.title, {color: color.text}]}>
            Đổi tên đoạn hội thoại
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nhập tên mới"
            placeholderTextColor={color.textSecondary}
            style={[
              styles.input,
              {color: color.text, borderColor: color.border},
            ]}
          />
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={[styles.textNormal, {color: 'red'}]}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (name.trim()) {
                  onSubmit(name.trim());
                }
              }}>
              <Text style={[styles.textNormal, {color: '#007BFF'}]}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 16,
  },
  textNormal: {
    fontSize: 16,
  },
});
