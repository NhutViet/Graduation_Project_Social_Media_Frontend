import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../assets/color/Colors';

export const getAddPostStyles = (theme: 'light' | 'dark') => {
  const color = Colors[theme];
  const {height} = Dimensions.get('window');

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.background,
    },
    showContainer: {
      height: height * 0.4,
      backgroundColor: color.gray,
    },
    rowSpace: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    icon: {
      tintColor: color.text,
      width: 19,
      height: 17,
      resizeMode: 'contain'
    },
    iconR: {
      tintColor: color.text,
      width: 20,
      resizeMode: 'contain'
    },
    iconRR: {
      tintColor: color.text,
      width: 6,
      height: 10,
      marginLeft: 10,
      resizeMode: 'contain'
    },
    textR: {
      color: color.text,
      fontSize: 14,
      fontWeight: 'bold',
    },
    title: {
      color: color.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
    imgShow: {
      width: 240,
      height: 330,
      borderRadius: 10,
      marginRight: 10
    },
    showImage: {
      width: '100%',
      height: '100%',
    },
    placeholderText: {
      textAlign: 'center',
      marginTop: 20,
    },
    btnCir: {
      padding: 8,
      borderRadius: 20
    },
    textIn: {
      borderColor: color.transparent,
      height: 100,
      color: color.text,
      marginHorizontal: 20,
    },
    btnTD: {
      backgroundColor: color.gray,
      padding: 10,
      borderRadius: 8,
      marginVertical: 15,
      marginLeft: 20,
      flexDirection: 'row',
      alignSelf: 'flex-start',
      alignItems: 'center',
      gap: 10,
    },
    btnShare: {
      backgroundColor: color.text,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginVertical: 10,
      marginHorizontal: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textBtn: {
      color: color.background,
      fontSize: 16,
      fontWeight: '700',
    },
    divi:{
      backgroundColor: color.gray, width: '100%', height: 3
    }
  });
};