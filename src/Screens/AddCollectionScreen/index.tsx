import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import {ChevronLeft, Check, CircleX, Video, Images} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
const DUMMY_POSTS = Array.from({length: 20}).map((_, i) => ({
  id: String(i + 1),
  uri: `https://picsum.photos/id/${i + 1}/300/300`,
  isVideo: i % 4 === 0, // Giả lập 1 số là video
}));

export const AddCollectionScreen = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedPostIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const renderPostItem = ({item}: any) => {
    const isSelected = selectedPostIds.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelect(item.id)}
        style={styles.postItem}>
        <Image source={{uri: item.uri}} style={styles.postImage} />
        {item.isVideo ? (
          <View style={styles.iconOverlay}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/reels.png')}
            />
          </View>
        ) : (
          <View style={styles.iconOverlay}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/gallery.png')}
            />
          </View>
        )}
        {isSelected && (
          <View style={styles.overlayCheck}>
            <Check size={18} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={color.text} />
          </TouchableOpacity>
          <Text style={[styles.title, {color: color.text}]}>
            Bộ sưu tập mới
          </Text>
          <View style={{width: 24}} />
        </View>
        <View style={styles.nameInput}>
          <TextInput
            placeholder="Tên bộ sưu tập"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            style={[styles.input, {color: color.text}]}
          />
          {name.length > 0 && (
            <TouchableOpacity onPress={() => setName('')}>
              <CircleX size={20} color={color.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={DUMMY_POSTS}
        keyExtractor={item => item.id}
        numColumns={3}
        renderItem={renderPostItem}
        contentContainerStyle={styles.gridContainer}
      />

      {selectedPostIds.length > 0 && (
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  nameInput: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,

    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: 6,
    paddingBottom: 100,
  },
  postItem: {
    width: '31.5%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  overlayCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  iconOverlay: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
