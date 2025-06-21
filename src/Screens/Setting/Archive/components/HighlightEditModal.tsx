import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import * as ImagePicker from 'react-native-image-picker';
import {Colors} from '../../../../../assets/color/Colors';
import {useTheme} from '../../../../util/ThemeContext';
const {width} = Dimensions.get('window');
const ITEM_SIZE = (width - 4) / 3;

const HighlightEditModal = ({
  isOpen,
  onClose,
  selectedStories,
  onSaveHighlight,
  uploadImageToR2,
  showUploadModal,
  hideUploadModal,
  setProgress,
  onComplete,
  isProcessing,
  setIsProcessing,
}: any) => {
  const [highlightName, setHighlightName] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  const {theme} = useTheme();
  const color = Colors[theme];
  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        Alert.alert(
          'Lỗi',
          'Không thể truy cập thư viện ảnh. Vui lòng thử lại.',
        );
      } else if (response.assets && response.assets.length > 0) {
        setCoverImage(response.assets[0].uri);
      }
    });
  };

  const handleSave = async () => {
    if (isProcessing) return; // ✅ CHẶN xử lý nếu đang gửi API

    if (!highlightName.trim()) {
      Alert.alert('Vui lòng nhập tên highlight.');
      return;
    }

    setIsProcessing(true);

    try {
      let uploadedCoverUrl = '';

      if (coverImage) {
        uploadedCoverUrl = await uploadImageToR2(coverImage, {
          showUploadModal,
          hideUploadModal,
          setProgress,
        });
      }

      const storyIds = selectedStories.map((s: any) => s._id);
      await onSaveHighlight(storyIds, highlightName, uploadedCoverUrl);

      // reset state
      setHighlightName('');
      setCoverImage(null);

      // callback đóng modal và reset
      onComplete();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu highlight. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modal, {backgroundColor: color.background}]}>
          <View style={styles.modalHandle} />
          <View style={{marginTop: 35}}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <ChevronLeft size={24} color={color.text} />
              </TouchableOpacity>
              <Text style={[styles.title, {color: color.text}]}>
                Chỉnh sửa Highlight
              </Text>
              <TouchableOpacity onPress={handleSave}>
                <Text style={styles.save}>Lưu</Text>
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center'}}>
              {coverImage ? (
                <Image source={{uri: coverImage}} style={styles.coverImage} />
              ) : (
                <Image
                  source={{uri: 'https://via.placeholder.com/200'}}
                  style={styles.coverImage}
                />
              )}
              <TouchableOpacity onPress={pickImage}>
                <Text style={[styles.editCover, {color: color.text}]}>
                  Chỉnh sửa ảnh bìa
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, {color: color.text}]}
              placeholder="Nhập tên highlight"
              placeholderTextColor={color.text}
              value={highlightName}
              onChangeText={setHighlightName}
            />
            <FlatList
              data={selectedStories}
              renderItem={({item}) => (
                <Image source={{uri: item.mediaUrl}} style={styles.image} />
              )}
              keyExtractor={item => item._id}
              numColumns={3}
              columnWrapperStyle={styles.row}
              ListEmptyComponent={
                <Text style={{textAlign: 'center'}}>
                  Không có ảnh được chọn.
                </Text>
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default HighlightEditModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  modalHandle: {
    backgroundColor: '#ccc',
    height: 4,
    width: 50,
    alignSelf: 'center',
    borderRadius: 2,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  save: {
    fontSize: 16,
    color: 'blue',
    fontWeight: '500',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  row: {
    marginBottom: 10,
  },
  image: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 1,
  },
  coverImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 50,
  },
  editCover: {
    marginBottom: 20,
  },
});
