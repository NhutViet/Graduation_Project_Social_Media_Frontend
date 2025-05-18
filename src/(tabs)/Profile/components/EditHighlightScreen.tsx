import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  TextInput,
} from 'react-native';
import {ChevronLeft, Check, CircleX} from 'lucide-react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {launchImageLibrary} from 'react-native-image-picker';
const DUMMY_STORIES = [
  {id: '1', uri: 'https://picsum.photos/id/1/200'},
  {id: '2', uri: 'https://picsum.photos/id/2/200'},
  {id: '3', uri: 'https://picsum.photos/id/3/200'},
  {id: '4', uri: 'https://picsum.photos/id/4/200'},
  {id: '5', uri: 'https://picsum.photos/id/5/200'},
  {id: '6', uri: 'https://picsum.photos/id/6/200'},
];

const EditHighlightScreen = () => {
  const {theme} = useTheme();
  const color = Colors[theme];

  const [imageUri, setImageUri] = useState('https://picsum.photos/id/1/200');
  const [selectedTab, setSelectedTab] = useState<'selected' | 'stories'>(
    'selected',
  );
  const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>([]);
  const [name, setName] = useState(' ');

  const requestPermissionAndPickImage = async () => {
    try {
      if (Platform.OS === 'android') {
        const permission =
          Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(permission);

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Permission denied');
          return;
        }
      }

      launchImageLibrary({mediaType: 'photo'}, response => {
        if (response.didCancel) return;
        if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri || '');
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedStoryIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const renderStoryItem = ({item}: any) => {
    const isSelected = selectedStoryIds.includes(item.id);
    return (
      <TouchableOpacity
        style={styles.storyItem}
        onPress={() => toggleSelect(item.id)}>
        <Image source={{uri: item.uri}} style={styles.storyImage} />
        {isSelected && (
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.btnIconTick}>
              <Check size={24} color={color.text} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const filteredStories =
    selectedTab === 'selected'
      ? DUMMY_STORIES.filter(s => selectedStoryIds.includes(s.id))
      : DUMMY_STORIES;

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <ChevronLeft size={30} color={color.text} />
        </TouchableOpacity>
        <Text style={[styles.title, {color: color.text}]}>Sửa tin nổi bật</Text>
        <TouchableOpacity>
          <Text style={styles.done}>Xong</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Image style={styles.img} source={{uri: imageUri}} />
        <TouchableOpacity onPress={requestPermissionAndPickImage}>
          <Text style={styles.textImg}>Thay Đổi ảnh</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.line} />
      <View style={styles.viewName}>
        <Text style={[styles.txtName, {color: color.text}]}>Tên</Text>
        <View style={styles.input}>
          <TextInput
            onChangeText={setName}
            placeholder="Nhập tên"
            placeholderTextColor={color.text}
            style={styles.Tetxinput}
            value={name}
          />
          {name.length > 1 && (
            <TouchableOpacity onPress={() => setName('')}>
              <CircleX size={16} color={color.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.line} />
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setSelectedTab('selected')}
          style={[
            styles.tabButton,
            selectedTab === 'selected' && styles.tabActive,
          ]}>
          <Text style={[styles.tabText, {color: color.text}]}>Đã chọn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab('stories')}
          style={[
            styles.tabButton,
            selectedTab === 'stories' && styles.tabActive,
          ]}>
          <Text style={[styles.tabText, {color: color.text}]}>Tin</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredStories}
        keyExtractor={item => item.id}
        numColumns={3}
        renderItem={renderStoryItem}
        contentContainerStyle={styles.storyGrid}
      />
    </SafeAreaView>
  );
};

export default EditHighlightScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  done: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  textImg: {
    color: '#4A90E2',
    fontSize: 15,
    fontWeight: '400',
  },
  line: {
    marginTop: 5,
    width: '100%',
    height: 1,
    backgroundColor: '#aaa',
  },
  viewName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtName: {
    fontSize: 18,
    fontWeight: '500',
    marginRight: 25,
    marginLeft: 15,
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  Tetxinput: {
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  storyGrid: {
    paddingHorizontal: 8,
  },
  storyItem: {
    width: '30%',
    height: 200,
    margin: '1.5%',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  btnIconTick: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 30,
    height: 30,
    backgroundColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
});
