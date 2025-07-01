import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
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
} from 'lucide-react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../Navigation/AppNavigation';
import ModalTheme from '../Message/components/ModalTheme';
import {
  updateRoomName,
  updateRoomTheme,
} from '../../../services/roomRedux/roomSlice';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {ModalRenameRoom} from '../../../components/ModalRenameRoom';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';

export const InforGroupChat = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation: any = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<RouteProp<RootStackParamList, 'InforGroupChat'>>();
  const roomId = route?.params?.roomId;
  const img1 = route?.params?.img1;
  const img2 = route?.params?.img2;
  const [visibleThemeModal, setVisibleThemeModal] = useState(false);
  const [visibleRenameModal, setVisibleRenameModal] = useState(false);
  const rooms = useSelector((state: RootState) => state.rooms.rooms);
  const room = useMemo(
    () => rooms.find(r => r._id === roomId),
    [rooms, roomId],
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/icon/left.png')}
            style={{width: 20, height: 20, tintColor: color.text}}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarBlock}>
        <TouchableOpacity
          style={[
            styles.imgContainer,
            {overflow: img1 && !img2 ? 'hidden' : undefined},
          ]}>
          {img2 && (
            <>
              <Image style={styles.iconW} source={{uri: img1}} />
              <Image
                style={[
                  styles.iconF,
                  {
                    borderColor: color.background,
                    backgroundColor: color.backgroundSecondary,
                  },
                ]}
                source={{uri: img2}}
              />
            </>
          )}
          {!img2 && img1 && <Image style={styles.img} source={{uri: img1}} />}
        </TouchableOpacity>
        <Text style={[styles.name, {color: color.text}]}>{room?.name}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate('AddPeopleToGroupChat')}>
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
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => setVisibleRenameModal(true)}>
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
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setVisibleThemeModal(true);
          }}>
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

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('PeopleGroupChat')}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Users size={24} color={color.text} />
            </View>
            <View style={styles.menuTextBlock}>
              <Text style={[styles.menuTitle, {color: color.text}]}>
                Mọi người
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

        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            navigation.navigate('CreateGroupScreen');
          }}>
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
      <ModalTheme
        visible={visibleThemeModal}
        onClose={() => {
          setVisibleThemeModal(false);
        }}
        onSelect={selectedBackground => {
          dispatch(updateRoomTheme({roomId: roomId, theme: selectedBackground}))
            .unwrap()
            .then(() => {
              GlobalAlertManager.show('Thành công', 'Đã cập nhật chủ đề');
            })
            .catch(() => {
              GlobalAlertManager.show('Thất bại', 'Cập nhật chủ đề thất bại');
            });
          setVisibleThemeModal(false);
        }}
      />
      <ModalRenameRoom
        visible={visibleRenameModal}
        onClose={() => setVisibleRenameModal(false)}
        currentName={room?.name || ''}
        theme={theme}
        onSubmit={(newName: string) => {
          dispatch(updateRoomName({roomId: roomId, name: newName}))
            .unwrap()
            .then(() => {
              GlobalAlertManager.show('Thành công', 'Đã đổi tên nhóm');
              setVisibleRenameModal(false);
            })
            .catch(() => {
              GlobalAlertManager.show('Lỗi', 'Không thể đổi tên nhóm');
            });
        }}
      />
    </SafeAreaView>
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
    padding: 12,
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
  imgContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconW: {
    width: '75%',
    height: '75%',
    resizeMode: 'cover',
    borderRadius: 40,
    top: 0,
    left: 0,
    position: 'absolute',
  },
  iconF: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
    borderRadius: 40,
    zIndex: 1,
    bottom: 0,
    right: 0,
    borderWidth: 2,
    position: 'absolute',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
