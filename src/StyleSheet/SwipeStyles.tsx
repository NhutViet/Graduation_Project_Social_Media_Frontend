import {StyleSheet} from 'react-native';
import {Colors} from '../../assets/color/Colors';

export const getSwipeStyles = (theme: 'light' | 'dark') => {
  const color = Colors[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.background,
      alignItems: 'center',
    },
    btnContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      marginBottom: 20,
    },
    row: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginTop: 20,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: color.text,
    },
    box: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    back: {
      tintColor: color.text,
      width: 11,
      resizeMode: 'contain',
    },
  });
};
