import {StyleSheet} from 'react-native';
import {Colors as theme} from '../../assets/color/Colors';

export const createStyles = (themeColors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
      position: 'relative',
    },
    content: {
      height: '100%',
    },
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
    privacyContainer: {
      padding: 15,
    },
    privacyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    privacyTitle: {
      fontSize: 16,
      fontWeight: '500',
    },
    privacyDescription: {
      color: '#8e8e8e',
      fontSize: 14,
      lineHeight: 20,
    },
    learnMore: {
      color: '#0095f6',
      fontWeight: '600',
    },
    head: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderBottomColor: theme.lightGray,
      borderBottomWidth: 1
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 30,
      height: 30,
    },
    headTitle: {
      alignItems: 'center',
      fontSize: 18,
      fontWeight: '500',
    },
  });
