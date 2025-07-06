import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
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

interface ModalCreateProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (optionId: string) => void;
}

const options = [
  {id: 'reels', label: 'Thước phim', icon: Video},
  {id: 'post', label: 'Bài viết', icon: FileText},
  {id: 'story', label: 'Tin', icon: ImageIcon},
  {id: 'highlight', label: 'Tin nổi bật', icon: CircleFadingArrowUp},
  {id: 'live', label: 'Video trực tiếp', icon: Camera},
  {id: 'ai', label: 'AI', icon: Sparkles},
];

const ModalCreate: React.FC<ModalCreateProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[styles.container, {backgroundColor: color.background}]}>
              <Text style={[styles.title, {color: color.text}]}>Tạo</Text>

              {options.map(({id, label, icon: Icon}) => (
                <TouchableOpacity
                  key={id}
                  style={styles.option}
                  onPress={() => {
                    onSelect(id);
                    onClose();
                  }}>
                  <View style={styles.icon}>
                    <Icon size={24} color={color.text} />
                  </View>
                  <Text style={[styles.label, {color: color.text}]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
