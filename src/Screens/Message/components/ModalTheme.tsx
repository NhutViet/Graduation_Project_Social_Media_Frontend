import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Easing,
} from 'react-native';
import {Colors} from '../../../../assets/color/Colors';

interface ModalThemeProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (optionId: string) => void;
}

const backgroundOptions = [
  'https://i.pinimg.com/736x/94/2c/32/942c32efe5dd2e27254524a06b36ed3e.jpg',
  'https://i.pinimg.com/736x/b2/36/92/b236927a5d9952979b53ca487d132806.jpg',
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

const {width, height} = Dimensions.get('window');
const ITEM_SPACING = 16;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (width - ITEM_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;
const SHEET_HEIGHT = height * 0.8;

const ModalTheme: React.FC<ModalThemeProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const [show, setShow] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(height)).current;

  // Mở khi prop `visible` chuyển true
  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 20,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  // Hàm đóng do bạn chủ động gọi
  const close = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
    ]).start(() => {
      setShow(false);
      onClose();
    });
  }, [opacity, translateY, onClose]);

  if (!show) return null; // chỉ mount khi `show` = true

  return (
    <Modal
      visible={true} // luôn mount
      transparent
      animationType="none"
      statusBarTranslucent>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={close}>
        <Animated.View style={[styles.backdrop, {opacity}]} />
      </TouchableWithoutFeedback>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {transform: [{translateY}], height: SHEET_HEIGHT},
        ]}>
        <SafeAreaView style={styles.container}>
          <View style={styles.grabber} />
          <Text style={styles.title}>Đổi nền khung chat</Text>

          <FlatList
            data={backgroundOptions}
            keyExtractor={uri => uri}
            numColumns={NUM_COLUMNS}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            columnWrapperStyle={styles.row}
            renderItem={({item}) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  onSelect(item);
                  close(); // đóng khi chọn
                }}
                style={styles.item}>
                <Image source={{uri: item}} style={styles.image} />
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

export default ModalTheme;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  container: {
    flex: 1,
    paddingHorizontal: ITEM_SPACING,
  },
  grabber: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: ITEM_SPACING,
    color: Colors.gray21,
  },
  list: {
    paddingBottom: ITEM_SPACING,
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: ITEM_SPACING,
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: ITEM_SPACING,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
