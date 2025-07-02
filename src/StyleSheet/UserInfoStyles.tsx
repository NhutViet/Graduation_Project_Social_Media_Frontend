import {StyleSheet, TextStyle} from 'react-native';
import {Colors} from '../../assets/color/Colors';
type FontWeight = TextStyle['fontWeight'];

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
    NNContainer: {
      width: '100%',
      height: '100%',
      position: 'relative',
      alignItems: 'center',
      backgroundColor: color.background,
    },
    iconBack: {
      width: 18,
      height: 18,
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
      resizeMode: 'cover',
    },
    nameUser: {
      color: color.text,
      fontSize: 14,
      marginTop: 4,
      fontWeight: '600' as FontWeight,
    },
    featureContainer: {
      width: '80%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    blockFeature: {
      marginHorizontal: 6,
      alignItems: 'center',
    },
    blockIcon: {
      width: 18,
      height: 18,
    },
    icon: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      tintColor: color.text,
    },
    text: {
      width: 50,
      textAlign: 'center',
      color: color.text,
      fontSize: 12,
      marginTop: 4,
    },
    row: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    tab2Container: {
      paddingTop: 10,
      paddingHorizontal: 20,
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
      width: 20,
      height: 20,
      marginRight: 10,
    },

    rightArrow: {
      width: 15,
      height: 15,
      tintColor: color.text,
    },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Colors.spacing.s,
      backgroundColor: color.background,
    },
    backIcon: {
      width: 24,
      height: 24,
    },
    iconSmall: {
      width: '100%',
      height: '100%',
      tintColor: color.text,
      resizeMode: 'contain',
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: Colors.typography.fontSizes.xl,
      fontWeight: Colors.typography.fontWeights.semiBold as FontWeight,
      color: color.text,
    },
    placeholder: {
      width: 24,
    },
    infoContainer: {
      width: '100%',
      backgroundColor: color.lessBlack,
      padding: Colors.spacing.s,
      alignItems: 'center',
      minHeight: 80,
      marginBottom: Colors.spacing.m,
    },
    infoText: {
      color: color.text,
      marginBottom: Colors.spacing.s,
    },
    infoLink: {
      color: color.blue,
    },
    listContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: color.background,
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Colors.spacing.s,
      backgroundColor: color.background,
      width: '100%',
      justifyContent: 'space-between',
    },
    avatarSmall: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: Colors.spacing.m,
    },
    userTextContainer: {
      flex: 1,
      justifyContent: 'center',
      minHeight: 50,
      marginRight: Colors.spacing.m,
    },
    userName: {
      color: color.text,
      fontWeight: Colors.typography.fontWeights.medium as FontWeight,
      fontSize: Colors.typography.fontSizes.m,
      marginBottom: 2,
      borderColor: 'blue',
    },
    userNickname: {
      color: color.lightDark,
      fontSize: Colors.typography.fontSizes.s,
    },
    rightArrowSmall: {
      width: 16,
      height: 16,
      tintColor: color.lightDark,
      resizeMode: 'contain',
    },
    // Modal styles
    modalHandle: {
      backgroundColor: color.border,
    },
    modalContainer: {
      backgroundColor: color.modal,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: Colors.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: color.border,
    },
    modalCancel: {
      color: color.blue,
      fontWeight: Colors.typography.fontWeights.medium as FontWeight,
    },
    modalTitle: {
      color: color.text,
      fontWeight: Colors.typography.fontWeights.semiBold as FontWeight,
    },
    modalDone: {
      color: color.text,
      fontWeight: Colors.typography.fontWeights.regular as FontWeight,
    },
    modalDoneDisabled: {
      color: color.lightDark,
    },
    modalContent: {
      padding: Colors.spacing.m,
      alignItems: 'center',
    },
    avatarLarge: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: Colors.spacing.m,
    },
    inputWrapper: {
      width: '100%',
      position: 'relative',
      marginBottom: Colors.spacing.s,
    },
    floatingLabel: {
      position: 'absolute',
      top: Colors.spacing.xs,
      left: Colors.spacing.s,
      fontSize: Colors.typography.fontSizes.s,
      color: color.textSecondary,
    },
    charCount: {
      position: 'absolute',
      top: Colors.spacing.xs,
      right: Colors.spacing.s,
      fontSize: Colors.typography.fontSizes.s,
      color: color.textSecondary,
    },
    textInput: {
      width: '100%',
      borderWidth: 1,
      borderColor: color.border,
      borderRadius: Colors.radius.m,
      padding: Colors.spacing.m,
      paddingTop: Colors.spacing.l,
      color: color.text,
      backgroundColor: color.background,
    },
    clearInput: {
      position: 'absolute',
      right: Colors.spacing.s,
      top: '50%',
      transform: [{translateY: -12}],
    },
    clearIcon: {
      width: 16,
      height: 16,
      tintColor: color.textSecondary,
    },
    modalInfo: {
      color: color.textSecondary,
      fontSize: Colors.typography.fontSizes.s,
      marginTop: Colors.spacing.s,
    },
  });
};

export default UserInfoStyles;
