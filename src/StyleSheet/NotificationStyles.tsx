import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../util/ThemeContext';
import { Colors } from '../../assets/color/Colors';

// Hook to generate theme-aware notification styles

export const useNotificationStyles = () => {
  const { theme } = useTheme();
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
          position: 'relative',
        },
        backButton: {
          padding: 8,
        },
        headerTitle: {
          textAlign: 'center',
          fontSize: 16,
          fontWeight: '600',
          marginLeft: 16,
          position: 'absolute', 
          left: 0,             
          right: 0,   
          color: palette.text,
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
          backgroundColor: palette.gray,
          justifyContent: 'center',
          alignItems: 'center',
        },
        imageIcon: {
          backgroundColor: palette.lightDark,
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
          height: 84,
          width: 204,
          marginLeft: 12,
          justifyContent: 'center',
        },
        contentText: {
          fontSize: 14,
          lineHeight: 18,
          color: palette.text,
        },
        timeText: {
          color: palette.text,
          opacity: 0.6,
          fontSize: 14,
        },
        actionButton: {
          width: 88,
          height: 32,
          borderRadius: 4,
          backgroundColor: palette.primary,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 12,
        },
        actionButtonTextConfirm: {
          color: palette.background,
          fontWeight: '500',
          fontSize: 14,
        },
        actionButtonTextDelete: {
          color: palette.text,
          fontWeight: '500',
          fontSize: 14,
        },
        actionButtonsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        section: {
          marginBottom: 24,
        },
        sectionTitle: {
          fontSize: 16,
          fontWeight: 'bold',
          marginVertical: 12,
          marginLeft: 16,
          color: palette.text,
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
          backgroundColor: palette.card + '10', 
          borderRadius: 8, 
          marginVertical: 8,
          marginHorizontal: '5%', 
          borderWidth: 0.5, 
          borderColor: palette.gray,
        },
        searchIcon: {
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
            width: 88,
            height: 32,
            borderRadius: 4,
            backgroundColor: palette.blue,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8,
        },
        deleteButton: {
            width: 88,
            height: 32,
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
      }),
    [palette]
  );
};
 