import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {ArrowLeft, Search, X, Check} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '@services/store';
import {UserProfile} from '@services/relationRedux/relationTypes';
import {fetchFollowers} from '@services/relationRedux/relationSlice';
import {createRoom} from '@services/roomRedux/roomSlice';
import {useHeadAlert} from '../../../components/Global/HeadAlertProvider';

export const CreateGroupScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [selected, setSelected] = useState<UserProfile[]>([]);
  const {showAlert} = useHeadAlert();
  const {theme} = useTheme();
  const color = Colors[theme];
  const [searchText, setSearchText] = useState('');
  const userId = useSelector((state: RootState) => state.user.user?._id);
  const followers = useSelector((state: RootState) => state.relation.followers);
  const [isModalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (userId) {
      dispatch(fetchFollowers({userId}));
    }
  }, [userId]);

  const toggleSelect = (friend: UserProfile) => {
    const exists = selected.find(item => item._id === friend._id);
    if (exists) {
      setSelected(prev => prev.filter(item => item._id !== friend._id));
    } else {
      setSelected(prev => [...prev, friend]);
    }
  };

  const filteredFollowers = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return followers;

    return followers.filter(
      user =>
        (user.username?.toLowerCase() || '').includes(keyword) ||
        (user.handleName?.toLowerCase() || '').includes(keyword) ||
        (user.email?.toLowerCase() || '').includes(keyword),
    );
  }, [searchText, followers]);

  const handleCreateRoom = async () => {
    try {
      const user_ids = selected.map(user => user._id);

      const res = await dispatch(
        createRoom({
          user_ids,
          type: 'accept',
          name: groupName.trim(),
        }),
      ).unwrap();

      if (res.isExisted) {
        showAlert('Thông báo', 'Nhóm tin nhắn đã tồn tại!');
      } else {
        showAlert('Thành công', 'Tạo nhóm nhắn tin thành công!');
        navigation.goBack();
      }
    } catch (error: any) {
      showAlert('Thất bại', error?.message || 'Tạo đoạn chat thất bại!');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={color.text} />
        </TouchableOpacity>
        <Text style={[styles.title, {color: color.text}]}>
          Tạo nhóm trò chuyện
        </Text>
        <View style={{width: 24}} />
      </View>

      {/* Search Box */}
      <View style={[styles.searchBox, {backgroundColor: color.background}]}>
        <Search size={20} color="#aaa" />
        <TextInput
          placeholder="Tìm kiếm"
          placeholderTextColor="#888"
          style={[styles.searchInput, {color: color.text}]}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Selected Avatars */}
      {selected.length > 0 && (
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.selectedScroll}>
            {selected.map(item => (
              <View key={item._id} style={styles.selectedItem}>
                <Image
                  source={{uri: item.profilePic}}
                  style={styles.selectedAvatar}
                />
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => toggleSelect(item)}>
                  <X size={14} color={color.text} />
                </TouchableOpacity>
                <Text
                  style={[styles.selectedName, {color: color.text}]}
                  numberOfLines={1}>
                  {item.username || item.handleName}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Suggestions */}
      <Text style={[styles.suggestionLabel, {color: color.text}]}>Gợi ý</Text>
      <FlatList
        data={filteredFollowers}
        keyExtractor={item => item._id}
        renderItem={({item}) => {
          const isSelected = selected.some(f => f._id === item._id);
          return (
            <TouchableOpacity
              style={styles.friendRow}
              onPress={() => toggleSelect(item)}>
              <Image
                source={{uri: item.profilePic}}
                style={styles.friendAvatar}
              />
              <View style={styles.friendInfo}>
                <Text style={[styles.friendName, {color: color.text}]}>
                  {item.username || item.handleName}
                </Text>
                <Text style={styles.friendUsername}>{item.handleName}</Text>
              </View>
              <View style={styles.friendCheck}>
                {isSelected ? <Check size={18} color={color.text} /> : null}
              </View>
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* Create Button */}
      {selected.length > 1 && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.createButtonText}>Tạo đoạn hội thoại</Text>
        </TouchableOpacity>
      )}
      {isModalVisible && (
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              {backgroundColor: color.background},
            ]}>
            <Text style={[styles.modalTitle, {color: color.text}]}>
              Nhập tên nhóm
            </Text>
            <TextInput
              placeholder="Tên nhóm"
              placeholderTextColor={color.textSecondary}
              style={[
                styles.modalInput,
                {color: color.text, borderColor: color.textSecondary},
              ]}
              value={groupName}
              onChangeText={setGroupName}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={{color: color.error}}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleCreateRoom}>
                <Text style={{color: color.background, fontWeight: '500'}}>
                  Tạo nhóm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  selectedScroll: {
    maxHeight: 100,
  },
  selectedItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 64,
    marginTop: 10,
  },
  selectedAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  removeIcon: {
    backgroundColor: '#aaa',
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 10,
    padding: 2,
  },
  selectedName: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  suggestionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 14,
    fontWeight: '500',
  },
  friendUsername: {
    color: '#aaa',
    fontSize: 12,
  },
  friendCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 999,
  },
  modalContainer: {
    width: '100%',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 16,
  },
  confirmButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
});
