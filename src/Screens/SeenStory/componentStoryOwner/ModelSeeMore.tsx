import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {X} from 'lucide-react-native';
import {Colors} from '@assets/color/Colors';

const ModalSeeMore = ({
  visible,
  onClose,
  onDelete,
  users,
}: {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  users?: any[];
}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <Pressable style={styles.modalContainer} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Tin Đang hoạt động</Text>
              <TouchableOpacity onPress={onClose}>
                <X color={'#fff'} />
              </TouchableOpacity>
            </View>
            <View style={styles.mid}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={onDelete}
                activeOpacity={0.7}>
                <Text style={styles.txtRemoveStory}>Xoá tin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ModalSeeMore;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#000',
    width: '100%',
    height: '20%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flex: 1,
    margin: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  txtRemoveStory: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',

    justifyContent: 'center',
    alignItems: 'center',
  },
  mid: {
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
});
