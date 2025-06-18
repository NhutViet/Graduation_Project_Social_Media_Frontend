import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

interface Props {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  backgroundColor?: string;
}

const ImagePreviewModal: React.FC<Props> = ({
  visible,
  imageUri,
  onClose,
  backgroundColor = '#fff',
}) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={[styles.closeText, {color: backgroundColor}]}>✕</Text>
        </TouchableOpacity>
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image
              source={{uri: imageUri}}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default ImagePreviewModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    fontSize: 24,
  },
  imageContainer: {
    width: '90%',
    height: '80%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
