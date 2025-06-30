import {StyleSheet, TextStyle} from 'react-native';
import {Colors} from '../../assets/color/Colors';
type FontWeight = TextStyle['fontWeight'];
type ThemeType = 'light' | 'dark';

const MessageBoxStyles = (theme: ThemeType) => {
  const color = Colors[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.background,
    },
    headerContainer: {
      flexDirection: 'row',
      width: '100%',
      paddingVertical: Colors.spacing.m,
      paddingHorizontal: Colors.spacing.xs,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerBlock: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBlock: {
      width: 20,
      height: 20,
      marginHorizontal: Colors.spacing.xs,
    },
    icon: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      tintColor: color.text,
    },
    name: {
      fontSize: Colors.typography.fontSizes.l,
      fontWeight: Colors.typography.fontWeights.semiBold as FontWeight,
      color: color.text,
      marginLeft: 6,
    },
    searchContainer: {
      width: '100%',
      paddingHorizontal: Colors.spacing.m,
    },
    searchBlock: {
      backgroundColor: color.backgroundSecondary,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: Colors.radius.m,
      paddingHorizontal: Colors.spacing.xs,
      position: 'relative',
    },
    searchInput: {
      flex: 1,
      marginHorizontal: Colors.spacing.m,
      color: color.text,
      height: 40,
      fontSize: Colors.typography.fontSizes.m,
    },
    clearButton: {
      position: 'absolute',
      right: Colors.spacing.m,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    clearIcon: {
      width: 14,
      height: 14,
      tintColor: color.text,
    },
    // Search Results Styles
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: color.text,
      marginTop: Colors.spacing.m,
      fontSize: Colors.typography.fontSizes.l,
    },
    resultsHeader: {
      paddingHorizontal: Colors.spacing.m + Colors.spacing.xs,
      paddingVertical: Colors.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: color.border,
    },
    resultsHeaderText: {
      color: color.text,
      fontWeight: Colors.typography.fontWeights.semiBold as FontWeight,
      fontSize: Colors.typography.fontSizes.l,
    },
    noResultsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noResultsText: {
      color: color.text,
      fontSize: Colors.typography.fontSizes.l,
      textAlign: 'center',
    },
    searchResultItem: {
      flexDirection: 'row',
      paddingHorizontal: Colors.spacing.m + Colors.spacing.xs,
      paddingVertical: Colors.spacing.s + Colors.spacing.xs,
      alignItems: 'flex-start',
    },
    searchResultAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: Colors.spacing.s + Colors.spacing.xs,
    },
    searchResultContent: {
      flex: 1,
    },
    searchResultName: {
      color: color.text,
      fontWeight: Colors.typography.fontWeights.semiBold as FontWeight,
      fontSize: Colors.typography.fontSizes.l,
      marginBottom: Colors.spacing.xs,
    },
    searchResultMessageContainer: {
      marginBottom: Colors.spacing.xs,
    },
    searchResultTimestamp: {
      color: color.textSecondary,
      fontSize: Colors.typography.fontSizes.m,
    },
    // Stories Section Styles
    storiesContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    storiesContentContainer: {
      paddingRight: Colors.spacing.m,
    },
    // Messages Section Styles
    messagesHeader: {
      flexDirection: 'row',
      paddingHorizontal: Colors.spacing.m,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Colors.spacing.m,
    },
    messagesHeaderTitle: {
      color: color.text,
      fontWeight: Colors.typography.fontWeights.semiBold as FontWeight,
      fontSize: Colors.typography.fontSizes.l,
    },
    messagesHeaderSubtitle: {
      color: color.text,
      fontSize: Colors.typography.fontSizes.m,
    },
    messagesListContainer: {
      flex: 1,
    },
  });
};

export default MessageBoxStyles;
