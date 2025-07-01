import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';

export const ModalShare = ({visible, onClose}: any) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Chia sẻ bài viết</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.option}>Sao chép liên kết</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.option}>Gửi tin nhắn</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  option: {
    fontSize: 16,
    marginVertical: 8,
  },
});
