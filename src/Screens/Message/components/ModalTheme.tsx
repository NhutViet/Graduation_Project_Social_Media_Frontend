import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';

interface ModalThemeProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (optionId: string) => void;
}

const backgroundOptions = [
  'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://i.pinimg.com/736x/2f/5f/9a/2f5f9a16d7a5170a4690185f5e15e679.jpg',
  'https://img.freepik.com/premium-vector/dialogue-balloon-chat-bubble-icons-seamless-pattern-textile-pattern-wrapping-paper-linear-vector-print-fabric-seamless-background-wallpaper-backdrop-with-speak-bubbles-chat-message-frame_8071-58894.jpg?semt=ais_hybrid&w=740',
];

const ModalTheme: React.FC<ModalThemeProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  console.log('Rendering ModalTheme, visible:', visible);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onClose}>
        <View style={styles.container}>
          <Text style={styles.title}>Đổi nền khung chat</Text>
          <FlatList
            data={backgroundOptions}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  console.log('Selecting background:', item);
                  onSelect(item);
                  onClose();
                }}
                style={styles.option}>
                <Image
                  source={{uri: item}}
                  style={styles.image}
                  onError={() => console.log(`Failed to load image: ${item}`)}
                />
              </TouchableOpacity>
            )}
            keyExtractor={item => item}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalTheme;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    height: '70%',
  },
  title: {
    width: '100%',
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 18,
    textAlign: 'center',
  },
  option: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
});
