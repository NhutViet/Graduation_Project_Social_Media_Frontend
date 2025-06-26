import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../components/Header';
import {createStyles} from '../../StyleSheet/Setting.Styles';
import {
  ChevronRight,
  HelpCircle,
  LogOut,
  Moon,
  Heart,
  User,
  Lock,
  UserRoundCheck,
  SquareActivity,
  Ban,
  Bookmark,
  CircleCheck,
  CircleAlert
} from 'lucide-react-native';
import PersonalDetails from './PersonalDetail';
import ContactInfo from './ContactInfo';
import {useDispatch, useSelector} from 'react-redux';
import {fetchLogout} from '../../../services/userRedux/userSlice';
import {AppDispatch, RootState} from '../../../services/store';
import {resetStatus} from '../../../services/userRedux/userReducer';
import {resetBookmarkState} from '../../../services/bookmarkRedux/bookmarkReducer';
import {resetReaction} from '../../../services/reactionRedux/reactionReducer';

export const Setting = () => {
  const navigation: any = useNavigation();
  const {theme, toggleTheme} = useTheme();
  const styles = createStyles(theme);
  const mColor = Colors[theme] || Colors;

  const [showContact, setShowContact] = useState(false);
  const handleShowContact = () => setShowContact(!showContact);
  const [showPersonalDetail, setShowPersonalDetail] = useState(false);
  const handleShowPersonalDetail = () =>
    setShowPersonalDetail(!showPersonalDetail);

  //redux
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading, isError, isSuccess, errorMessage} = useSelector(
    (state: RootState) => state.user,
  );
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    dispatch(fetchLogout());
  };

  useEffect(() => {
    if (isSuccess && !isLoading) {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        dispatch(resetStatus());
        if (isSuccess) {
          navigation.reset({index: 0, routes: [{name: 'SwitchAccount'}]});
          dispatch(resetBookmarkState());
          dispatch(resetReaction());
        }
      }, 2000);
    }
  }, [isSuccess, isLoading]);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: mColor.background}]}>
      <ScrollView>
        <Header
          title="Cài đặt và hoạt động "
          iconBack={require('../../../assets/icon/left.png')}
          iconQR={require('../../../assets/icon/qr.png')}
          func={() => navigation.goBack()}
          navigation={navigation}
        />
        <View style={styles.content}>
          <View style={styles.section}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={[styles.sectionTitle, {color: mColor.text}]}>
                Tham chiếu tài khoản
              </Text>

              <Image
                source={require('../../../assets/icon/logo_row.png')}
                resizeMode="cover"
                style={{width: 75, height: 25, tintColor: mColor.text}}
              />
            </View>

            <TouchableOpacity
              onPress={() => handleShowPersonalDetail()}
              style={[
                styles.settingItem,
                {
                  backgroundColor: mColor.background,
                  borderBottomColor: mColor.border,
                  borderBottomWidth: 0,
                },
              ]}>
              <PersonalDetails
                isVisible={showPersonalDetail}
                onClose={handleShowPersonalDetail}
              />
              <View
                style={[
                  styles.settingIconContainer,
                  {backgroundColor: mColor.gray},
                ]}>
                <User size={22} stroke={mColor.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Thông tin cá nhân
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleShowContact()}
              style={[
                styles.settingItem,
                {
                  backgroundColor: mColor.background,
                  borderBottomColor: mColor.border,
                  borderBottomWidth: 0,
                },
              ]}>
              <ContactInfo
                isVisible={showContact}
                onClose={handleShowContact}
              />
              <View
                style={[
                  styles.settingIconContainer,
                  {backgroundColor: mColor.gray},
                ]}>
                <User size={22} stroke={mColor.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Thông tin liên hệ
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: mColor.text}]}>
              Tài khoản
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={[
                styles.settingItem,
                {
                  backgroundColor: mColor.background,
                  borderBottomColor: mColor.border,
                  borderBottomWidth: 0,
                },
              ]}>
              <View
                style={[
                  styles.settingIconContainer,
                  {backgroundColor: mColor.gray},
                ]}>
                <User size={22} stroke={mColor.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Thông tin tài khoản
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: mColor.textSecondary},
                  ]}>
                  Cập nhật thông tin tài khoản
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  backgroundColor: mColor.background,
                  borderBottomColor: mColor.border,
                  borderBottomWidth: 0,
                },
              ]}
              onPress={() => navigation.navigate('ShowActivity')}>
              <View
                style={[
                  styles.settingIconContainer,
                  {backgroundColor: mColor.gray},
                ]}>
                <UserRoundCheck size={22} stroke={mColor.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Trạng thái hoạt động
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: mColor.textSecondary},
                  ]}>
                  Cập nhật trạng thái hoạt động
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  backgroundColor: mColor.background,
                  borderBottomColor: mColor.border,
                  borderBottomWidth: 0,
                },
              ]}
              onPress={() => navigation.navigate('YourActivity')}>
              <View
                style={[
                  styles.settingIconContainer,
                  {backgroundColor: mColor.gray},
                ]}>
                <SquareActivity size={22} color={mColor.text}/>
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Hoạt động của bạn
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  backgroundColor: mColor.background,
                  borderBottomColor: mColor.border,
                },
              ]}
              onPress={() => navigation.navigate('BlockedAccounts')}>
              <View
                style={[
                  styles.settingIconContainer,
                  {backgroundColor: mColor.gray},
                ]}>
                <Ban size={22} color={mColor.text}/>
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Đã chặn
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>

            {/* Tương tự cho các settingItem khác trong Account Section */}
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: mColor.text}]}>
              Sở thích
            </Text>

            <View
              style={[
                styles.settingItem,
                {
                  backgroundColor: mColor.background,
                  borderBottomColor: mColor.border,
                },
              ]}>
              <View
                style={[
                  styles.settingIconContainer,
                  {backgroundColor: mColor.gray},
                ]}>
                <Moon size={22} stroke={mColor.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Chế độ tối
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: mColor.textSecondary},
                  ]}>
                  Chuyển chủ đề ứng dụng sang tối
                </Text>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{
                  false: mColor.border,
                  true: mColor.primary,
                }}
                thumbColor={mColor.white}
              />
            </View>

            {/* Tương tự cho settingItem khác trong Preferences Section */}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: mColor.text}]}>
              Riêng tư
            </Text>

            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  backgroundColor: mColor.background,
                  borderBottomColor: mColor.border,
                },
              ]}
              onPress={() => navigation.navigate('Privacy')}>
              <View
                style={[
                  styles.settingIconContainer,
                  {backgroundColor: mColor.gray},
                ]}>
                <Lock size={22} stroke={mColor.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Quyền riêng tư và bảo mật
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: mColor.textSecondary},
                  ]}>
                  Tùy chỉnh cho quyền riêng tư và bảo mật
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>

            {/* Tương tự cho các settingItem khác trong Account Section */}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: mColor.text}]}>
              Thông báo
            </Text>

            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  backgroundColor: mColor.background,
                  borderBottomColor: mColor.border,
                },
              ]}
              onPress={() => navigation.navigate('Notifications')}>
              <View
                style={[
                  styles.settingIconContainer,
                  {backgroundColor: mColor.gray},
                ]}>
                <Lock size={22} stroke={mColor.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Cập nhật cài đặt thông báo
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: mColor.textSecondary},
                  ]}>
                  Chọn cách bạn muốn được thông báo
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Activity Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: mColor.text}]}>
              Hoạt động
            </Text>

            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  backgroundColor: mColor.background,
                  borderBottomColor: mColor.border,
                  borderBottomWidth: 0,
                },
              ]}
              onPress={() => navigation.navigate('LikedScreen')}>
              <View
                style={[
                  styles.settingIconContainer,
                  {backgroundColor: mColor.gray},
                ]}>
                <Heart size={22} stroke={mColor.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Thích
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: mColor.textSecondary},
                  ]}>
                  Các bài đăng bạn đã thích
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  backgroundColor: mColor.background,
                  borderBottomColor: mColor.border,
                  borderBottomWidth: 0,
                },
              ]}
              onPress={() => navigation.navigate('Archive')}>
              <View
                style={[
                  styles.settingIconContainer,
                  {backgroundColor: mColor.gray},
                ]}>
                <Image
                  source={require('../../../assets/icon/clock.png')}
                  style={{width: 20, height: 20, tintColor: mColor.text}}
                />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Kho lưu trữ
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  backgroundColor: mColor.background,
                  borderBottomColor: mColor.border,
                },
              ]}
              onPress={() => navigation.navigate('BookmarkScreen')}>
              <View
                style={[
                  styles.settingIconContainer,
                  {backgroundColor: mColor.gray},
                ]}>
                <Bookmark size={22} color={mColor.text}/>
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Đã lưu
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>

            {/* Tương tự cho settingItem khác trong Activity Section */}
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: mColor.text}]}>
              Hỗ trợ
            </Text>

            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  backgroundColor: mColor.background,
                  borderBottomColor: mColor.border,
                },
              ]}>
              <View
                style={[
                  styles.settingIconContainer,
                  {backgroundColor: mColor.gray},
                ]}>
                <HelpCircle size={22} stroke={mColor.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Trung tâm trợ giúp
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: mColor.textSecondary},
                  ]}>
                  Nhận trợ giúp với Cirla
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>

            {/* Tương tự cho settingItem khác trong Support Section */}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.logoutButton, {backgroundColor: mColor.gray}]}
            onPress={handleLogout}>
            <LogOut size={22} stroke={mColor.error} />
            <Text style={[styles.logoutText, {color: mColor.error}]}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            {isSuccess ? (
              <CircleCheck size={60} color={mColor.white} fill={mColor.primary}/>
            ) : (
              <CircleAlert size={60} color={mColor.white} fill={mColor.error}/>
            )}
            <Text
              style={[
                styles.textNoti,
                {color: isSuccess ? mColor.primary : mColor.error},
              ]}>
              {isSuccess ? 'Đăng xuất thành công' : 'Đã có lỗi xảy ra'}
            </Text>
            {isSuccess && <Text style={styles.textContent}>Hẹn gặp lại</Text>}
            {isError && <Text style={styles.textContent}>{errorMessage}</Text>}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
