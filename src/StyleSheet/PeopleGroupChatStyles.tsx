import {StyleSheet} from 'react-native';
import {Colors} from '../../assets/color/Colors';

export const PeopleGroupChatStyles = (theme: 'light' | 'dark') => {
  const color = Colors[theme];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 15,
      borderBottomColor: color.gray,
      borderBottomWidth: 1,
    },
    icon: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      tintColor: color.text,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: color.text,
    },
    rowSpace: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 15,
      marginHorizontal: 24,
    },
    titleS: {
      fontSize: 14,
      fontWeight: 'bold',
      color: color.textSecondary,
      marginHorizontal: 24,
      marginVertical: 10,
    },
  });
};
