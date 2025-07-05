import {StyleSheet} from 'react-native';
import {Colors} from '../../assets/color/Colors';

export const ChangeBirthdayStyles = (theme: 'light' | 'dark') => {
  const colors = Colors[theme];
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      paddingTop: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginVertical: 20,
      color: colors.text,
    },
    pickerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 40,
    },
    picker: {
      flex: 1,
      backgroundColor: colors.gray,
      margin: 2,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    buttonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: 'bold',
    },
    iconBack: {
      width: 14,
      resizeMode: 'contain',
      tintColor: colors.text,
    },
  });
};
