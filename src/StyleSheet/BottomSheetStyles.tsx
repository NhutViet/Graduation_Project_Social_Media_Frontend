import { useMemo } from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
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
        topRowContainer: {
          marginVertical: spacing.m,
        },
        topListContent: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.m,
        },
        topButton: {
          flex: 1,
          height: 111,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: spacing.s,
        },
        topIcon: {
          width: 30,
          height: 30,
          marginBottom: spacing.s,
        },
        topLabel: {
          fontSize: typography.fontSizes.l,
          fontWeight: typography.fontWeights.regular as FontWeight,
          textAlign: 'center',
        } as TextStyle,

        listContainer: {
          marginVertical: spacing.m,
        },
        listItem: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: spacing.s,
          paddingHorizontal: spacing.m,
          backgroundColor: palette.modal,
        },
        listIcon: {
          width: 24,
          height: 24,
          marginRight: spacing.m,
        },
        listLabel: {
          fontSize: typography.fontSizes.l,
          fontWeight: typography.fontWeights.regular as FontWeight,
        } as TextStyle,
        listSeparator: {
          height: 1,
          backgroundColor: palette.border,
          marginHorizontal: spacing.m,
        },
      }),
    [palette, spacing, typography]
  );
};