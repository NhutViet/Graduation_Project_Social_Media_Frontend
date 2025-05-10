import React, {useRef, useState} from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import RNFS from 'react-native-fs';
import LinearGradient from 'react-native-linear-gradient';
export const ScreenQRCode = ({navigation}: any) => {
  const qrCodeRef = useRef<any>(null);
  const {theme} = useTheme();
  const color = Colors[theme];
  const [linkQR, setLinkQR] = useState(
    'https://www.youtube.com/watch?v=GKxkw0FQBm0',
  );
  const hanldeDownloadQRCode = async () => {
    console.log('download');
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4F8EF7', '#9A44F2', '#E24D92']}
        locations={[0, 0.5, 1]}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        style={styles.linear}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => navigation.navigate('BottomTabs')}>
            <Image
              style={styles.iconClose}
              source={require('../../../assets/icon/x.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnQScan}
            onPress={() => navigation.navigate('QScanner')}>
            <Image
              style={styles.iconClose}
              source={require('../../../assets/icon/Qscan.png')}
            />
          </TouchableOpacity>

          <View style={styles.ViewQR}>
            <QRCode
              value={linkQR}
              size={200}
              quietZone={10}
              logo={require('../../../assets/icon/logo.png')}
              logoSize={50}
              logoMargin={2}
              logoBackgroundColor="white"
              linearGradient={['#4F8EF7', '#B84592']}
              enableLinearGradient={true}
              backgroundColor="transparent"
              getRef={qrCodeRef}
            />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnBottom}>
              <Image
                style={styles.icon}
                source={require('../../../assets/icon/share.png')}
              />
              <Text style={styles.txtBottom}>Chia sẻ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnBottom}>
              <Image
                style={styles.icon}
                source={require('../../../assets/icon/link.png')}
              />
              <Text style={styles.txtBottom}>Sao chép</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnBottom}
              onPress={hanldeDownloadQRCode}>
              <Image
                style={styles.icon}
                source={require('../../../assets/icon/download.png')}
              />
              <Text style={styles.txtBottom}>Tải xuống</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  linear: {
    flex: 1,
  },
  btnClose: {
    position: 'absolute',
    top: 60,
    left: 15,
    flexDirection: 'row',
  },
  btnQScan: {
    position: 'absolute',
    top: 60,
    right: 15,
    flexDirection: 'row',
  },
  iconClose: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ViewQR: {
    width: 320,
    height: 320,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  btnBottom: {
    width: 100,
    height: 80,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  footer: {
    width: '100%',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingRight: 35,
    paddingLeft: 35,
  },
  txtBottom: {
    color: '#000',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 5,
  },
});
