import React, {useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import LinearGradient from 'react-native-linear-gradient';
import {X, ScanLine, Share2, Link2, Download} from 'lucide-react-native';

export const ScreenQRCode = ({navigation}: any) => {
  const qrCodeRef = useRef<any>(null);
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
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate('BottomTabs')}>
            <X size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate('QRScanner')}>
            <ScanLine size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
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
            />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnBottom}>
              <Share2 size={22} color="#000" />
              <Text style={styles.txtBottom}>Chia sẻ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnBottom}>
              <Link2 size={22} color="#000" />
              <Text style={styles.txtBottom}>Sao chép</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnBottom}
              onPress={hanldeDownloadQRCode}>
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
  container: {
    flex: 1,
    position: 'relative',
  },
  linear: {
    flex: 1,
  },
  btn: {
    width: 20,
    height: 20,
  },
  iconClose: {
    width: '100%',
    height: '100%',
    tintColor: '#fff',
    resizeMode: 'contain',
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
  btnBottom: {
    width: '32%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 15,
  },
  footer: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtBottom: {
    color: '#000',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 5,
  },
  Header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
