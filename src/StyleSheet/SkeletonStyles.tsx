import { useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from '../../assets/color/Colors';
import { useTheme } from '../../src/util/ThemeContext';
import { DarkTheme } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const useSkeletonStyles = () => {
  const { theme } = useTheme();
  const currentTheme = Colors[theme];

  const dimensions = useMemo(() => {
    const GAP = Colors.spacing.xs;
    const SMALL = (Colors.dimensions.width - GAP * 3) / 3;
    const BIG = SMALL * 2 + GAP;

    return {
      GAP,
      SMALL,
      BIG,
      SCREEN_WIDTH: screenWidth,
      SCREEN_HEIGHT: screenHeight,
      VIDEO_HEIGHT: screenWidth,
      NOTI_AVATAR: 50,
      NOTI_LINE_HEIGHT: 12,
      NOTI_LINE_SPACING: 8,
      NOTI_CONTAINER_PADDING: GAP,
      NOTI_CONTAINER_RADIUS: Colors.radius.s,
      NOTI_CONTAINER_MARGIN: GAP,
      CHAT_AVATAR: 46,
      CHAT_LINE1_HEIGHT: 16,
      CHAT_LINE2_HEIGHT: 14,
      CHAT_LINE_SPACING: 8,
      CHAT_CONTAINER_PADDING: GAP + 15,
      CHAT_CONTAINER_MARGIN: GAP,
      CHAT_ARROW_SIZE: 22,
      REELS_AVATAR: 40,
      REELS_USERNAME_WIDTH: 120,
      REELS_USERNAME_HEIGHT: 16,
      REELS_FOLLOW_BUTTON_WIDTH: 80,
      REELS_FOLLOW_BUTTON_HEIGHT: 32,
      REELS_ACTION_BUTTON: 32,
      REELS_ACTION_TEXT: 16,
      REELS_ACTION_TEXT_HEIGHT: 13,
      REELS_ACTION_SPACING: 13,
      REELS_MUSIC_ICON: 32,
      REELS_MENU_BUTTON: 20,
      REELS_BOTTOM_PADDING: 42,
      REELS_CAPTION_LINE_HEIGHT: 14,
      REELS_CAPTION_LINE_SPACING: 6,
      REELS_CAPTION_LINE1_WIDTH: screenWidth * 0.75,
      REELS_CAPTION_LINE2_WIDTH: screenWidth * 0.45,
      REELS_CAPTION_LINE3_WIDTH: screenWidth * 0.35,
      REELS_ACTIONS_RIGHT_MARGIN: 16,
      REELS_ACTIONS_BOTTOM_MARGIN: 80,
    };
  }, []);

  const sizes = useMemo(() => ({
    STORY_AVATAR: 70,
    STORY_LABEL: 14,
    STORY_PADDING: 10,
    POST_MARGIN_TOP: 10,
    BLOCK_WHITE_HEIGHT: 60,
    HEADER_AVATAR: 40,
    HEADER_TEXT1: 16,
    HEADER_TEXT2: 12,
    FOLLOW_BUTTON: { width: 80, height: 30, borderRadius: 10 },
    OPTIONS_ICON: { width: 24, height: 24 },
  }), []);

  const skeletonProps = useMemo(() => ({
    backgroundColor: currentTheme.gray,
    highlightColor: currentTheme.backgroundSecondary,
    speed: 1200,
  }), [currentTheme]);

  const invertedSkeletonProps = useMemo(() => ({
    backgroundColor: currentTheme.card,
    highlightColor: currentTheme.card,
    speed: 0,
  }), [currentTheme]);

  const styles = useMemo(() => StyleSheet.create({
    screenContainer: { 
      minHeight: dimensions.SCREEN_HEIGHT 
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    container: {
      flexDirection: 'row',
      paddingHorizontal: dimensions.GAP / 2,
      width: '100%',
    },
    smallGrid: {
      width: dimensions.BIG,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    row: {
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: dimensions.GAP / 2,
    },
    rowReverse: {
      flexDirection: 'row-reverse',
    },
    marginRight: {
      marginRight: dimensions.GAP,
    },
    marginLeft: {
      marginLeft: dimensions.GAP,
    },
    notiContainer: {
      width: dimensions.SCREEN_WIDTH - dimensions.GAP * 2,
      backgroundColor: currentTheme.card,
      borderRadius: dimensions.NOTI_CONTAINER_RADIUS,
      padding: dimensions.NOTI_CONTAINER_PADDING,
      marginHorizontal: dimensions.NOTI_CONTAINER_MARGIN,
      marginBottom: dimensions.NOTI_CONTAINER_MARGIN,
    },
    notiRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    chatContainer: {
      width: '100%',
      paddingHorizontal: dimensions.CHAT_CONTAINER_PADDING,
      marginBottom: dimensions.CHAT_CONTAINER_MARGIN,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    chatRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    reelsContainer: {
      position: 'relative',
      width: dimensions.SCREEN_WIDTH,
      backgroundColor: DarkTheme.colors.background,
    },
    reelsActionsContainer: {
      position: 'absolute',
      right: dimensions.REELS_ACTIONS_RIGHT_MARGIN,
      bottom: dimensions.REELS_ACTIONS_BOTTOM_MARGIN,
      alignItems: 'center',
      zIndex: 10,
    },
    reelsBottomSection: {
      position: 'absolute',
      bottom: dimensions.REELS_BOTTOM_PADDING,
      left: dimensions.GAP * 2,
      right: dimensions.SCREEN_WIDTH * 0.25,
      zIndex: 10,
      paddingBottom: dimensions.GAP,
    },
    reelsProfileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: dimensions.GAP+5,
      marginLeft: dimensions.GAP+6,
    },
    reelsCaptionSection: {
      marginTop: dimensions.GAP / 2,
      marginLeft: dimensions.GAP+6,
    },
  }), [dimensions, currentTheme]);

  return {
    dimensions,
    sizes,
    skeletonProps,
    invertedSkeletonProps,
    styles,
    currentTheme,
  };
};