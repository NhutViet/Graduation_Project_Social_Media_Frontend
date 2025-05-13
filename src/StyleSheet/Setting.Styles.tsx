import {StyleSheet} from 'react-native';
import {Colors as theme} from '../../assets/color/Colors';

export const createStyles = (themeColors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    content: {flex: 1},
    section: {
      marginBottom: theme.spacing.l,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSizes.m,
      fontWeight: '600',
      color: themeColors.textSecondary,
      marginHorizontal: theme.spacing.m,
      marginVertical: theme.spacing.s,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.m,
      paddingHorizontal: theme.spacing.m,
      backgroundColor: themeColors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: themeColors.border,
    },
    settingIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: themeColors.lightGray,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.m,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: theme.typography.fontSizes.m,
      fontWeight: '500',
      color: themeColors.text,
    },
    settingDescription: {
      fontSize: theme.typography.fontSizes.s,
      color: themeColors.textSecondary,
      marginTop: 2,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.m,
      marginHorizontal: theme.spacing.m,
      marginVertical: theme.spacing.l,
      borderRadius: theme.radius.m,
      backgroundColor: themeColors.lightGray,
    },
    logoutIcon: {
      marginRight: theme.spacing.s,
    },
    logoutText: {
      fontSize: theme.typography.fontSizes.m,
      fontWeight: '600',
      color: themeColors.error,
    },
  });
