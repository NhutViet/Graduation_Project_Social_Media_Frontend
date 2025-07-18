import {Colors} from '@assets/color/Colors';
import {X} from 'lucide-react-native';
import React from 'react';
import {Modal, View, TouchableOpacity, Image, StyleSheet} from 'react-native';

interface Props {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<Props> = ({visible, imageUri, onClose}) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={26} color={Colors.white} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: '8%',
    right: '5%',
    zIndex: 1,
    color: Colors.white,
  },
  imageContainer: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
