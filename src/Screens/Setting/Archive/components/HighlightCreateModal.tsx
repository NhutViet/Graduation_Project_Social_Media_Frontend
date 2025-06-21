import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import {Portal} from 'react-native-portalize';
import {Colors} from '../../../../../assets/color/Colors';
import {useTheme} from '../../../../util/ThemeContext';
import {Alert} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import {Check} from 'lucide-react-native';

// Import HighlightEditModal
import HighlightEditModal from './HighlightEditModal';
import {useDispatch} from 'react-redux';
import {createHighlightStory} from '@services/StoryRedux/StorySlice';
import {AppDispatch} from '@services/store';
import {uploadImageToR2} from '../../../../core/upload';

const formatMonthText = (dateString?: string): string => {
  if (!dateString) return '--\n--';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '--\n--';

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${date.getDate()}\n${months[date.getMonth()]}`;
};

const {width} = Dimensions.get('window');
const ITEM_SIZE = (width - 4) / 3;

interface HighlightCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  myStories: any[];
  loading: boolean;
  onCreateHighlight: (
    selectedStoryIds: string[],
    name: string,
    coverImage?: string,
  ) => Promise<void>;
}

const HighlightCreateModal = ({
  isOpen,
  onClose,
  myStories,
  loading,
  onCreateHighlight,
}: HighlightCreateModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {theme} = useTheme();
  const color = Colors[theme];
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleStorySelection = (storyId: string) => {
    setSelectedStories(prev =>
      prev.includes(storyId)
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId],
    );
  };

  const handleCreateHighlight = async (
    storyIds: string[],
    name: string,
    coverImage?: string,
  ) => {
    if (!name || typeof name !== 'string') {
      Alert.alert('Lỗi', 'Tên highlight không hợp lệ');
      return;
    }

    try {
      await dispatch(
        createHighlightStory({
          storyId: storyIds,
          collectionName: name,
          thumbnail: coverImage || '',
        }),
      ).unwrap();

      Alert.alert('Thành công', 'Highlight đã được tạo!');
    } catch (error) {
      console.error('❌ createHighlightStory error:', error);
      Alert.alert('Lỗi', 'Tạo highlight thất bại.');
    }
  };

  const handleCreateHighlightButtonPress = () => {
    if (selectedStories.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một story.');
      return;
    }
    setEditModalVisible(true);
  };

  const showUploadModal = () => {
    setUploading(true);
  };

  const hideUploadModal = () => {
    setUploading(false);
    setUploadProgress(0);
  };

  const setProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  return (
    <Portal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, {backgroundColor: color.modal}]}>
            <View style={styles.modalHandle} />
            <View style={{marginTop: 35}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}>
                <TouchableOpacity onPress={onClose}>
                  <ChevronLeft size={24} color={color.text} />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: color.text,
                  }}>
                  Tạo tin nổi bật
                </Text>
                <TouchableOpacity onPress={handleCreateHighlightButtonPress}>
                  <Text style={styles.continue}>Tiếp</Text>
                </TouchableOpacity>
              </View>
              {loading ? (
                <ActivityIndicator size="large" color={color.text} />
              ) : myStories.length === 0 ? (
                <Text style={{color: color.text, textAlign: 'center'}}>
                  Không có story để hiển thị.
                </Text>
              ) : (
                <FlatList
                  data={myStories}
                  initialNumToRender={5}
                  renderItem={({item}) => {
                    const isSelected = selectedStories.includes(item._id);
                    return (
                      <TouchableOpacity
                        style={styles.storyItem}
                        onPress={() => toggleStorySelection(item._id)}>
                        <Image
                          source={{uri: item.mediaUrl}}
                          style={styles.storyImage}
                        />
                        <View style={[styles.checkbox]}>
                          {isSelected && <Check size={20} color={'#fff'} />}
                        </View>
                        <Text
                          style={[
                            styles.monthText,
                            {
                              backgroundColor: color.background,
                              color: color.text,
                            },
                          ]}>
                          {formatMonthText(item.createdAt)}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={item => item._id}
                  numColumns={3}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
      <HighlightEditModal
        isOpen={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        selectedStories={myStories.filter(item =>
          selectedStories.includes(item._id),
        )}
        onSaveHighlight={handleCreateHighlight}
        uploadImageToR2={uploadImageToR2}
        showUploadModal={showUploadModal}
        hideUploadModal={hideUploadModal}
        setProgress={setProgress}
        onComplete={() => {
          setEditModalVisible(false);
          onClose(); // đóng HighlightCreateModal
          setSelectedStories([]); // reset chọn
        }}
        isProcessing={isProcessing} // ✅ THÊM DÒNG NÀY
        setIsProcessing={setIsProcessing}
      />

      {isProcessing && (
        <Modal transparent visible>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{color: '#fff', marginTop: 10}}>Đang xử lý...</Text>
          </View>
        </Modal>
      )}
    </Portal>
  );
};

export default HighlightCreateModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 2,
    paddingBottom: 20,
    flex: 1,
  },
  modalHandle: {
    backgroundColor: '#ccc',
    height: 4,
    width: 50,
    alignSelf: 'center',
    borderRadius: 2,
    marginTop: 10,
  },
  storyItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 2,
    margin: 1,
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  checkbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  monthText: {
    position: 'absolute',
    top: 8,
    left: 8,
    fontSize: 14,
    fontWeight: 'bold',

    padding: 8,
    borderRadius: 5,
  },
  continue: {
    fontSize: 16,
    color: 'blue',
    fontWeight: '500',
  },
});
