import {StyleSheet} from 'react-native';
import {Colors} from '../../assets/color/Colors';

export const ChangePasswordStyles = (theme: 'light' | 'dark') => {
  const color = Colors[theme];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.background,
      paddingHorizontal: 24,
      paddingVertical: 20,
    },
    iconBack: {
      width: 14,
      resizeMode: 'contain',
      tintColor: color.text,
    },
    textXL: {
      fontSize: 25,
      fontWeight: '500',
      color: color.text,
    },
    textL: {
      fontSize: 16,
      fontWeight: '400',
      color: color.text,
    },
    textM: {
      fontSize: 14,
      fontWeight: '400',
      color: color.textSecondary,
    },
    textContainer: {
      marginVertical: 20,
      gap: 10,
    },
    listContainer: {
      borderColor: color.text,
      borderWidth: 0.5,
      borderRadius: 15,
      overflow: 'hidden',
      width: '100%',
    },
    btnContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderBottomWidth: 0.5,
      borderBottomColor: color.text,
    },
    userImg: {
      width: 50,
      height: 50,
      resizeMode: 'cover',
      borderRadius: 100,
      borderColor: color.gray,
      borderWidth: 0.5,
    },
    iconSmall: {
      width: 7,
      resizeMode: 'contain',
      tintColor: color.text,
    },
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: color.lightDark,
    },
    inputContainer: {
      gap: 15,
      marginBottom: 20,
    },
    topContainer: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      flex: 1,
    },
    bottomContainer: {
      paddingHorizontal: 24,
      paddingVertical: 15,
      borderTopColor: color.gray,
      borderTopWidth: 1,
    },
    btnChange: {
      backgroundColor: color.primary,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
    },
    row: {
      flexDirection: 'row',
      gap: 10,
      flex: 1,
    },
    error: {
      fontSize: 12,
      color: color.error,
      textAlign: 'justify',
    },
    tick: {
      width: 20,
      height: 20,
      tintColor: color.primary,
      resizeMode: 'contain',
    },
    circle: {
      width: 20,
      height: 20,
      backgroundColor: color.transparent,
      borderColor: color.primary,
      borderWidth: 1,
      borderRadius: 100,
    },
  });
};
