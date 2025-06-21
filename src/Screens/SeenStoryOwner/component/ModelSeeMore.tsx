import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {FlashList} from '@shopify/flash-list';

const ModalSeeMore = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
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
                <Image
                  style={styles.icon}
                  source={require('../../../../assets/icon/x.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.mid}>
              <TouchableOpacity>
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
    color: 'red',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
  },
  mid: {
    alignItems: 'center',
    marginTop: 20,
  },
});
