import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../src/Navigation/AppNavigation';
import {X, Send} from 'lucide-react-native';
import {Colors} from '@assets/color/Colors';
import {uploadImageToR2} from '../../../src/core/upload';
import {useUploadProgress} from '@services/UploadProgressManager';
import {useSocket} from '@services/SocketContext';
import {useSelector} from 'react-redux';
import {RootState} from '@services/store';

const {width, height} = Dimensions.get('window');

export const CameraPreview = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'CameraPreview'>>();
  const {uri, roomId} = route.params;
  const {socket} = useSocket();
  const {showUploadModal, hideUploadModal, setProgress} = useUploadProgress();
  const userC = useSelector((state: RootState) => state.user.user);

  const handleRetake = () => {
    navigation.goBack();
  };

  const handleSend = async () => {
    try {
      if (!(uri && socket && userC)) return;
      const imageUrl = await uploadImageToR2(uri, {
        showUploadModal,
        hideUploadModal,
        setProgress,
      });

      socket.emit('sendMessage', {
        roomId,
        senderId: userC._id,
        media: {
          type: 'image',
          url: imageUrl,
        },
      });
    } catch (error) {
      console.error('❌ Upload/send captured image error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{uri}} style={styles.image} resizeMode="cover" />

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.roundButton} onPress={handleRetake}>
          <X size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            handleSend();
            navigation.navigate('MessageScreen', {
              room: roomId,
            });
          }}>
          <Send size={20} color="#fff" />
          <Text style={styles.sendLabel}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  image: {
    width,
    height,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 50,
  },
  sendLabel: {
    color: Colors.white,
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
