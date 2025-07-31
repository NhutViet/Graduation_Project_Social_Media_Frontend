import {useMemo} from 'react';
import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Dimensions,
} from 'react-native';
import {useTheme} from '../util/ThemeContext';
import {Colors} from '../../assets/color/Colors';

const {width} = Dimensions.get('window');
const COLUMN_COUNT = 3;
const GRID_SPACING = 1;
const ITEM_WIDTH =
  (width - (COLUMN_COUNT - 1) * GRID_SPACING - 16 * 2) / COLUMN_COUNT;

export const useBookmarkStyles = () => {
  const {theme} = useTheme();
  const palette = Colors[theme];
  const {spacing, typography} = Colors;

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: palette.background,
          padding: spacing.m,
        } as ViewStyle,
        scrollContainer: {
          flexGrow: 1,
          paddingBottom: spacing.l,
        } as ViewStyle,
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.m,
        } as ViewStyle,
        headerTitle: {
          fontSize: typography.fontSizes.l,
          fontWeight: '600',
          color: palette.text,
        } as TextStyle,
        playlistContainer: {
          marginBottom: spacing.l,
        } as ViewStyle,
        playlistTitle: {
          marginTop: 10,
          fontSize: typography.fontSizes.m,
          fontWeight: '600',
          color: palette.text,
          marginBottom: spacing.s,
        } as TextStyle,
        gridContainer: {
          width: '100%',
          aspectRatio: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          backgroundColor: palette.card,
          borderRadius: 8,
          overflow: 'hidden',
          gap: 2,
        } as ViewStyle,
        gridImage: {
          width: '49%',
          height: '49%',
          maxWidth: '49%',
          maxHeight: '49%',
        } as ImageStyle,
        gridImagePlaceholder: {
          width: '49%',
          height: '49%',
          maxWidth: '49%',
          maxHeight: '49%',
          backgroundColor: palette.background,
        } as ViewStyle,
        playlistRow: {
          justifyContent: 'space-between',
          marginBottom: spacing.m,
        } as ViewStyle,
        columnItem: {
          width: '48%',
        } as ViewStyle,
        playlistsContainer: {
          flex: 1,
          backgroundColor: palette.background,
        } as ViewStyle,
        playlistsHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.m,
          paddingVertical: spacing.m,
        } as ViewStyle,
        tabBar: {
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: palette.border,
          marginBottom: spacing.s,
        } as ViewStyle,
        tab: {
          flex: 1,
          alignItems: 'center',
          paddingVertical: spacing.s,
        } as ViewStyle,
        tabIcon: {
          width: 24,
          height: 24,
          tintColor: palette.lessBlack,
        } as ImageStyle,
        tabIconActive: {
          tintColor: palette.text,
        } as ImageStyle,
        tabIndicator: {
          position: 'absolute',
          bottom: -1,
          height: 2,
          width: 40,
          backgroundColor: palette.text,
          alignSelf: 'center',
        } as ViewStyle,
        postsGridContainer: {
          flex: 1,
        } as ViewStyle,
        postsGridContent: {
          paddingHorizontal: spacing.s,
          paddingBottom: spacing.l,
        } as ViewStyle,
        postImage: {
          width: '100%',
          height: '100%',
        } as ImageStyle,
        videoIconContainer: {
          position: 'absolute',
          top: 5,
          right: 5,
          paddingHorizontal: 5,
          paddingVertical: 5,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: 12,
          padding: 2,
        } as ViewStyle,
        videoIcon: {
          width: 16,
          height: 16,
          tintColor: palette.lightGray,
        } as ImageStyle,
        modalizeContent: {
          flex: 1,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
        } as ViewStyle,
        fullScreenImage: {
          width: '100%',
          height: 'auto',
          aspectRatio: 1,
        } as ImageStyle,
        fullScreenVideo: {
          width: '100%',
          height: 'auto',
          aspectRatio: 16 / 9,
        } as ViewStyle,
        closeButton: {
          position: 'absolute',
          top: 40,
          right: 20,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 20,
          padding: 10,
          zIndex: 10,
        } as ViewStyle,
        closeIcon: {
          width: 20,
          height: 20,
          tintColor: 'white',
        } as ImageStyle,
        columnWrapper: {
          justifyContent: 'flex-start',
          marginBottom: GRID_SPACING,
        } as ViewStyle,
        postItem: {
          width: ITEM_WIDTH,
          height: ITEM_WIDTH,
          borderRadius: 8,
          margin: spacing.xs,
          overflow: 'hidden',
          backgroundColor: palette.backgroundSecondary,
          justifyContent: 'center',
          alignItems: 'center',
        },
        fullImage: {
          width: '100%',
          backgroundColor: Colors.border,
          aspectRatio: 1,
          borderRadius: 8,
          overflow: 'hidden',
        } as ImageStyle,

        row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          aspectRatio: 1,
          borderRadius: 8,
          backgroundColor: Colors.lightGray,
          overflow: 'hidden',
          gap: 2,
        } as ViewStyle,

        halfImage: {
          flex: 1,
        } as ImageStyle,

        grid3Container: {
          width: '100%',
          backgroundColor: Colors.lightGray,
          aspectRatio: 1,
          borderRadius: 8,
          overflow: 'hidden',
        } as ViewStyle,

        grid3Row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 2,
        } as ViewStyle,

        grid3TopImage: {
          flex: 1,
          aspectRatio: 1,
        } as ImageStyle,

        grid3BottomWrapper: {
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          paddingTop: 2,
        } as ViewStyle,

        grid3BottomImage: {
          width: '50%',
          aspectRatio: 1,
        } as ImageStyle,

        activeTab: {
          borderBottomWidth: 2, // độ dày viền
        },

        overlayCheck: {
          position: 'absolute',
          bottom: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 12,
          padding: 4,
        },
        modal: {
          backgroundColor: palette.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 30,
          paddingTop: 16,
        },
        handle: {
          backgroundColor: palette.border,
          width: 40,
        },
        box: {
          paddingHorizontal: 24,
        },
        option: {
          paddingVertical: 16,
        },
        cancel: {
          paddingVertical: 16,
        },
        optionText: {
          textAlign: 'center',
          fontSize: 16,
          color: palette.text,
        },
        cancelText: {
          textAlign: 'center',
          fontSize: 16,
          color: '#ff3b30',
        },
        bottomcontainer: {
          padding: 10,
          backgroundColor: palette.background,
          flexDirection: 'row',
          gap: 15,
        },
        bottomBtn: {
          flex: 1,
          paddingVertical: 10,
          borderColor: palette.text,
          borderWidth: 1,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        },
        textBtn: {
          fontSize: 14,
          fontWeight: '500',
          color: palette.text,
        },
        textTop: {
          fontSize: 16,
          fontWeight: '400',
          color: palette.primary,
        },
        overlay: {
          position: 'absolute',
          bottom: 6,
          right: 6,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 50,
          width: 25,
          height: 25,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: palette.white,
          borderWidth: 1,
        },
        anotherBox: {
          padding: 5,
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
          gap: 8,
        },
        anotherImage: {
          width: 40,
          height: 40,
          resizeMode: 'cover',
          borderRadius: 100,
        },
        anotherText: {
          fontSize: 14,
          fontWeight: '500',
          color: palette.text,
        },
        centerContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: palette.background,
        },
        coloText: {
          color: palette.text,
        },
        headerSlot: {
          flex: 1,
          alignItems: 'center',
        },
        headerSlotLeft: {
          alignItems: 'flex-start',
        },
        headerSlotRight: {
          alignItems: 'flex-end',
        },
      }),
    [palette, spacing, typography],
  );
};
