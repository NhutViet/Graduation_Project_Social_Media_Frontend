import { useMemo } from 'react';
import { StyleSheet, TextStyle, ViewStyle, ImageStyle, Dimensions } from 'react-native';
import { useTheme } from '../util/ThemeContext';
import { Colors } from '../../assets/color/Colors';

type FontWeight = TextStyle['fontWeight'];

export const useCameraStyles = () => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const { spacing, typography } = Colors;
  const { width } = Dimensions.get('window');
  const ITEM_WIDTH = 80;

  return useMemo(
    () =>
      StyleSheet.create({
        cameraContainer: {
            flex: 1,
            backgroundColor: palette.black,
        },
        preview: {
            flex: 1,
        },
        topBar: {
            position: 'absolute',
            top: 0,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: palette.transparent,
        },
        cameraPreviewContainer: {
            flex: 1,
            overflow: 'hidden',
            backgroundColor: palette.black,
        },
        loaderContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: palette.black,
        },
        actionBarContainer: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingVertical: 16,
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        sideButton: {
            padding: 12,
            height: 40,
            width: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: palette.background,
        },
        topIcon: {
            width: 24,
            height: 24,
            tintColor: '#fff',
        },
        captureButton: {
            width: 70,
            height: 70,
            borderRadius: 35,
            borderWidth: 4,
            borderColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
        captureButtonRecording: {
            borderColor: 'red',
        },
        captureInner: {
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: '#fff',
        },
        captureInnerRecording: {
            width: 40,
            height: 40,
            borderRadius: 4,
            backgroundColor: 'red',
        },
        cameraModeContainer: {
            width: '100%',
            paddingVertical: 8,
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        listContent: {
            paddingHorizontal: (width - ITEM_WIDTH) / 2,
        },
        itemContainer: {
            width: ITEM_WIDTH,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 6,
            marginHorizontal: 4,
            borderRadius: 20,
        },
        itemActive: {
            backgroundColor: '#fff',
        },
        itemText: {
            color: '#fff',
            fontSize: 16,
        },
        itemTextActive: {
            color: '#000',
            fontWeight: '600',
        },
      }),
    [palette, spacing, typography]
  );
};