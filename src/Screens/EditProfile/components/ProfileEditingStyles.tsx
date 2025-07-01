import {useMemo} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export const useProfileEditingStyles = () => {
  const {theme} = useTheme();
  const palette = Colors[theme];

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          borderTopWidth: 0.5,
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: palette.transparent,
          borderTopColor: palette.gray,
        },
        title: {
          fontSize: 15,
          fontWeight: '400',
          marginBottom: 4,
          textAlign: 'left',
          color: palette.primary,
        },
        subtitle: {
          fontSize: 15,
          fontWeight: '400',
          marginBottom: 12,
          textAlign: 'left',
          color: palette.text,
        },

        row: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
          minHeight: 44,
        },
        label: {
          fontSize: 15,
          fontWeight: '400',
          color: palette.text,
          textAlign: 'left',
          marginRight: 15,
          width: 110,
          flexShrink: 0,
        },
        input: {
          flex: 1,
          fontSize: 16,
          fontWeight: '400',
          borderBottomWidth: 0.5,
          paddingVertical: 8,
          borderBottomColor: palette.gray,
          color: palette.text,
          minHeight: 40,
          maxHeight: 100,
          justifyContent: 'center',
        },
        screen: {
          flex: 1,
          backgroundColor: palette.background,
        },
        header: {
          width: Dimensions.get('window').width,
          height: 50,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          borderBottomWidth: 0.5,
          borderBottomColor: palette.gray,
        },
        headerText: {
          fontSize: 16,
          color: palette.text,
          marginRight: 5,
        },
        headerTitle: {
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 16,
          color: palette.text,
          fontWeight: '400',
        },
        profileSection: {
          height: 160,
          alignItems: 'center',
          justifyContent: 'center',
        },
        avatar: {
          width: 95,
          height: 95,
          borderRadius: 95 / 2,
          backgroundColor: palette.gray,
        },
        changeText: {
          marginTop: 12,
          fontSize: 13,
          fontWeight: '400',
          color: palette.blue,
        },
        content: {
          flex: 1,
        },
        modalContainer: {
          backgroundColor: palette.card,
          width: SCREEN_WIDTH * 0.8,
          borderRadius: 8,
          padding: 15,
          gap: 5,
        },
        modalOverlay: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
        btnModel: {
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 15,
        },
        textModel: {
          fontSize: 16,
          color: palette.text,
          fontWeight: '500',
        },
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          height: 44,
          paddingHorizontal: 10,
          backgroundColor: palette.background,
        },
        headerIcon: {
          width: 20,
          height: 20,
          marginRight: 8,
          tintColor: palette.text,
          resizeMode: 'contain',
        },
        headerSmallIcon: {
          width: 12,
          height: 12,
          marginLeft: 4,
          tintColor: palette.text,
          resizeMode: 'contain',
        },
        headerUsername: {
          fontSize: 18,
          fontWeight: '700',
          color: palette.text,
          marginLeft: 8,
        },
        headerRightIcons: {
          flexDirection: 'row',
          marginLeft: 'auto',
        },
        tabSwitch: {
          flexDirection: 'row',
          borderBottomWidth: 0.5,
          borderBottomColor: palette.transparent,
        },
        tabButton: {
          flex: 1,
          alignItems: 'center',
          paddingVertical: 12,
        },
        tabText: {
          fontSize: 14,
          fontWeight: '400',
          color: palette.text,
        },
        tabIndicator: {
          height: 2,
          width: '100%',
          backgroundColor: palette.primary,
          marginTop: 4,
        },
        searchContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          height: 40,
          width: SCREEN_WIDTH * 0.9,
          alignSelf: 'center',
          backgroundColor: palette.backgroundSecondary,
          borderRadius: 8,
          paddingHorizontal: 8,
          marginVertical: 12,
        },
        searchIcon: {
          width: 20,
          height: 20,
          tintColor: palette.text,
          marginRight: 8,
        },
        searchInput: {
          flex: 1,
          marginTop: -4,
          fontSize: 15,
          fontWeight: '400',
          color: palette.text,
        },
        listContent: {
          paddingBottom: 16,
        },
        messageThumbnail: {
          flexDirection: 'row',
          alignItems: 'center',
          height: 77,
          marginHorizontal: 16,
        },
        messageAvatar: {
          width: 52,
          height: 52,
          borderRadius: 26,
        },
        messageTextContainer: {
          flex: 1,
          justifyContent: 'center',
          marginHorizontal: 12,
        },
        messageUsername: {
          fontSize: 16,
          fontWeight: '400',
          color: palette.text,
        },
        messageSnippet: {
          fontSize: 16,
          fontWeight: '400',
          color: palette.text,
          backgroundColor: palette.transparent,
          marginTop: 4,
        },
        messageIcon: {
          width: 24,
          height: 24,
          tintColor: palette.text,
        },
        tabSelected: {
          backgroundColor: palette.lightDark,
        },
        textSex: {
          color: palette.text,
        },
        txtDate: {
          color: palette.text,
          fontSize: 16,
          fontWeight: '400',
        },
        txtDatePlaceholder: {
          color: '#979797',
          fontSize: 16,
          fontWeight: '400',
        },
        asterisk: {
          color: 'red',
          fontSize: 15,
          fontWeight: '400',
        },
        dropdownContainer: {
          paddingVertical: 0,
          paddingHorizontal: 0,
          height: 1,
          marginTop: 4,
        },
        dateContainer: {
          justifyContent: 'center',
          paddingHorizontal: 16,
          marginTop: 4,
        },
        textContainer: {
          paddingHorizontal: 16,
          marginTop: 4,
          borderBottomWidth: 0.5,
        },
      }),
    [palette],
  );
};
