import {StyleSheet} from 'react-native';
import {Colors} from '../../assets/color/Colors';
import {Palette} from 'lucide-react-native';

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
    rowContainer2: {
      width: '40%',
      flexDirection: 'row',
      alignItems: 'center',
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
      width: 40,
      height: 40,
      borderRadius: 25,
      overflow: 'hidden',
      marginRight: 10,
    },
    imgContainer: {
      position: 'relative',
      width: 46,
      height: 46,
      borderRadius: 23,
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconW: {
      width: '75%',
      height: '75%',
      resizeMode: 'contain',
      borderRadius: 25,
      top: 0,
      left: 0,
      position: 'absolute',
    },
    iconF: {
      width: '85%',
      height: '85%',
      resizeMode: 'contain',
      borderRadius: 25,
      zIndex: 1,
      bottom: 0,
      right: 0,
      borderWidth: 2,
      position: 'absolute',
    },
    img: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
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
      width: 40,
      height: 40,
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
      position: 'relative',
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
    menu: {
      position: 'absolute',
      bottom: '100%',
      right: 0,
      backgroundColor: color.background,
      borderRadius: 8,
      elevation: 10,
      zIndex: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      paddingVertical: 4,
      paddingHorizontal: 8,
      minWidth: 120,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    menuIcon: {
      width: 20,
      height: 20,
      marginRight: 10,
      tintColor: color.text,
    },
    menuText: {
      fontSize: 16,
      color: color.text,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1,
    },
    ongoingButton: {
      marginHorizontal: 16,
      marginTop: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: color.primary,
      alignItems: 'center',
    },
    ongoingText: {
      fontSize: 16,
      fontWeight: '600',
      color: color.text,
    },
  });
};

export default MessageStyles;
