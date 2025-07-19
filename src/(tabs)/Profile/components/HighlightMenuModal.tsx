import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import {Trash2, Edit} from 'lucide-react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

interface HighlightMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  highlightName?: string;
}

const HighlightMenuModal: React.FC<HighlightMenuModalProps> = ({
  visible,
  onClose,
  onDelete,
  onEdit,
  highlightName,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  const handleDelete = () => {
    onClose();
    onDelete();
  };

  const handleEdit = () => {
    onClose();
    onEdit();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.modalContent, {backgroundColor: color.background}]}>
          <View style={styles.header}>
            <Text style={[styles.title, {color: color.text}]}>
              {highlightName || 'Highlight'}
            </Text>
          </View>
          
          <View style={[styles.separator, {backgroundColor: color.border}]} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
            <Edit size={20} color={color.text} />
            <Text style={[styles.menuText, {color: color.text}]}>
              Cập Nhật Highlight Story
            </Text>
          </TouchableOpacity>
          
          <View style={[styles.separator, {backgroundColor: color.border}]} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
            <Trash2 size={20} color="#FF4444" />
            <Text style={[styles.menuText, {color: '#FF4444'}]}>
              Xóa Highlight Story
            </Text>
          </TouchableOpacity>
          
          <View style={[styles.separator, {backgroundColor: color.border}]} />
          
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={[styles.cancelText, {color: color.text}]}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 12,
    padding: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '400',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HighlightMenuModal; 