import {StyleSheet} from 'react-native';
import {Colors} from '../../assets/color/Colors';

type ThemeType = 'light' | 'dark';

const SwitchAccountStyles = (theme: ThemeType) => {
  const color = Colors[theme];

  return StyleSheet.create({
    body: {
      width: '100%',
      marginBottom: 50,
    },
    input: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: color.transparent,
      backgroundColor: Colors.light.background,
      color: Colors.light.text,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginTop: 15,
      marginBottom: 15,
    },
    btnForgot: {
      marginTop: 20,
      marginBottom: 5,
    },
    textForgot: {
      color: color.primary,
      fontSize: 16,
      textAlign: 'right',
    },
    textFb: {
      color: color.primary,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
    textGoogle: {
      color: color.orange,
      fontSize: 16,
      textAlign: 'center',
    },
    icon: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      marginRight: 15,
    },
  });
};

export default SwitchAccountStyles;
