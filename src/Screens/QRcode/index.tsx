import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import LinearGradient from 'react-native-linear-gradient';
import {X, ScanLine, Share2, Link2, Download} from 'lucide-react-native';
import {useSelector} from 'react-redux';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import Clipboard from '@react-native-clipboard/clipboard';
import {RootState} from '@services/store';
import {useHeadAlert} from '../../../components/Global/HeadAlertProvider';

export const ScreenQRCode = ({navigation}: any) => {
  const qrCodeRef = useRef<any>(null);
  const {showAlert} = useHeadAlert();
  const myUserId = useSelector((state: RootState) => state.user.user?._id);
  const url = `https://cirla.io.vn/profile/${myUserId}`;

  const requestSavePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android' && Platform.Version < 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const handleShare = async () => {
    try {
      await Share.share({message: url});
      showAlert('Chia sẻ', 'Link đã sẵn sàng để chia sẻ.');
    } catch {
      showAlert('Lỗi', 'Không thể chia sẻ link.');
    }
  };

  const handleCopy = () => {
    Clipboard.setString(url);
    showAlert('Sao chép', 'Đã sao chép link vào clipboard.');
  };

  const handleDownloadQRCode = async () => {
    if (!qrCodeRef.current?.toDataURL) return;
    const hasPerm = await requestSavePermission();
    if (!hasPerm) {
      showAlert('Lỗi', 'Không có quyền lưu hình.');
      return;
    }

    qrCodeRef.current.toDataURL(async (dataURL: string) => {
      try {
        const base64 = dataURL.replace(/^data:image\/png;base64,/, '');
        const filePath = `${RNFS.CachesDirectoryPath}/qr_${Date.now()}.png`;

        await RNFS.writeFile(filePath, base64, 'base64');

        await CameraRoll.save(`file://${filePath}`, {type: 'photo'});

        showAlert('Thành công', 'Đã lưu QR code vào thư viện.');
      } catch (e) {
        console.error('Save QR error', e);
        showAlert('Lỗi', 'Lưu QR code thất bại.');
      }
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4F8EF7', '#9A44F2', '#E24D92']}
        locations={[0, 0.5, 1]}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        style={styles.linear}>
        <View style={styles.Header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.btn}>
            <X size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('QRScanner')}
            style={styles.btn}>
            <ScanLine size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.ViewQR}>
            <QRCode
              getRef={c => (qrCodeRef.current = c)}
              value={url}
              size={200}
              quietZone={10}
              logo={require('../../../assets/icon/logo.png')}
              logoSize={50}
              logoMargin={2}
              logoBackgroundColor="white"
              linearGradient={['#4F8EF7', '#B84592']}
              enableLinearGradient
              backgroundColor="transparent"
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnBottom} onPress={handleShare}>
              <Share2 size={22} color="#000" />
              <Text style={styles.txtBottom}>Chia sẻ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnBottom} onPress={handleCopy}>
              <Link2 size={22} color="#000" />
              <Text style={styles.txtBottom}>Sao chép</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnBottom}
              onPress={handleDownloadQRCode}>
              <Download size={22} color="#000" />
              <Text style={styles.txtBottom}>Tải xuống</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, position: 'relative'},
  linear: {flex: 1},
  btn: {width: 24, height: 24, justifyContent: 'center', alignItems: 'center'},
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  ViewQR: {
    width: '100%',
    padding: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  footer: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnBottom: {
    width: '32%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  txtBottom: {color: '#000', fontSize: 14, marginTop: 6},
  Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
});
