import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {
  Bell,
  Link as LinkIcon,
  Search,
  UserPlus,
  Lock,
  AlertTriangle,
  Users,
  UserCheck,
  ChevronRight,
  PenLine,
  LogOut,
  ChevronLeft,
} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';

export const InforGroupChat = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation: any = useNavigation();
  const [imageUri, setImageUri] = useState(
    'https://i.pinimg.com/736x/2d/db/ae/2ddbaec1fb3d18f6ce00c4ebc1693193.jpg',
  );

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
  return (
    <View style={[styles.container, {backgroundColor: color.background}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color={color.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarBlock}>
        <Image source={{uri: imageUri}} style={styles.avatar} />
        <Text style={[styles.name, {color: color.text}]}>
          vang vang vang vang
        </Text>
        <TouchableOpacity onPress={requestPermissionAndPickImage}>
          <Text style={styles.edit}>Đổi hình ảnh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('AddPeopleToGroupChat')}>
          <UserPlus size={20} color={color.text} />
          <Text style={[styles.actionText, {color: color.text}]}>Thêm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <Search size={20} color={color.text} />
          <Text style={[styles.actionText, {color: color.text}]}>Tìm kiếm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <Bell size={20} color={color.text} />
          <Text style={[styles.actionText, {color: color.text}]}>
            Tắt thông báo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <PenLine size={20} color={color.text} />
          <Text style={[styles.actionText, {color: color.text}]}>
            Đổi tên nhóm
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <LogOut size={20} color={color.text} />
          <Text style={[styles.actionText, {color: color.text}]}>Rời khỏi</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          padding: 24,
        }}>
        <TouchableOpacity style={styles.btn}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <UserCheck size={24} color={color.text} />
            </View>
            <View style={styles.menuTextBlock}>
              <Text style={[styles.menuTitle, {color: color.text}]}>
                Chủ đề
              </Text>
              <Text style={styles.menuSubtitle}>Mặc định</Text>
            </View>
          </View>
          <ChevronRight size={24} color={color.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <LinkIcon size={24} color={color.text} />
            </View>
            <View style={styles.menuTextBlock}>
              <Text style={[styles.menuTitle, {color: color.text}]}>
                Liên kết
              </Text>
              <Text style={styles.menuSubtitle}>Đang tắt</Text>
            </View>
          </View>
          <ChevronRight size={24} color={color.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('PeopleGroupChat')}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Users size={24} color={color.text} />
            </View>
            <View style={styles.menuTextBlock}>
              <Text style={[styles.menuTitle, {color: color.text}]}>
                Mọi người
              </Text>
              <Text style={styles.menuSubtitle}>
                alexiexx2487, 7tzwxie_ và 1 người khác
              </Text>
            </View>
          </View>
          <ChevronRight size={24} color={color.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <UserPlus size={24} color={color.text} />
            </View>
            <View style={styles.menuTextBlock}>
              <Text style={[styles.menuTitle, {color: color.text}]}>
                Biệt danh
              </Text>
            </View>
          </View>
          <ChevronRight size={24} color={color.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Lock size={24} color={color.text} />
            </View>
            <View style={styles.menuTextBlock}>
              <Text style={[styles.menuTitle, {color: color.text}]}>
                Quyền riêng tư và an toàn
              </Text>
            </View>
          </View>
          <ChevronRight size={24} color={color.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Users size={24} color={color.text} />
            </View>
            <View style={styles.menuTextBlock}>
              <Text style={[styles.menuTitle, {color: color.text}]}>
                Tạo nhóm mới
              </Text>
            </View>
          </View>
          <ChevronRight size={24} color={color.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <AlertTriangle size={24} color={color.text} />
            </View>
            <View style={styles.menuTextBlock}>
              <Text style={[styles.menuTitle, {color: color.text}]}>
                Đã xảy ra lỗi
              </Text>
            </View>
          </View>
          <ChevronRight size={24} color={color.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  edit: {
    color: '#4A90E2',
    fontSize: 13,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 6,
    fontSize: 12,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuTextBlock: {
    width: '70%',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
});
