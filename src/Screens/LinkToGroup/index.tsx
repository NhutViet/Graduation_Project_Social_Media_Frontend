import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {Share} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import {Portal} from 'react-native-portalize';
import LinkQRModal from './components/LinkQRModal';
import {
  ArrowLeft,
  Copy,
  Share2,
  QrCode,
  Upload,
  RotateCcw,
} from 'lucide-react-native';

export const LinkToGroup = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const [linkQR, setLinkQR] = useState(
    'https://quickchart.io/qr?text=Hello world',
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLinkEnabled, setIsLinkEnabled] = useState(true);
  const inviteLink = 'https://abc';

  const toggleLink = () => setIsLinkEnabled(!isLinkEnabled);

  const copyToClipboard = () => {
    Clipboard.setString(inviteLink);
  };

  const shareLink = async () => {
    try {
      await Share.share({
        message: inviteLink,
      });
    } catch (error) {}
  };

  const resetLink = () => {
    // console.log('Reset link triggered');
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: color.background,
          height: Dimensions.get('window').height * 0.1,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{marginLeft: 20, zIndex: 1}}>
            <ArrowLeft size={24} color={color.text} />
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={[styles.header, {color: color.text}]}>Liên kết mời</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}></View>
      </View>

      <View style={{marginBottom: 16, paddingHorizontal: 20}}>
        <Text style={{fontSize: 17, color: color.text}}>Liên kết mời</Text>
        <View style={styles.linkRow}>
          <Text style={styles.linkText}>{inviteLink}</Text>
          <Switch
            value={isLinkEnabled}
            onValueChange={toggleLink}
            thumbColor={color.text}
            trackColor={{false: color.textSecondary, true: color.text}}
          />
        </View>
        <View style={{flexDirection: 'row', marginTop: 8}}>
          <Text style={{color: color.textSecondary}}>
            Bất kỳ ai cũng có thể tham gia nhóm chat của bạn bằng liên kết này.{' '}
            <TouchableOpacity>
              <Text style={styles.learnMore}>Tìm hiểu thêm</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>

      <View style={{width: '100%', borderWidth: 3, borderColor: color.gray}} />

      <TouchableOpacity style={styles.row} onPress={copyToClipboard}>
        <Copy size={20} color={color.text} />
        <Text style={[styles.rowText, {color: color.text}]}>Sao chép</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={shareLink}>
        <Share2 size={20} color={color.text} />
        <Text style={[styles.rowText, {color: color.text}]}>
          Gửi trên Cirla
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={openModal}>
        <QrCode size={20} color={color.text} />
        <Text style={[styles.rowText, {color: color.text}]}>Mã QR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <Upload size={20} color={color.text} />
        <Text style={[styles.rowText, {color: color.text}]}>Chia sẻ</Text>
      </TouchableOpacity>

      <View style={{width: '100%', borderWidth: 3, borderColor: color.gray}} />

      <TouchableOpacity style={styles.row} onPress={resetLink}>
        <RotateCcw size={20} color="#dd0131" />
        <Text style={styles.resetText}>Đặt lại liên kết</Text>
      </TouchableOpacity>

      <Portal>
        <LinkQRModal
          isVisible={isModalVisible}
          onClose={closeModal}
          groupAvatarUrl="https://i.pinimg.com/736x/b7/25/61/b72561fd1ec7018c0418c84a3c2d5a57.jpg"
          qrCodeValue={linkQR}
          groupName="grName"
          membersCount={3}
        />
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#007aff',
  },
  learnMore: {
    color: '#007aff',
    textDecorationLine: 'underline',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  rowText: {
    marginLeft: 8,
    fontSize: 16,
  },
  resetText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#dd0131',
  },
});
