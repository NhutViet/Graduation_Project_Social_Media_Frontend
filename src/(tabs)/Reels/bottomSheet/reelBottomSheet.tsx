import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Colors} from '../../../../assets/color/Colors';
import {Portal} from 'react-native-portalize';

const height = Dimensions.get('window').height * 0.7;

export type BottomSheetReelsRef = {
  open: () => void;
  close: () => void;
};

const BottomSheetReels = forwardRef<BottomSheetReelsRef>(({}, ref) => {
  const modalRef = useRef<Modalize>(null);

  useImperativeHandle(ref, () => ({
    open: () => modalRef.current?.open(),
    close: () => modalRef.current?.close(),
  }));

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        modalStyle={{
          backgroundColor: Colors.white,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          paddingHorizontal: 16,
        }}
        handleStyle={{
          backgroundColor: Colors.black,
          height: 6,
          width: 40,
          marginBottom: 8,
        }}
        handlePosition="inside"
        panGestureEnabled
        scrollViewProps={{scrollEnabled: false}}
        adjustToContentHeight>
        <View style={{height: height, marginTop: 40}}>
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
        </View>
      </Modalize>
    </Portal>
  );
});

const styles = StyleSheet.create({
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
