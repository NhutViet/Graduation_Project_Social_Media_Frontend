import {StyleSheet} from 'react-native';
import {Colors} from '../../assets/color/Colors';

const LoginStyles = () => {
  return StyleSheet.create({
    page: {
      position: 'relative',
      flex: 1,
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
    btnBack: {
      position: 'absolute',
      top: 40,
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
    modal: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContainer: {
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      width: '70%',
      borderRadius: 15,
      padding: 15,
    },
    textNoti: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.black,
      marginTop: 15,
    },
    textContent: {
      fontSize: 16,
      fontWeight: '400',
      color: '#8E8E8E'
    },
    iconNoti: {
      width: 60, height: 60,
      resizeMode: 'contain',
    },
    errorText: {
      fontSize: 12,
      color: Colors.error,
      marginTop: 5,
    },
  });
};

export default LoginStyles;
