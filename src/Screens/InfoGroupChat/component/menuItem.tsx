/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import { AlertTriangle, ChevronRight, Images, LinkIcon, Lock, UserCheck, UserPlus, Users } from 'lucide-react-native';
import React, { memo, useCallback } from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { styles } from '../index';
import { FlashList } from '@shopify/flash-list';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  textColor: string;
}

const MenuItem = React.memo(({ icon, title, subtitle, onPress, textColor }: MenuItemProps) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <View style={styles.menuItem}>
        <View style={styles.menuIcon}>
          {icon}
        </View>
        <View style={styles.menuTextBlock}>
          <Text style={[styles.menuTitle, { color: textColor }]}>
            {title}
          </Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <ChevronRight size={22} color={textColor} />
    </TouchableOpacity>
  );
});

export const MenuSection = memo(({ media, color, navigation, setVisibleThemeModal, room }: {
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

  const handleCreateGroupPress = useCallback(() => {
    navigation.navigate('CreateGroupScreen');
  }, [navigation]);

  const handleMoveToGalleryPress = useCallback(() => {
    navigation.navigate('GroupGallery', { roomId: room });
  }, [navigation, room]);

  return (
    <View
      style={{ flex: 1, padding: 24 }}>
      <MenuItem
        icon={<UserCheck size={22} color={color.text} />}
        title="Chủ đề"
        subtitle="Mặc định"
        onPress={handleThemePress}
        textColor={color.text}
      />

      <MenuItem
        icon={<LinkIcon size={22} color={color.text} />}
        title="Liên kết"
        subtitle="Đang tắt"
        textColor={color.text}
      />

      <MenuItem
        icon={<Users size={22} color={color.text} />}
        title="Mọi người"
        onPress={handlePeoplePress}
        textColor={color.text}
      />

      <TouchableOpacity
        style={[styles.btn, {
          marginVertical: 10,
          borderRadius: 8,
        }]}
        onPress={handleMoveToGalleryPress}
      >
        <View style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Images size={22} color={color.text} />
          </View>
          <View style={styles.menuTextBlock}>
            <Text style={[styles.menuTitle, { color: color.text }]}>
              Ảnh, Video
            </Text>
          </View>
        </View>
        <ChevronRight size={22} color={color.text} />
      </TouchableOpacity>

      {media && media.length > 0 ? (
        <View style={{
          marginHorizontal: 10,
          marginBottom: 15,
          backgroundColor: color.backgroundSecondary,
          borderRadius: 8,
          overflow: 'hidden',
          flex: 1,
        }}>
          <FlashList
            data={media.slice(0, 4)}
            numColumns={5}
            estimatedItemSize={100}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  width: '100%',
                  aspectRatio: 1,
                  padding: 1,
                }}
                onPress={() => navigation.navigate('GroupGallery', { roomId: room })}
              >
                <Image
                  source={{ uri: item.media.url }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 4,
                  }}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
            ListFooterComponent={() => media.length > 4 ? (
              <TouchableOpacity
                style={{
                  width: '100%',
                  aspectRatio: 1,
                  padding: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  borderRadius: 4,
                }}
                onPress={() => navigation.navigate('GroupGallery', { roomId: room })}
              >
                <Text style={{ color: color.text, fontWeight: 'bold' }}>
                  Xem thêm
                </Text>
              </TouchableOpacity>
            ) : null}
          />
        </View>
      ) : (
        <View style={{
          marginHorizontal: 10,
          marginBottom: 15,
          backgroundColor: color.backgroundSecondary,
          borderRadius: 8,
          padding: 15,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{ color: color.text }}>
            Hiện chưa có nội dung
          </Text>
        </View>
      )}

      <MenuItem
        icon={<UserPlus size={22} color={color.text} />}
        title="Biệt danh"
        textColor={color.text}
      />

      <MenuItem
        icon={<Lock size={22} color={color.text} />}
        title="Quyền riêng tư và bảo mật"
        onPress={() => navigation.navigate('PrivacySafetyChat')}
        textColor={color.text}
      />

      <MenuItem
        icon={<Users size={22} color={color.text} />}
        title="Tạo nhóm mới"
        onPress={handleCreateGroupPress}
        textColor={color.text}
      />

      <MenuItem
        icon={<AlertTriangle size={22} color={color.text} />}
        title="Đã xảy ra lỗi"
        textColor={color.text}
      />
    </View>
  );
});
