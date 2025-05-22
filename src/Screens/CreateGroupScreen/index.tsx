import React, {useState} from 'react';
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
interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

const DUMMY_FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Hello Kitty',
    username: '7tzwxie_',
    avatar: 'https://picsum.photos/id/1/100',
  },
  {
    id: '2',
    name: 'Double Girl',
    username: '08.tt_',
    avatar: 'https://picsum.photos/id/2/100',
  },
  {
    id: '3',
    name: 'iris_miie',
    username: 'iris_miie',
    avatar: 'https://picsum.photos/id/3/100',
  },
  {
    id: '4',
    name: 'Nhật Hà',
    username: 'ngnha_23',
    avatar: 'https://picsum.photos/id/4/100',
  },
  {
    id: '5',
    name: 'Vương Hoàng',
    username: '_voung_',
    avatar: 'https://picsum.photos/id/5/100',
  },
  {
    id: '6',
    name: 'Chu Kim Gun',
    username: '_kym.hangz',
    avatar: 'https://picsum.photos/id/6/100',
  },
];

export const CreateGroupScreen = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<Friend[]>([]);
  const {theme} = useTheme();
  const color = Colors[theme];

  const toggleSelect = (friend: Friend) => {
    const exists = selected.find(item => item.id === friend.id);
    if (exists) {
      setSelected(prev => prev.filter(item => item.id !== friend.id));
    } else {
      setSelected(prev => [...prev, friend]);
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
        <Text style={[styles.title, {color: color.text}]}>Tên nhóm chat</Text>
        <View style={{width: 24}} />
      </View>

      {/* Search Box */}
      <View style={[styles.searchBox, {backgroundColor: color.background}]}>
        <Search size={20} color="#aaa" />
        <TextInput
          placeholder="Tìm kiếm"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>

      {/* Selected Avatars */}
      {selected.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.selectedScroll}>
          {selected.map(item => (
            <View key={item.id} style={styles.selectedItem}>
              <Image
                source={{uri: item.avatar}}
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
                {item.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Suggestions */}
      <Text style={[styles.suggestionLabel, {color: color.text}]}>Gợi ý</Text>
      <FlatList
        data={DUMMY_FRIENDS}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const isSelected = selected.some(f => f.id === item.id);
          return (
            <TouchableOpacity
              style={styles.friendRow}
              onPress={() => toggleSelect(item)}>
              <Image source={{uri: item.avatar}} style={styles.friendAvatar} />
              <View style={styles.friendInfo}>
                <Text style={[styles.friendName, {color: color.text}]}>
                  {item.name}
                </Text>
                <Text style={styles.friendUsername}>{item.username}</Text>
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
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Tạo đoạn chat</Text>
        </TouchableOpacity>
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
    color: '#fff',
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
    marginBottom: 8,
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
});
