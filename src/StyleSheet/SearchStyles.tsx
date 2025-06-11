import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../assets/color/Colors';

export const SearchStyles = (theme: 'light' | 'dark') => {
  const color = Colors[theme];
  const screenWidth = Dimensions.get('window').width;
  const bigImageHeight = (screenWidth / 3) * 2;
  const smallImageWidth = screenWidth / 3;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.background,
    },
    bigImage: {
      width: smallImageWidth - 1,
      height: bigImageHeight,
      resizeMode: 'cover',
    },
    smallImages: {
      width: smallImageWidth * 2,
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      flexDirection: 'row',
      gap: 2,
    },
    smallImage: {
      width: smallImageWidth - 1.5,
      height: smallImageWidth - 1,
      resizeMode: 'cover',
    },
    iconSearch: {
      height: 15,
      width: 15,
      tintColor: color.text,
      position: 'absolute',
      left: 10,
      resizeMode: 'contain',
    },
    search: {
      flex: 1,
      paddingRight: 10,
      paddingLeft: 40,
      paddingVertical: 5,
      backgroundColor: color.search,
      color: color.text,
      borderRadius: 10,
    },
    searchContainer: {
      marginVertical: 10,
      marginHorizontal: 20,
      alignItems: 'center',
      flexDirection: 'row',
    },
    iconDif: {
      position: 'absolute',
      top: 10,
      right: 10,
      tintColor: color.background,
      width: 15,
      height: 15,
      resizeMode: 'contain',
    },
    textHuy: {
      color: color.text,
      marginLeft: 15,
    },
    rowSpace: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
    },
    textGD: {
      fontSize: 20,
      fontWeight: 'bold',
      color: color.text,
    },
    textAll: {
      fontSize: 14,
      color: color.primary,
    },
    icon: {
      width: 14,
      resizeMode: 'contain',
      tintColor: color.text,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
  });
};
