import {StyleSheet} from 'react-native';
import {Colors} from '../../assets/color/Colors';

type ThemeType = 'light' | 'dark';

const MessageBoxStyles = (theme: ThemeType) => {
  const color = Colors[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.background,
    },
    headerContainer: {
      flexDirection: 'row',
      width: '100%',
      paddingVertical: 20,
      paddingHorizontal: 5,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerBlock: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBlock: {
      width: 20,
      height: 20,
      marginHorizontal: 5,
    },
    icon: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      tintColor: color.text,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: color.text,
    },
    searchContainer: {
      width: '100%',
      paddingHorizontal: 10,
    },
    searchBlock: {
      backgroundColor: color.search,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      paddingHorizontal: 5,
    },
  });
};

export default MessageBoxStyles;
