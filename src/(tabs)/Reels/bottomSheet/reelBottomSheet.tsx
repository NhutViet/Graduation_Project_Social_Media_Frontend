import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  Text,
} from 'react-native';
import {Colors} from '../../../../assets/color/Colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const height = Dimensions.get('window').height * 0.8;

export type BottomSheetReelsRef = {
  open: () => void;
  close: () => void;
};

const BottomSheetReels = forwardRef<BottomSheetReelsRef>(({}, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useSharedValue(height);
  const isOpen = useSharedValue(false);

  const open = () => {
    setModalVisible(true);
    setTimeout(() => {
      translateY.value = withSpring(0, {damping: 20});
      isOpen.value = true;
    }, 50);
  };

  const close = () => {
    translateY.value = withSpring(height, {damping: 20});
    isOpen.value = false;
    setTimeout(() => {
      setModalVisible(false);
    }, 300);
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  return (
    <Modal
      visible={modalVisible}
      animationType="none"
      transparent
      onRequestClose={close}
      statusBarTranslucent>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.sheet, animatedStyle]}>
          <View style={styles.handle} />
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.headerBlock}>
              <View style={styles.blockIcon}>
                <Image
                  style={styles.icon}
                  source={require('../../../../assets/icon/bookmark.png')}
                />
              </View>
              <Text style={styles.textHeader}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBlock}>
              <View style={styles.blockIcon}>
                <Image
                  style={styles.icon}
                  source={require('../../../../assets/icon/remix_reels.png')}
                />
              </View>
              <Text style={styles.textHeader}>Remix</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBlock}>
              <View style={styles.blockIcon}> 
                <Image
                  style={styles.icon}
                  source={require('../../../../assets/icon/sequence.png')}
                />
              </View>
              <Text style={styles.textHeader}>Sequence</Text> 
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.buttonFeature}>
            <View style={styles.blockIcon}>
              <Image
                style={styles.icon}
                source={require('../../../../assets/icon/translation.png')}
              />
            </View>
            <Text style={styles.textNormal}>Bản dịch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonFeature}>
            <View style={styles.blockIcon}>
              <Image
                style={styles.icon}
                source={require('../../../../assets/icon/cc.png')}
              />
            </View>
            <Text style={styles.textNormal}>Phụ đề</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonFeature}>
            <View style={styles.blockIcon}>
              <Image
                style={styles.icon}
                source={require('../../../../assets/icon/full_screen.png')}
              />
            </View>
            <Text style={styles.textNormal}>Xem toàn màn hình</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonFeature}>
            <View style={styles.blockIcon}>
              <Image
                style={styles.icon}
                source={require('../../../../assets/icon/qrlink.png')}
              />
            </View>
            <Text style={styles.textNormal}>Mã QR</Text>
          </TouchableOpacity>
          <View style={styles.feelingContainer}>
            <TouchableOpacity style={styles.buttonFeeling}>
              <View style={styles.blockIcon}>
                <Image
                  style={styles.icon}
                  source={require('../../../../assets/icon/view.png')}
                />
              </View>
              <Text style={styles.textNormal}>Quan tâm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonFeeling}>
              <View style={styles.blockIcon}>
                <Image
                  style={styles.icon}
                  source={require('../../../../assets/icon/hide.png')}
                />
              </View>
              <Text style={styles.textNormal}>Không quan tâm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonFeeling}>
              <View style={styles.blockIcon}>
                <Image
                  style={[styles.icon, {tintColor: 'red'}]}
                  source={require('../../../../assets/icon/report.png')}
                />
              </View>
              <Text style={[styles.textNormal, {color: 'red'}]}>Báo cáo</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.buttonFeature}>
            <View style={styles.blockIcon}>
              <Image
                style={styles.icon}
                source={require('../../../../assets/icon/equalizer.png')}
              />
            </View>
            <Text style={styles.textNormal}>Quản lý tùy chọn về nội dung</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    height: height,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    backgroundColor: Colors.white,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 16,
    backgroundColor: Colors.black,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerBlock: {
    width: '31%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.whiteSmoke,
  },
  blockIcon: {
    width: 20,
    height: 20,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: Colors.black,
  },
  textHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    color: Colors.black,
  },
  buttonFeature: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.whiteSmoke,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10,
  },
  textNormal: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.black,
  },
  feelingContainer: {
    width: '100%',
    backgroundColor: Colors.whiteSmoke,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonFeeling: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default BottomSheetReels;
