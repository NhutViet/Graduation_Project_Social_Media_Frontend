import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import {Colors} from '../../../../assets/color/Colors';

interface ModalThemeProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (optionId: string) => void;
}

const backgroundOptions = [
  'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://i.pinimg.com/736x/2f/5f/9a/2f5f9a16d7a5170a4690185f5e15e679.jpg',
  'https://i.pinimg.com/736x/09/86/39/098639815a3da4edced552072f165ed8.jpg',
  'https://i.pinimg.com/736x/7f/93/1f/7f931f82706669b77dbfec0d64cbc346.jpg',
  'https://i.pinimg.com/736x/de/5e/6e/de5e6eeb01d05713f4205dea4294caa5.jpg',
  'https://i.pinimg.com/736x/79/d1/02/79d102e2817224fd99806210dffb6e14.jpg',
  'https://i.pinimg.com/736x/bd/4b/a8/bd4ba884117a69f04b82bbea41609935.jpg',
  'https://i.pinimg.com/736x/68/b5/e0/68b5e0e14d51b6646e79ba1e7a8efe71.jpg',
  'https://i.pinimg.com/736x/38/3b/22/383b22f6c69a5c0b437c6fa6d942ee1b.jpg',
  'https://i.pinimg.com/736x/a4/ba/df/a4badfdd908857ac5f3a0246a5b76791.jpg',
  'https://i.pinimg.com/736x/85/05/fc/8505fcde48698821c0e29c130ed88a3c.jpg',
  'https://i.pinimg.com/736x/28/21/ba/2821ba1cab65b39122bf77cb8a293981.jpg',
  'https://i.pinimg.com/736x/8f/be/04/8fbe04b72d7aaf5417bb146951c45530.jpg',
];

const screenWidth = Dimensions.get('window').width;
const numColumns = 3;
const space = screenWidth * 0.055;
const itemSize = screenWidth * 0.26;

const ModalTheme: React.FC<ModalThemeProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onClose}></TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>Đổi nền khung chat</Text>
        <FlatList
          data={backgroundOptions}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
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
          numColumns={numColumns}
        />
      </View>
    </Modal>
  );
};

export default ModalTheme;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    height: '70%',
    paddingVertical: space,
  },
  title: {
    width: '100%',
    fontWeight: 'bold',
    marginBottom: space,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.gray21,
  },
  option: {
    width: itemSize,
    height: itemSize,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: space,
    marginLeft: space,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
