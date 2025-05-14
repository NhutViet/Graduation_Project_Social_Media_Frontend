import {StyleSheet} from 'react-native';
import {Colors} from '../../assets/color/Colors';

type ThemeType = 'light' | 'dark';

const MessageStyles = (theme: ThemeType) => {
  const color = Colors[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: color.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      justifyContent: 'space-between',
      backgroundColor: color.background,
    },
    rowContainer: {
      width: '25%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    blockIcon: {
      width: 20,
      height: 20,
      marginHorizontal: 10,
    },
    blockIcon1: {
      width: 20,
      height: 20,
    },
    icon: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      tintColor: color.text,
    },
    blockImg: {
      width: 50,
      height: 50,
      borderRadius: 25,
      overflow: 'hidden',
      marginRight: 10,
    },
    img: {
      width: '100%',
      height: '100%',
    },
    input: {
      width: '60%',
      color: color.text,
    },
    containerMessage: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 2,
    },
    blockAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      overflow: 'hidden',
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    row: {
      // width: '80%',
    },
    message: {
      position: 'relative',
      padding: 10,
      borderRadius: 10,
    },
    name: {
      fontSize: 16,
      marginBottom: 5,
      color: color.text,
    },
    inputContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 30,
      paddingHorizontal: 10,
      paddingVertical: 2,
      marginVertical: 10,
      backgroundColor: color.gray,
    },
    blockCamera: {
      backgroundColor: color.blue,
      padding: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
    },
    reactionContainer: {
      position: 'absolute',
      width: 25,
      height: 25,
      bottom: -15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.light.background,
      borderRadius: 15,
      padding: 2,
      borderWidth: 1,
      borderColor: Colors.light.gray,
    },
  });
};

export default MessageStyles;
