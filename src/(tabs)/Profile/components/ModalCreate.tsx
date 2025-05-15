import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  Video,
  FileText,
  Image as ImageIcon,
  Bookmark,
  Camera,
  Sparkles,
} from 'lucide-react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

interface ModalCreateProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (optionId: string) => void;
}

const ModalCreate: React.FC<ModalCreateProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.container, {backgroundColor: color.background}]}
          onPress={() => {}}>
          <Text style={[styles.title, {color: color.text}]}>Tạo</Text>
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              onSelect('reels');
              onClose();
            }}>
            <View style={styles.icon}>
              <Video size={24} color={color.text} />
            </View>
            <Text style={[styles.label, {color: color.text}]}>Thước phim</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              onSelect('post');
              onClose();
            }}>
            <View style={styles.icon}>
              <FileText size={24} color={color.text} />
            </View>
            <Text style={[styles.label, {color: color.text}]}>Bài viết</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              onSelect('story');
              onClose();
            }}>
            <View style={styles.icon}>
              <ImageIcon size={24} color={color.text} />
            </View>
            <Text style={[styles.label, {color: color.text}]}>Tin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              onSelect('highlight');
              onClose();
            }}>
            <View style={styles.icon}>
              <Bookmark size={24} color={color.text} />
            </View>
            <Text style={[styles.label, {color: color.text}]}>Tin nổi bật</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              onSelect('live');
              onClose();
            }}>
            <View style={styles.icon}>
              <Camera size={24} color={color.text} />
            </View>
            <Text style={[styles.label, {color: color.text}]}>
              Video trực tiếp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              onSelect('ai');
              onClose();
            }}>
            <View style={styles.icon}>
              <Sparkles size={24} color={color.text} />
            </View>
            <Text style={[styles.label, {color: color.text}]}>AI</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ModalCreate;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  container: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: '#999',
    borderBottomWidth: 1,
  },
  icon: {
    width: 30,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginLeft: 16,
  },
});
