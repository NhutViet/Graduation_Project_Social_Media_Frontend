import {
  Image,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
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
} from 'lucide-react-native';

export const Setting = () => {
  const navigation: any = useNavigation();
  const {theme, toggleTheme} = useTheme();
  const styles = createStyles(theme);
  const mColor = Colors[theme] || Colors;

  const handleLogout = () => {
    // In a real app, we would clear the auth state
    // For now, just navigate back to profile
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: mColor.background}]}>
      <ScrollView>
        <Header
          title="Settings and privacy "
          iconBack={require('../../../assets/icon/left.png')}
          iconQR={require('../../../assets/icon/qr.png')}
          func={() => navigation.goBack()}
          navigation={navigation}
        />
        <View style={styles.content}>
          {/* Account Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: mColor.text}]}>
              Account
            </Text>

            <TouchableOpacity
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
                  Personal Information
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: mColor.textSecondary},
                  ]}>
                  Update your profile details
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
                  Activity Status
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: mColor.textSecondary},
                  ]}>
                  Update your activity status
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
                <Image source={require('../../../assets/icon/block.png')} style={{width: 20, height: 20, tintColor: mColor.text}} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Blocked
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>
            {/* Tương tự cho các settingItem khác trong Account Section */}
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: mColor.text}]}>
              Preferences
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
                  Dark Mode
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: mColor.textSecondary},
                  ]}>
                  Toggle dark theme
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
              Privacy
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
                  Privacy and Security
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: mColor.textSecondary},
                  ]}>
                  Settings for privacy and security
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>

            {/* Tương tự cho các settingItem khác trong Account Section */}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: mColor.text}]}>
              Notifications
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
                  Update you notification settings
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: mColor.textSecondary},
                  ]}>
                  Choose how you want to be notified
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>

          </View>

          {/* Activity Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: mColor.text}]}>
              Activity
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
                  Likes
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: mColor.textSecondary},
                  ]}>
                  Posts you've liked
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
                  Archive
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
                <Image
                  source={require('../../../assets/icon/bookmark.png')}
                  style={{width: 20, height: 20, tintColor: mColor.text}}
                />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, {color: mColor.text}]}>
                  Saved
                </Text>
              </View>
              <ChevronRight size={20} stroke={mColor.textSecondary} />
            </TouchableOpacity>

            {/* Tương tự cho settingItem khác trong Activity Section */}
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: mColor.text}]}>
              Support
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
                  Help Center
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: mColor.textSecondary},
                  ]}>
                  Get help with Instagram
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
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
