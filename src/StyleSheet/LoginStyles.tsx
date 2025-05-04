import {StyleSheet} from 'react-native';
import {Colors} from '../../assets/color/Colors';

const LoginStyles = () => {
  return StyleSheet.create({
    page: {
      flex: 1,
      position: 'relative',
    },
    linear: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0.1,
    },
    container: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      padding: 20,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      width: 180,
      height: 180,
    },
    imageUserBlock: {
      width: 80,
      height: 80,
      borderRadius: 40,
      overflow: 'hidden',
      marginBottom: 10,
    },
    imageUser: {
      width: '100%',
      height: '100%',
    },
    buttonLogin: {
      backgroundColor: Colors.light.primary,
      borderRadius: 30,
      padding: 12,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 20,
    },
    textBtn: {
      color: Colors.dark.text,
      fontSize: 17,
    },
    textSwitchAccount: {
      color: Colors.light.primary,
      fontSize: 15,
      marginTop: 20,
    },
    textGray: {
      color: Colors.light.lightDark,
      fontSize: 15,
    },
    text: {
      color: Colors.light.text,
      fontSize: 15,
    },
    blockCenter: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 100,
    },
    textRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
  });
};

export default LoginStyles;
