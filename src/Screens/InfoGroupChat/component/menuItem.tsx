/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  AlertTriangle,
  ChevronRight,
  Images,
  LinkIcon,
  Lock,
  UserCheck,
  Users,
} from 'lucide-react-native';
import React, {memo, useCallback} from 'react';
import {TouchableOpacity, View, Text, Image} from 'react-native';
import {styles} from '../index';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  textColor: string;
}

const MenuItem = React.memo(
  ({icon, title, subtitle, onPress, textColor}: MenuItemProps) => {
    return (
      <TouchableOpacity style={styles.btn} onPress={onPress}>
        <View style={styles.menuItem}>
          <View style={styles.menuIcon}>{icon}</View>
          <View style={styles.menuTextBlock}>
            <Text style={[styles.menuTitle, {color: textColor}]}>{title}</Text>
            {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        <ChevronRight size={22} color={textColor} />
      </TouchableOpacity>
    );
  },
);

export const MenuSection = memo(
  ({
    media,
    color,
    navigation,
    setVisibleThemeModal,
    room,
  }: {
    room: string;
    media: any[];
    color: any;
    navigation: any;
    setVisibleThemeModal: (visible: boolean) => void;
  }) => {
    const handleThemePress = useCallback(() => {
      setVisibleThemeModal(true);
    }, [setVisibleThemeModal]);

    const handlePeoplePress = useCallback(() => {
      navigation.navigate('PeopleGroupChat', {roomId: room});
    }, [navigation]);

    const handleMoveToGalleryPress = useCallback(() => {
      navigation.navigate('GroupGallery', {roomId: room});
    }, [navigation, room]);

    return (
      <View style={{flex: 1, padding: 24}}>
        <MenuItem
          icon={<UserCheck size={22} color={color.text} />}
          title="Chủ đề"
          subtitle="Mặc định"
          onPress={handleThemePress}
          textColor={color.text}
        />

        <MenuItem
          icon={<Users size={22} color={color.text} />}
          title="Mọi người"
          onPress={handlePeoplePress}
          textColor={color.text}
        />

        <TouchableOpacity
          style={[
            styles.btn,
            {
              marginVertical: 10,
              borderRadius: 8,
            },
          ]}
          onPress={handleMoveToGalleryPress}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Images size={22} color={color.text} />
            </View>
            <View style={styles.menuTextBlock}>
              <Text style={[styles.menuTitle, {color: color.text}]}>
                Ảnh, Video
              </Text>
            </View>
          </View>
          <ChevronRight size={22} color={color.text} />
        </TouchableOpacity>

        {media && media.length > 0 ? (
          <View
            style={[
              styles.mediaContainer,
              {backgroundColor: color.backgroundSecondary},
            ]}>
            <View style={styles.mediaRow}>
              {media.slice(0, 3).map(item => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.mediaItem}
                  onPress={handleMoveToGalleryPress}
                  activeOpacity={0.8}>
                  <Image
                    source={{uri: item.media.url}}
                    style={styles.mediaImage}
                  />
                </TouchableOpacity>
              ))}

              {media.length > 3 && (
                <TouchableOpacity
                  style={styles.mediaItem}
                  onPress={handleMoveToGalleryPress}
                  activeOpacity={0.8}>
                  <View style={styles.placeholder}>
                    <Text style={[styles.placeholderText, {color: color.text}]}>
                      +{media.length - 3}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: color.backgroundSecondary,
              height: 70,
              marginHorizontal: 10,
              marginBottom: 15,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: color.text}}>Hiện chưa có nội dung</Text>
          </View>
        )}

        <MenuItem
          icon={<Lock size={22} color={color.text} />}
          title="Quyền riêng tư và bảo mật"
          onPress={() => navigation.navigate('PrivacySafetyChat')}
          textColor={color.text}
        />
      </View>
    );
  },
);
