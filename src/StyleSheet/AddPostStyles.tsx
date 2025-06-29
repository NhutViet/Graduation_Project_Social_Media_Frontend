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
      alignItems: 'center',
      justifyContent: 'center',
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
      resizeMode: 'contain',
    },
    iconR: {
      tintColor: color.text,
      width: 20,
      height: 20,
      resizeMode: 'contain',
    },
    iconRR: {
      tintColor: color.text,
      width: 6,
      height: 10,
      marginLeft: 10,
      resizeMode: 'contain',
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
      marginRight: 10,
      borderColor: color.gray,
      borderWidth: 1,
      backgroundColor: color.lightGray,
    },
    showImage: {
      width: '100%',
      height: '100%',
    },
    placeholderText: {
      textAlign: 'center',
      marginTop: 20,
      color: color.text,
      fontSize: 20,
    },
    btnCir: {
      padding: 8,
      borderRadius: 20,
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
      alignItems: 'center',
    },
    textBtn: {
      color: color.background,
      fontSize: 16,
      fontWeight: '700',
    },
    divi: {
      backgroundColor: color.gray,
      width: '100%',
      height: 3,
    },
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:
        theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
    },
    modalContainer: {
      width: '70%',
      backgroundColor: color.background,
      borderRadius: 10,
      height: 150,
      padding: 10,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
    },
    iconCheck: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      tintColor: color.primary,
    },
    emtyContainer: {
      width: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconEmty: {
      width: '30%',
      height: '30%',
      marginBottom: 15,
      resizeMode: 'contain',
      tintColor: color.text,
    },
    notFound: {
      fontSize: 30,
      fontWeight: '500',
      textAlign: 'center',
      color: color.text,
    },
    reels: {
      width: '90%',
      height: height * 0.8,
      resizeMode: 'cover',
      borderRadius: 10,
      overflow: 'hidden',
    },
    iconPlay: {
      tintColor: color.background,
      width: 30,
      height: 30,
    },
    iconPlayContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 100,
      backgroundColor:
        theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    },
    iconReels: {
      width: 18,
      height: 18,
      resizeMode: 'contain',
      tintColor: color.background,
    },
    reelsContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor:
        theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
      padding: 5,
      borderRadius: 50,
      borderColor: color.background,
      borderWidth: 1,
    },
  });
};
