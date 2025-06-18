import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import {Colors} from '../assets/color/Colors';

interface IncomingCallModalProps {
  visible: boolean;
  callerName: string;
  type: 'video' | 'voice';
  onAccept: () => void;
  onReject: () => void;
}

const IncomingCallModal = ({
  visible,
  callerName,
  type,
  onAccept,
  onReject,
}: IncomingCallModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Image
            source={
              type === 'video'
                ? require('./../assets/icon/videoCamera.png')
                : require('./../assets/icon/Microphone.png')
            }
            style={styles.callIcon}
            resizeMode="contain"
          />

          <Text style={styles.title}>Cuộc gọi đến</Text>
          <Text style={styles.subTitle}>{callerName} đang gọi bạn</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onReject} style={styles.rejectButton}>
              <Text style={styles.buttonText}>Từ chối</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onAccept} style={styles.acceptButton}>
              <Text style={styles.buttonText}>Tham gia</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default IncomingCallModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    alignItems: 'center',
  },
  callIcon: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.black,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 20,
    color: Colors.black,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
  },
  rejectButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  acceptButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
