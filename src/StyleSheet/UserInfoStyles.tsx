import {StyleSheet} from 'react-native';
import {Colors} from '../../assets/color/Colors';

type ThemeType = 'light' | 'dark';

const UserInfoStyles = (theme: ThemeType) => {
  const color = Colors[theme];

  return StyleSheet.create({
    container: {
      width: '100%',
      position: 'relative',
      alignItems: 'center',
      backgroundColor: color.background,
    },
    iconBack: {
      width: 20,
      height: 20,
      position: 'absolute',
      top: 20,
      left: 20,
      zIndex: 1,
    },
    blockHeader: {
      marginTop: 50,
      alignItems: 'center',
    },
    blockImg: {
      width: 80,
      height: 80,
      borderRadius: 40,
      overflow: 'hidden',
    },
    imgUser: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    nameUser: {
      color: color.text,
      fontSize: 14,
      marginTop: 4,
      fontWeight: '600',
    },
    featureContainer: {
      width: '80%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    blockFeature: {
      marginHorizontal: 8,
      alignItems: 'center',
    },
    blockIcon: {
      width: 20,
      height: 20,
    },
    icon: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      tintColor: color.text,
    },
    text: {
      color: color.text,
      fontSize: 12,
      marginTop: 4,
    },
    row: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 5,
    },
    tab2Container: {
      padding: 20,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    infoRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    infoIcon: {
      width: 24,
      height: 24,
      marginRight: 10,
    },

    rightArrow: {
      width: 15,
      height: 15,
      tintColor: color.text,
    },
  });
};

export default UserInfoStyles;
