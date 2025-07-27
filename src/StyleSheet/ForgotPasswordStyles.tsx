import {StyleSheet} from 'react-native';
import {Colors} from '../../assets/color/Colors';

type ThemeType = 'light' | 'dark';

const ForgotPasswordStyles = (theme: ThemeType) => {
  const color = Colors[theme];

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
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      padding: 20,
    },
    loadingContainer: {
      marginBottom: 20,
      backgroundColor: Colors.dark.background,
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 40,
    },
    backButton: {
      padding: 8,
    },
    logo: {
      width: 120,
      height: 120,
    },
    placeholder: {
      width: 40,
    },
    body: {
      width: '100%',
      flex: 1,
      paddingTop: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: color.black,
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: color.lightDark,
      textAlign: 'center',
      marginBottom: 30,
      paddingHorizontal: 20,
    },
    input: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: color.transparent,
      backgroundColor: Colors.light.background,
      color: Colors.black,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginTop: 15,
      marginBottom: 15,
    },
    passwordContainer: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    passwordInput: {
      width: '90%',
      color: color.black,
    },
    eyeButton: {
      padding: 5,
    },
    buttonLogin: {
      backgroundColor: Colors.light.primary,
      borderRadius: 30,
      padding: 12,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textBtn: {
      color: Colors.dark.text,
      fontSize: 17,
    },
    disabledButton: {
      backgroundColor: color.lightGray,
    },
    disabledText: {
      color: color.lightDark,
    },
    errorText: {
      fontSize: 12,
      color: Colors.error,
      marginLeft: 5,
    },
    // Confirmation Code specific styles
    codeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    codeInput: {
      width: 45,
      height: 55,
      borderWidth: 2,
      borderColor: color.lightGray,
      backgroundColor: Colors.light.background,
      borderRadius: 8,
      fontSize: 24,
      fontWeight: 'bold',
      color: color.black,
    },
    codeInputFilled: {
      borderColor: color.primary,
    },
    resendContainer: {
      alignItems: 'flex-end',
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    resendText: {
      fontSize: 14,
      color: color.lightDark,
    },
    resendLink: {
      color: color.primary,
      fontWeight: 'bold',
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    toggleText: {
      textAlign: 'center',
      color: color.primary,
      marginTop: 10,
      textDecorationLine: 'underline',
    },
  });
};

export default ForgotPasswordStyles;
