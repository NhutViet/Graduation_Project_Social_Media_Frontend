import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from '../util/ThemeContext';
import {Colors} from '../../assets/color/Colors';

// Hook to generate theme-aware notification styles

export const useNotificationStyles = () => {
  const {theme} = useTheme();
  const palette = Colors[theme];

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: palette.background,
        },
        scrollView: {
          flex: 1,
        },
        header: {
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: palette.gray,
          paddingHorizontal: 16,
        },
        backButton: {
          padding: 8,
        },
        headerTitle: {
          textAlign: 'center',
          fontSize: 16,
          fontWeight: '600',
          color: palette.text,
          flex: 1,
        },
        contentContainer: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        },
        storyRing: {
          width: 44,
          height: 44,
          borderRadius: 22,
          justifyContent: 'center',
          alignItems: 'center',
        },
        imageIconContainer: {
          width: 44,
          height: 44,
          borderRadius: 22,
          overflow: 'hidden',
          backgroundColor: palette.gray,
          justifyContent: 'center',
          alignItems: 'center',
        },
        imageIcon: {
          backgroundColor: palette.lightDark,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        profileInitial: {
          fontWeight: '500',
          color: palette.text,
        },
        iconContainer: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: palette.gray,
          justifyContent: 'center',
          alignItems: 'center',
        },
        textContainer: {
          flex: 1,
        },
        contentText: {
          fontSize: 14,
          fontWeight: '400',
          color: palette.text,
        },
        timeText: {
          color: palette.text,
          opacity: 0.6,
          fontSize: 14,
        },
        actionButton: {
          width: 72,
          height: 28,
          borderRadius: 4,
          backgroundColor: palette.primary,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 12,
        },
        actionButtonTextConfirm: {
          color: palette.background,
          fontWeight: '500',
          fontSize: 11,
        },
        actionButtonTextDelete: {
          color: palette.text,
          fontWeight: '500',
          fontSize: 11,
        },
        actionButtonsContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        section: {
          marginBottom: 24,
        },
        sectionTitle: {
          fontSize: 14,
          fontWeight: '500',
          marginVertical: 10,
          marginLeft: 16,
          color: palette.textSecondary,
        },
        iconText: {
          fontSize: 20,
          textAlign: 'center',
          color: palette.text,
        },
        backIcon: {
          width: 20,
          height: 20,
          resizeMode: 'contain',
          tintColor: palette.text,
        },
        userIcon: {
          width: 44,
          height: 44,
          borderRadius: 22,
          resizeMode: 'cover',
        },
        specialContainer: {
          paddingHorizontal: 16,
          backgroundColor: palette.background,
        },
        specialContent: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 12,
        },
        specialTextContainer: {
          flex: 1,
          marginHorizontal: 12,
          justifyContent: 'center',
        },
        specialDot: {
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: '#007AFF',
          marginRight: 8,
        },
        headerManageText: {
          marginLeft: 'auto',
          fontSize: 16,
          fontWeight: '500',
          color: palette.primary,
        },
        searchBar: {
          width: '90%',
          height: 40,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          backgroundColor: palette.lightGray,
          borderRadius: 8,
          marginVertical: 8,
          marginHorizontal: '5%',
          borderWidth: 0.5,
          borderColor: palette.gray,
        },
        searchIcon: {
          width: 16,
          height: 16,
          marginRight: 8,
          opacity: 0.7,
        },
        searchPlaceholderText: {
          flex: 1,
          fontSize: 14,
          color: palette.text,
          opacity: 0.6,
          paddingVertical: 8,
        },
        confirmButton: {
          width: 72,
          height: 28,
          borderRadius: 4,
          backgroundColor: palette.blue,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
        },
        deleteButton: {
          width: 72,
          height: 28,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: palette.text,
          color: palette.text,
          justifyContent: 'center',
          alignItems: 'center',
        },
        moreText: {
          fontSize: 14,
          textAlign: 'left',
          color: palette.primary,
          paddingLeft: 16,
          marginVertical: 8,
        },
        notificationItem: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: palette.card,
          borderRadius: 12,
          marginHorizontal: 16,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 1,
        },

        avatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
          marginRight: 12,
        },
        bodyText: {
          fontSize: 13,
          fontWeight: '400',
          color: palette.textSecondary,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          color: palette.text,
        },

        emptyContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 50,
        },

        emptyText: {
          fontSize: 16,
          color: palette.textSecondary,
        },
      }),
    [palette],
  );
};
