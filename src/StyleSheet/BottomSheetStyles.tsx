import { useMemo } from 'react';
import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';
import { useTheme } from '../util/ThemeContext';
import { Colors } from '../../assets/color/Colors';

type FontWeight = TextStyle['fontWeight'];

export const useBottomSheetStyles = () => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const { spacing, typography } = Colors;

  return useMemo(
    () =>
      StyleSheet.create({
        // overall container padding (Modalize will handle scrolling)
        sectionContainer: {
          paddingHorizontal: spacing.m,
          paddingBottom: spacing.m,
          backgroundColor: palette.background,
        } as ViewStyle,

        // horizontal row container (no shared background)
        horizontalContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: spacing.m,
        } as ViewStyle,

        // each button in horizontal row with its own background and spacing
        horizontalButton: {
          flex: 1,
          backgroundColor: palette.lightGray,
          height: 110,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing.s,
          // marginHorizontal: spacing.xs,
          borderRadius: 8,
        } as ViewStyle,

        topIcon: {
          width: 30,
          height: 30,
          marginBottom: spacing.s,
        } as ImageStyle,

        topLabel: {
          fontSize: typography.fontSizes.l,
          fontWeight: typography.fontWeights.regular as FontWeight,
          textAlign: 'center',
        } as TextStyle,

        // vertical list section wrapper
        verticalSectionContainer: {
          backgroundColor: palette.lightGray,
          borderRadius: 8,
          marginBottom: spacing.m,
          overflow: 'hidden',
        } as ViewStyle,

        listItem: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: spacing.s,
          paddingHorizontal: spacing.m,
          marginHorizontal: spacing.xs,
        } as ViewStyle,

        listIcon: {
          width: 24,
          height: 24,
          marginRight: spacing.m,
        } as ImageStyle,

        listLabel: {
          fontSize: typography.fontSizes.l,
          fontWeight: typography.fontWeights.regular as FontWeight,
        } as TextStyle,

        listSeparator: {
          height: 1,
          backgroundColor: palette.background,
          marginHorizontal: spacing.m,
        } as ViewStyle,
        intentionContainer: { 
          paddingBottom: spacing.m,
          backgroundColor: palette.background,
        } as ViewStyle,
        intentionTitle: { 
          fontSize: typography.fontSizes.xl, 
          fontWeight: typography.fontWeights.medium as FontWeight, 
          textAlign: 'center',
          color: palette.text,
          marginBottom: spacing.xl - 10,
        },
        intentionBorder: { 
          height:1, 
          width:'100%', 
          marginBottom: spacing.m,
          backgroundColor: palette.lightDark,
        },
        innerContainer: {
          paddingHorizontal: spacing.m,
          paddingBottom: spacing.m,
          backgroundColor: palette.background,
        } as ViewStyle,
        intentionSubtitle: { 
          fontSize: typography.fontSizes.xl, 
          fontWeight: typography.fontWeights.bold as FontWeight, 
          textAlign:'center', 
          marginBottom: spacing.s,
          color: palette.text,
        },
        intentionContent: { 
          fontSize: typography.fontSizes.m, 
          fontWeight: typography.fontWeights.regular as FontWeight, 
          textAlign:'center', 
          marginBottom: spacing.m,
          color: palette.lessBlack,
        },
        intentionChoiceText: { 
          fontSize: typography.fontSizes.l, 
          fontWeight: typography.fontWeights.regular as FontWeight, 
          textAlign:'left'
        },
        intentionChoiceSpacing: {
          height: spacing.xl-15,
        } as ViewStyle,   
      }),
    [palette, spacing, typography]
  );
};