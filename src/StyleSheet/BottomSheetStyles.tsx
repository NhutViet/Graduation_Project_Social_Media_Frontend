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

        horizontalContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: spacing.m,
        } as ViewStyle,

        // each button in horizontal row with its own background and spacing
        horizontalButton: {
          flex: 1,
          backgroundColor: palette.lessBlack,
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
          backgroundColor: palette.lessBlack,
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
          marginHorizontal: -spacing.m,
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
        choiceRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: spacing.s,
          paddingHorizontal: spacing.m,
          borderBottomWidth: 1,
          borderBottomColor: palette.lightDark,
        } as ViewStyle,

        choiceTextContainer: {
          flex: 1,
          marginRight: spacing.m,
        } as ViewStyle,
        ns_container: {
          paddingHorizontal: spacing.m,
          paddingBottom: spacing.m,
          position: 'relative',
        } as ViewStyle,

        ns_title: {
          fontSize: typography.fontSizes.xl,
          fontWeight: typography.fontWeights.medium as FontWeight,
          textAlign: 'center',
          marginBottom: spacing.s,
        } as TextStyle,

        ns_separator: {
          height: 1,
          width: '150%',
          marginBottom: spacing.s,
          marginHorizontal: -spacing.m,
        } as ViewStyle,

        ns_choiceRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: spacing.s,
        } as ViewStyle,

        ns_choiceTextContainer: {
          flex: 1,
          marginRight: spacing.m,
          alignItems: 'flex-start',
        } as ViewStyle,

        ns_choiceLabel: {
          fontSize: typography.fontSizes.l,
          fontWeight: typography.fontWeights.regular as FontWeight,
          textAlign: 'left',
        } as TextStyle,

        ns_choiceDescription: {
          fontSize: typography.fontSizes.m,
          fontWeight: typography.fontWeights.regular as FontWeight,
          textAlign: 'left',
          marginTop: spacing.xs,
        } as TextStyle,

        ns_switch: {
          transform: [{ scale: 1.3 }],
        } as ViewStyle,

        ns_thickSeparator: {
          height: 6,
          width: '150%',
          marginVertical: spacing.m,
          marginHorizontal: -spacing.m,
        } as ViewStyle,
      }),
    [palette, spacing, typography]
  );
};