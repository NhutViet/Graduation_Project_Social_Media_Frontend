import {Colors} from '@assets/color/Colors';
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import {useTheme} from '../../../../src/util/ThemeContext';

interface MoreActionModalProps {
  visible: boolean;
  onClose: () => void;
  onUnfollow: () => void;
  onReport: () => void;
}

export const MoreActionModal: React.FC<MoreActionModalProps> = ({
  visible,
  onClose,
  onUnfollow,
  onReport,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      statusBarTranslucent>
      <StatusBar backgroundColor="rgba(0,0,0,0.4)" barStyle="light-content" />
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View
            style={[styles.optionsBox, {backgroundColor: color.background}]}>
            <Option
              text="Bỏ theo dõi"
              onPress={() => {
                onUnfollow();
                onClose();
              }}
              destructive
            />
            <Option
              text="Báo cáo"
              onPress={() => {
                onReport();
                onClose();
              }}
            />
          </View>
          <View style={[styles.cancelBox, {backgroundColor: color.background}]}>
            <Option text="Hủy" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Option = ({
  text,
  onPress,
  destructive = false,
}: {
  text: string;
  onPress: () => void;
  destructive?: boolean;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.option}>
    <Text style={[styles.optionText, destructive && styles.destructiveText]}>
      {text}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  sheet: {
    padding: 10,
  },
  optionsBox: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  cancelBox: {
    borderRadius: 14,
    marginTop: 10,
  },
  option: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
  },
  destructiveText: {
    color: '#FF3B30',
  },
});
