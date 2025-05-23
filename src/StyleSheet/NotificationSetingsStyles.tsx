import { useMemo } from 'react';
import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';
import { useTheme } from '../util/ThemeContext';
import { Colors } from '../../assets/color/Colors';

type FontWeight = TextStyle['fontWeight'];

export const useNotificationSettingsStyles = () => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const { spacing, typography, dimensions } = Colors;

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: palette.background,
        } as ViewStyle,

        scrollView: {
          flex: 1,
        } as ViewStyle,

        // Header styles
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.m,
          paddingVertical: spacing.m,
          backgroundColor: palette.background,
        } as ViewStyle,

        backButton: {
          padding: spacing.xs,
        } as ViewStyle,

        backIcon: {
          width: 24,
          height: 24,
          tintColor: palette.text,
          resizeMode: 'contain',
        } as ImageStyle,

        headerTitle: {
          fontSize: typography.fontSizes.xl,
          fontWeight: typography.fontWeights.bold as FontWeight,
          color: palette.text,
          flex: 1,
          textAlign: 'center',
        } as TextStyle,

        headerSpacer: {
          width: 32, 
        } as ViewStyle,

        // Banner styles
        bannerContainer: {
          flexDirection: 'row',
          paddingHorizontal: spacing.m,
          paddingVertical: spacing.m,
          backgroundColor: palette.background,
          borderTopWidth: 1,
          borderTopColor: palette.border,
          alignItems: 'center',
        } as ViewStyle,

        bellIconContainer: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: palette.transparent,
          borderColor: palette.border,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.m,
        } as ViewStyle,

        bellIcon: {
          width: 20,
          height: 20,
          tintColor: palette.text,
        } as ImageStyle,

        bannerTextContainer: {
          flex: 1,
        } as ViewStyle,

        bannerText: {
          fontSize: typography.fontSizes.m,
          color: palette.textSecondary,
          lineHeight: 20,
          marginBottom: spacing.xs,
        } as TextStyle,

        bannerLink: {
          fontSize: typography.fontSizes.m,
          color: palette.primary,
          fontWeight: typography.fontWeights.medium as FontWeight,
        } as TextStyle,

        // Section styles
        section: {
          borderTopWidth: 1,
          borderTopColor: palette.border,
        } as ViewStyle,

        sectionTitle: {
          fontSize: typography.fontSizes.l,
          fontWeight: typography.fontWeights.bold as FontWeight,
          color: palette.text,
          paddingHorizontal: spacing.m,
          paddingVertical: spacing.m,
        } as TextStyle,

        // Option row styles
        optionRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.m,
          paddingVertical: spacing.s,
          backgroundColor: palette.background,
          minHeight: 55,
        } as ViewStyle,

        optionContent: {
          flex: 1,
          paddingRight: spacing.m,
        } as ViewStyle,

        optionTitle: {
          fontSize: typography.fontSizes.l,
          fontWeight: typography.fontWeights.regular as FontWeight,
          color: palette.text,
          lineHeight: 22,
        } as TextStyle,

        optionSubtitle: {
          fontSize: typography.fontSizes.s,
          color: palette.textSecondary,
          marginTop: spacing.xs,
          lineHeight: 18,
        } as TextStyle,

        rightIcon: {
          width: 20,
          height: 20,
          tintColor: palette.textSecondary,
          resizeMode: 'contain',
        } as ImageStyle,

        // Switch styles
        switchTrack: {
          backgroundColor: palette.lightDark,
        } as ViewStyle,

        switchTrackActive: {
          backgroundColor: palette.primary,
        } as ViewStyle,

        switchThumb: {
          backgroundColor: palette.white,
        } as ViewStyle,

        switchThumbActive: {
          backgroundColor: palette.white,
        } as ViewStyle,

        // Radio button styles
        radioOuter: {
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          alignItems: 'center',
          justifyContent: 'center',
        } as ViewStyle,

        radioInner: {
          width: 10,
          height: 10,
          borderRadius: 5,
        } as ViewStyle,

        radioSelected: {
          borderColor: palette.primary,
        } as ViewStyle,

        radioUnselected: {
          borderColor: palette.border,
        } as ViewStyle,

        // Sub text styles
        subTextContainer: {
          paddingHorizontal: spacing.m,
          paddingVertical: spacing.s,
        } as ViewStyle,

        subText: {
          fontSize: typography.fontSizes.s,
          color: palette.textSecondary,
          lineHeight: 18,
        } as TextStyle,
      }),
    [palette, spacing, typography, dimensions]
  );
};