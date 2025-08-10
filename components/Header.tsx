import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {Colors} from '../assets/color/Colors';
import {useTheme} from '../src/util/ThemeContext';
import {Provider} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {RootState} from '@services/store';
import {getUnreadNotificationCount} from '@services/notificationRedux/notificationSlice';

import {
  Bell,
  MessageSquare,
  ArrowLeft,
  ScanLine,
  MessageCirclePlus,
  Plus,
} from 'lucide-react-native';

type HeaderProps = {
  title?: string;
  pressableTitle?: string;
  icon?: ImageSourcePropType;
  iconBack?: boolean;
  iconQR?: boolean;
  iconNotify?: boolean;
  iconMessage?: boolean;
  showAddIcon?: boolean;
  iconNewChat?: boolean;
  func?: () => void;
  funcLeft?: () => void;
  pressableTilFunc?: () => void;
  navigation: {
    navigate: (screen: string) => void;
  };
};

const Header = (props: HeaderProps) => {
  const {
    title,
    icon,
    iconBack,
    iconQR,
    iconNotify,
    iconMessage,
    showAddIcon,
    iconNewChat,
    func,
    funcLeft,
    navigation,
    pressableTitle,
    pressableTilFunc,
  } = props;

  const {theme} = useTheme();
  const color = Colors[theme];

  const isReadNoti = useSelector(
    (state: RootState) => state.notification.isReadNoti,
  );
  const unreadCount = useSelector((state: RootState) => {
    const notifications = state.notification.notifications;
    return getUnreadNotificationCount(notifications);
  });

  return (
    <Provider>
      <View style={[styles.container, {backgroundColor: color.background}]}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {icon && (
            <View>
              <Image source={icon} style={styles.logo} />
            </View>
          )}

          {iconBack && (
            <TouchableOpacity style={styles.iconBox} onPress={func}>
              <ArrowLeft size={22} color={color.text} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          {title && (
            <Text style={[styles.title, {color: color.text}]}>{title}</Text>
          )}
          {pressableTitle && (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={pressableTilFunc}>
              <Text style={[styles.title, {color: color.text}]}>
                {pressableTitle}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {iconQR && (
            <TouchableOpacity
              style={styles.iconBox}
              onPress={() => navigation.navigate('QRCode')}>
              <ScanLine size={22} color={color.text} />
            </TouchableOpacity>
          )}

          {iconNotify && (
            <TouchableOpacity
              style={styles.iconBox}
              onPress={() => navigation.navigate('NotificationsScreen')}>
              <Bell size={22} color={color.text} />
              {(unreadCount > 0 || isReadNoti) && (
                <View
                  style={[styles.badge, {backgroundColor: color.primary}]}
                />
              )}
            </TouchableOpacity>
          )}

          {iconMessage && (
            <TouchableOpacity
              style={styles.iconBox}
              onPress={() => navigation.navigate('MessageBox')}>
              <MessageSquare size={22} color={color.text} />
            </TouchableOpacity>
          )}

          {showAddIcon && (
            <TouchableOpacity style={styles.iconBox} onPress={funcLeft}>
              <Plus size={22} color={color.text} />
            </TouchableOpacity>
          )}

          {iconNewChat && (
            <TouchableOpacity style={styles.iconBox} onPress={func}>
              <MessageCirclePlus size={22} color={color.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    paddingVertical: 10,
    height: 60,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSection: {
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 30,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconBox: {
    width: 20,
    height: 20,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 10,
    height: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 1,
  },
});

export default Header;
