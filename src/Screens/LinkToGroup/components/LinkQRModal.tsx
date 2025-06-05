import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';

interface LinkQRModalProps {
  isVisible: boolean;
  onClose: () => void;
  groupAvatarUrl: string;
  qrCodeValue: string; 
  groupName: string;
  membersCount: number;
}

const width = Dimensions.get('window').width * 0.67;

const LinkQRModal: React.FC<LinkQRModalProps> = ({isVisible, onClose, qrCodeValue, groupAvatarUrl, groupName, membersCount}: LinkQRModalProps) => {
    
  const [selectedGradient, setSelectedGradient] = useState<string[]>(['#000000']);

  const gradientColors = [
    ['#FD1D1D', '#FCB045'],
    ['#833AB4', '#FD1D1D'],
    ['#5851DB', '#833AB4'],
    ['#C13584', '#5851DB'],
    ['#000000', '#4F4F4F'],
  ];

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      backdropColor="black"
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <View style={styles.groupInfoContainer}>
          <Image
            source={{uri: groupAvatarUrl}}
            style={styles.groupAvatar}
          />
          <Text style={styles.groupName}>{groupName}</Text>
          <Text style={styles.membersCount}>{membersCount} thành viên</Text>
          <QRCode
            value={qrCodeValue}
            size={150}
            linearGradient={selectedGradient}
            gradientDirection={['0%', '0%', '100%', '100%']}
            enableLinearGradient
            backgroundColor="transparent"
          />
        </View>
        <View style={styles.colorOptions}>
          {gradientColors.map((gradient, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedGradient(gradient)}
            >
              <LinearGradient
                colors={gradient}
                style={styles.colorCircle}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.description}>
          Mọi người có thể quét mã QR này bằng camera điện thoại để tham gia nhóm chat này.
        </Text>

        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Chia sẻ mã QR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Lưu vào thư viện ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{width: '100%', borderTopWidth: 1, borderColor: '#F0F0F0', alignItems: 'center',}} onPress={onClose}>
          <Text style={styles.doneText}>Xong</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default LinkQRModal

const styles = StyleSheet.create({
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
    },
    modalContent: {
        width: width,
        backgroundColor: '#fff',
        borderRadius: 15,
        alignItems: 'center',
        paddingVertical: 20,
    },
    groupInfoContainer: {
        width: '80%',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#dcdcdc',
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        padding: 20,
        alignItems: 'center',
        marginBottom: 15,
    },
    groupAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10,
    },
    groupName: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    membersCount: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 15,
    },
    qrCode: {
        width: 150,
        height: 150,
    },
    colorOptions: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    colorCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 5,
    },
    description: {
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
    },
    shareButton: {
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#F0F0F0',
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    shareButtonText: {
        color: '#2596be',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#F0F0F0',
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#333',
        fontSize: 16,
    },
    doneText: {
        color: '#333',
        fontSize: 16,
        marginTop: 10,
    },
})