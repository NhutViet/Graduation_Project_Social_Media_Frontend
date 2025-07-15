import React from 'react';
import {Animated, Easing, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Colors} from '../assets/color/Colors';
import {useSkeletonStyles} from '../src/StyleSheet/SkeletonStyles';

interface SearchSkeletonGridProps {
  itemCount?: number;
  columns?: number;
  itemWidth: number;
  itemHeight: number;
  spacing?: number;
}
interface HomeSkeletonProps {
  postCount?: number;
  storyCount?: number;
}
interface NotificationSkeletonProps {
  count?: number;
}
interface CommentSkeletonLoaderProps {
  itemCount?: number;
  spacing?: number;
}

export const SearchSkeletonGrid: React.FC<SearchSkeletonGridProps> = ({
  itemCount = 9,
  columns = 3,
  itemWidth,
  itemHeight,
  spacing = Colors.spacing.xs,
}) => {
  const {skeletonProps, styles} = useSkeletonStyles();
  const placeholders = Array.from({length: itemCount});

  return (
    <SkeletonPlaceholder {...skeletonProps}>
      <SkeletonPlaceholder.Item style={styles.grid}>
        {placeholders.map((_, i) => (
          <SkeletonPlaceholder.Item
            key={i}
            width={itemWidth}
            height={itemHeight}
            marginRight={i % columns === columns - 1 ? 0 : spacing}
            marginBottom={spacing}
            borderRadius={Colors.radius.xs}
          />
        ))}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export const SkeletonExploreSection: React.FC = () => {
  const {dimensions, skeletonProps} = useSkeletonStyles();
  const {GAP, SMALL, BIG} = dimensions;

  return (
    <SkeletonPlaceholder {...skeletonProps}>
      <SkeletonPlaceholder.Item>
        {[0, 1, 2].map(rowIndex => {
          const isReversed = rowIndex % 2 === 0;

          return (
            <SkeletonPlaceholder.Item
              key={rowIndex}
              flexDirection={isReversed ? 'row-reverse' : 'row'}
              width="100%"
              paddingHorizontal={GAP / 2}
              marginBottom={GAP}>
              <SkeletonPlaceholder.Item
                width={SMALL}
                height={BIG}
                marginLeft={isReversed ? GAP : 0}
                marginRight={isReversed ? 0 : GAP}
                borderRadius={Colors.radius.xs}
              />

              <SkeletonPlaceholder.Item
                width={BIG}
                flexDirection="row"
                flexWrap="wrap">
                <SkeletonPlaceholder.Item
                  width={SMALL}
                  height={SMALL}
                  marginRight={GAP}
                  marginBottom={GAP}
                  borderRadius={Colors.radius.xs}
                />
                <SkeletonPlaceholder.Item
                  width={SMALL}
                  height={SMALL}
                  marginBottom={GAP}
                  borderRadius={Colors.radius.xs}
                />

                <SkeletonPlaceholder.Item
                  width={SMALL}
                  height={SMALL}
                  marginRight={GAP}
                  borderRadius={Colors.radius.xs}
                />
                <SkeletonPlaceholder.Item
                  width={SMALL}
                  height={SMALL}
                  borderRadius={Colors.radius.xs}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          );
        })}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export const ProfileSkeleton: React.FC = () => {
  const {dimensions, skeletonProps, styles} = useSkeletonStyles();
  const {SMALL} = dimensions;

  return (
    <SkeletonPlaceholder {...skeletonProps}>
      <SkeletonPlaceholder.Item style={styles.screenContainer}>
        <SkeletonPlaceholder.Item padding={Colors.spacing.m}>
          <SkeletonPlaceholder.Item
            width="100%"
            height={20}
            borderRadius={Colors.radius.xs}
          />
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            padding={Colors.spacing.m}
            alignItems="center">
            <SkeletonPlaceholder.Item
              width={80}
              height={80}
              borderRadius={Colors.radius.round}
            />
            <SkeletonPlaceholder.Item
              flex={1}
              flexDirection="row"
              justifyContent="space-around"
              marginLeft={Colors.spacing.l}>
              <SkeletonPlaceholder.Item
                width={40}
                height={20}
                borderRadius={Colors.radius.xs}
              />
              <SkeletonPlaceholder.Item
                width={40}
                height={20}
                borderRadius={Colors.radius.xs}
              />
              <SkeletonPlaceholder.Item
                width={40}
                height={20}
                borderRadius={Colors.radius.xs}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item
            height={20}
            marginHorizontal={Colors.spacing.m}
            borderRadius={Colors.radius.xs}
            marginBottom={Colors.spacing.xs}
          />
          <SkeletonPlaceholder.Item
            height={14}
            marginHorizontal={Colors.spacing.m}
            borderRadius={Colors.radius.xs}
            marginBottom={Colors.spacing.xs}
          />
          <SkeletonPlaceholder.Item
            width="60%"
            height={14}
            marginHorizontal={Colors.spacing.m}
            borderRadius={Colors.radius.xs}
            marginBottom={Colors.spacing.m}
          />
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item
          flexDirection="row"
          paddingHorizontal={Colors.spacing.m}
          marginBottom={Colors.spacing.m}>
          <SkeletonPlaceholder.Item
            flex={1}
            height={36}
            borderRadius={Colors.radius.s}
            marginRight={Colors.spacing.xs}
          />
          <SkeletonPlaceholder.Item
            flex={1}
            height={36}
            borderRadius={Colors.radius.s}
          />
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item
          flexDirection="row"
          paddingHorizontal={Colors.spacing.l}
          marginBottom={Colors.spacing.m}>
          {Array.from({length: 5}).map((_, i) => (
            <SkeletonPlaceholder.Item
              key={i}
              width={70}
              height={70}
              borderRadius={Colors.radius.round}
              marginRight={Colors.spacing.l}
            />
          ))}
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-around"
          marginBottom={Colors.spacing.m}>
          {Array.from({length: 3}).map((_, i) => (
            <SkeletonPlaceholder.Item
              key={i}
              width={SMALL}
              height={30}
              borderRadius={Colors.radius.xs}
            />
          ))}
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item paddingHorizontal={Colors.spacing.xs}>
          <SearchSkeletonGrid
            itemCount={6}
            columns={3}
            itemWidth={SMALL}
            itemHeight={SMALL}
            spacing={Colors.spacing.xs}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export const NotificationSkeleton: React.FC<NotificationSkeletonProps> = ({
  count = 6,
}) => {
  const {dimensions, styles, currentTheme} = useSkeletonStyles();
  const {NOTI_AVATAR, NOTI_LINE_HEIGHT, NOTI_LINE_SPACING} = dimensions;

  // Animation value for the shimmer effect
  const shimmerValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerValue]);

  const shimmerTranslateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <>
      {Array.from({length: count}).map((_, i) => (
        <View key={i} style={styles.notiContainer}>
          {/* Background with skeleton color */}
          <View
            style={[
              styles.notiRow,
              {
                backgroundColor: currentTheme.gray,
                borderRadius: dimensions.NOTI_CONTAINER_RADIUS,
                padding: dimensions.NOTI_CONTAINER_PADDING,
                overflow: 'hidden',
              },
            ]}>
            {/* Shimmer overlay */}
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: currentTheme.backgroundSecondary,
                opacity: 0.3,
                transform: [{translateX: shimmerTranslateX}],
              }}
            />

            {/* Avatar hole */}
            <View
              style={{
                width: NOTI_AVATAR,
                height: NOTI_AVATAR,
                borderRadius: NOTI_AVATAR / 2,
                backgroundColor: currentTheme.card, // Same as container background
              }}
            />

            {/* Text lines holes */}
            <View
              style={{
                flex: 1,
                marginLeft: dimensions.GAP,
              }}>
              <View
                style={{
                  width: '80%',
                  height: NOTI_LINE_HEIGHT,
                  borderRadius: 4,
                  backgroundColor: currentTheme.card,
                  marginBottom: NOTI_LINE_SPACING,
                }}
              />
              <View
                style={{
                  width: '60%',
                  height: NOTI_LINE_HEIGHT,
                  borderRadius: 4,
                  backgroundColor: currentTheme.card,
                  marginBottom: NOTI_LINE_SPACING,
                }}
              />
              <View
                style={{
                  width: '40%',
                  height: NOTI_LINE_HEIGHT,
                  borderRadius: 4,
                  backgroundColor: currentTheme.card,
                }}
              />
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

export const HomeSkeleton: React.FC<HomeSkeletonProps> = ({
  postCount = 5,
  storyCount = 8,
}) => {
  const {dimensions, sizes, skeletonProps} = useSkeletonStyles();
  const {GAP, VIDEO_HEIGHT} = dimensions;
  const {
    STORY_AVATAR,
    STORY_LABEL,
    STORY_PADDING,
    POST_MARGIN_TOP,
    HEADER_AVATAR,
    HEADER_TEXT1,
    HEADER_TEXT2,
    FOLLOW_BUTTON,
    OPTIONS_ICON,
  } = sizes;

  const posts = Array.from({length: postCount});
  const stories = Array.from({length: storyCount});

  return (
    <SkeletonPlaceholder {...skeletonProps}>
      <>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          paddingHorizontal={STORY_PADDING + 14}>
          {stories.map((_, i) => (
            <SkeletonPlaceholder.Item
              key={i}
              alignItems="center"
              marginRight={GAP + 13}>
              <SkeletonPlaceholder.Item
                width={STORY_AVATAR}
                height={STORY_AVATAR}
                borderRadius={STORY_AVATAR / 2}
              />
              <SkeletonPlaceholder.Item
                width={STORY_AVATAR * 0.6}
                height={STORY_LABEL + 5}
                marginTop={6}
                borderRadius={STORY_LABEL / 2}
              />
            </SkeletonPlaceholder.Item>
          ))}
        </SkeletonPlaceholder.Item>

        {posts.map((_, i) => (
          <View key={i} style={{marginTop: POST_MARGIN_TOP}}>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              padding={STORY_PADDING}>
              <SkeletonPlaceholder.Item
                width={HEADER_AVATAR}
                height={HEADER_AVATAR}
                borderRadius={HEADER_AVATAR / 2}
              />

              <SkeletonPlaceholder.Item flex={1} marginLeft={GAP}>
                <SkeletonPlaceholder.Item
                  width="60%"
                  height={HEADER_TEXT1}
                  borderRadius={HEADER_TEXT1 / 2}
                />
                <SkeletonPlaceholder.Item
                  marginTop={4}
                  width="40%"
                  height={HEADER_TEXT2}
                  borderRadius={HEADER_TEXT2 / 2}
                />
              </SkeletonPlaceholder.Item>

              <SkeletonPlaceholder.Item
                width={FOLLOW_BUTTON.width + 15}
                height={FOLLOW_BUTTON.height}
                borderRadius={FOLLOW_BUTTON.borderRadius}
                marginRight={GAP}
              />

              <SkeletonPlaceholder.Item
                width={OPTIONS_ICON.width}
                height={OPTIONS_ICON.height}
                borderRadius={OPTIONS_ICON.width / 2}
              />
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item
              width="100%"
              height={VIDEO_HEIGHT + 190}
            />

            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              paddingHorizontal={STORY_PADDING}
              paddingVertical={8}>
              {Array.from({length: 3}).map((_, j) => (
                <SkeletonPlaceholder.Item
                  key={j}
                  flexDirection="row"
                  alignItems="center"
                  marginRight={GAP * 2}>
                  <SkeletonPlaceholder.Item
                    width={24}
                    height={24}
                    borderRadius={12}
                  />
                  <SkeletonPlaceholder.Item
                    width={12}
                    height={12}
                    borderRadius={6}
                    marginLeft={4}
                  />
                </SkeletonPlaceholder.Item>
              ))}

              <SkeletonPlaceholder.Item flex={1} />

              <SkeletonPlaceholder.Item
                width={24}
                height={24}
                borderRadius={12}
              />
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item
              marginHorizontal={STORY_PADDING}
              marginTop={4}>
              <SkeletonPlaceholder.Item
                width="90%"
                height={12}
                borderRadius={6}
              />
              <SkeletonPlaceholder.Item
                marginTop={6}
                width="60%"
                height={12}
                borderRadius={6}
              />
            </SkeletonPlaceholder.Item>
          </View>
        ))}
      </>
    </SkeletonPlaceholder>
  );
};

export const CommentSkeleton: React.FC<CommentSkeletonLoaderProps> = ({
  itemCount = 5,
  spacing = 30,
}) => {
  const {skeletonProps, sizes, dimensions} = useSkeletonStyles();
  const gap = spacing;

  return (
    <SkeletonPlaceholder {...skeletonProps}>
      <SkeletonPlaceholder.Item>
        {Array.from({length: itemCount}).map((_, i) => (
          <SkeletonPlaceholder.Item
            key={i}
            flexDirection="row"
            alignItems="flex-start"
            justifyContent="space-between"
            paddingHorizontal={gap}
            marginBottom={i < itemCount - 1 ? gap : 0}>
            <SkeletonPlaceholder.Item flexDirection="row" flex={1}>
              <SkeletonPlaceholder.Item
                width={sizes.HEADER_AVATAR}
                height={sizes.HEADER_AVATAR}
                borderRadius={sizes.HEADER_AVATAR / 2}
              />
              <SkeletonPlaceholder.Item flex={1} marginLeft={gap / 2}>
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center"
                  marginBottom={4}>
                  <SkeletonPlaceholder.Item
                    width={100}
                    height={sizes.HEADER_TEXT1}
                    borderRadius={4}
                    marginRight={8}
                  />
                  <SkeletonPlaceholder.Item
                    width={60}
                    height={sizes.HEADER_TEXT2}
                    borderRadius={4}
                  />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  width="100%"
                  height={sizes.STORY_LABEL}
                  borderRadius={4}
                  marginBottom={4}
                />
                <SkeletonPlaceholder.Item
                  width="50%"
                  height={sizes.STORY_LABEL}
                  borderRadius={4}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item
              width={sizes.OPTIONS_ICON.width}
              height={sizes.OPTIONS_ICON.height}
              borderRadius={sizes.OPTIONS_ICON.width / 2}
              marginLeft={gap}
            />
          </SkeletonPlaceholder.Item>
        ))}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

interface ChatRoomsSkeletonProps {
  count?: number;
}
export const ChatSkeleton: React.FC<ChatRoomsSkeletonProps> = ({count = 8}) => {
  const {dimensions, skeletonProps, styles} = useSkeletonStyles();
  const {
    CHAT_AVATAR,
    CHAT_LINE1_HEIGHT,
    CHAT_LINE2_HEIGHT,
    CHAT_LINE_SPACING,
    CHAT_ARROW_SIZE,
    GAP,
  } = dimensions;
  const SPACING = 20; // 20px khoảng cách

  return (
    <View>
      {Array.from({length: count}).map((_, i) => (
        <View
          key={i}
          style={[
            styles.chatContainer,
            {marginBottom: i === count - 1 ? 0 : SPACING}, // chỉ add spacing giữa các item
          ]}>
          {/* avatar placeholder */}
          <SkeletonPlaceholder {...skeletonProps}>
            <SkeletonPlaceholder.Item
              width={CHAT_AVATAR}
              height={CHAT_AVATAR}
              borderRadius={CHAT_AVATAR / 2}
            />
          </SkeletonPlaceholder>

          {/* text block */}
          <View
            style={{
              flex: 1,
              marginLeft: GAP,
              justifyContent: 'center',
            }}>
            <SkeletonPlaceholder {...skeletonProps}>
              <SkeletonPlaceholder.Item
                width="40%"
                height={CHAT_LINE1_HEIGHT}
                borderRadius={4}
                marginBottom={CHAT_LINE_SPACING}
              />
            </SkeletonPlaceholder>
            <SkeletonPlaceholder {...skeletonProps}>
              <SkeletonPlaceholder.Item
                width="60%"
                height={CHAT_LINE2_HEIGHT}
                borderRadius={4}
              />
            </SkeletonPlaceholder>
          </View>

          {/* arrow placeholder */}
          <SkeletonPlaceholder {...skeletonProps}>
            <SkeletonPlaceholder.Item
              width={CHAT_ARROW_SIZE}
              height={CHAT_ARROW_SIZE}
              borderRadius={4}
            />
          </SkeletonPlaceholder>
        </View>
      ))}
    </View>
  );
};

interface ReelsSkeletonProps {
  containerHeight: number;
}

export const ReelsSkeleton: React.FC<ReelsSkeletonProps> = ({
  containerHeight,
}) => {
  const {skeletonProps, styles, dimensions, currentTheme} = useSkeletonStyles();

  return (
    <View style={[styles.reelsContainer, {height: containerHeight}]}>
      <>
        <SkeletonPlaceholder
          {...skeletonProps}
          backgroundColor={Colors.dark.gray}>
          <>
            {/* Right side action buttons */}
            <View style={styles.reelsActionsContainer}>
              {/* Heart icon */}
              <SkeletonPlaceholder.Item
                width={dimensions.REELS_ACTION_BUTTON}
                height={dimensions.REELS_ACTION_BUTTON}
                borderRadius={dimensions.REELS_ACTION_BUTTON / 2}
                marginBottom={dimensions.REELS_ACTION_SPACING}
              />
              <SkeletonPlaceholder.Item
                width={dimensions.REELS_ACTION_TEXT}
                height={dimensions.REELS_ACTION_TEXT_HEIGHT}
                borderRadius={Colors.radius.xs}
                marginBottom={dimensions.REELS_ACTION_SPACING}
              />

              {/* Comment icon */}
              <SkeletonPlaceholder.Item
                width={dimensions.REELS_ACTION_BUTTON}
                height={dimensions.REELS_ACTION_BUTTON}
                borderRadius={dimensions.REELS_ACTION_BUTTON / 2}
                marginBottom={dimensions.REELS_ACTION_SPACING}
              />
              <SkeletonPlaceholder.Item
                width={dimensions.REELS_ACTION_TEXT}
                height={dimensions.REELS_ACTION_TEXT_HEIGHT}
                borderRadius={Colors.radius.xs}
                marginBottom={dimensions.REELS_ACTION_SPACING}
              />

              {/* Share icon */}
              <SkeletonPlaceholder.Item
                width={dimensions.REELS_ACTION_BUTTON}
                height={dimensions.REELS_ACTION_BUTTON}
                borderRadius={dimensions.REELS_ACTION_BUTTON / 2}
                marginBottom={dimensions.REELS_ACTION_SPACING}
              />
              <SkeletonPlaceholder.Item
                width={dimensions.REELS_ACTION_TEXT}
                height={dimensions.REELS_ACTION_TEXT_HEIGHT}
                borderRadius={Colors.radius.xs}
                marginBottom={dimensions.REELS_ACTION_SPACING}
              />

              {/* Music note icon (4th icon) */}
              <SkeletonPlaceholder.Item
                width={dimensions.REELS_MUSIC_ICON}
                height={dimensions.REELS_MUSIC_ICON}
                borderRadius={Colors.radius.xs}
                marginBottom={dimensions.REELS_ACTION_SPACING}
              />

              {/* Three dots menu */}
              <SkeletonPlaceholder.Item
                width={dimensions.REELS_MENU_BUTTON}
                height={dimensions.REELS_MENU_BUTTON}
                borderRadius={Colors.radius.xs}
              />
            </View>

            {/* Bottom profile section */}
            <View style={styles.reelsBottomSection}>
              <View style={styles.reelsProfileRow}>
                {/* Avatar */}
                <SkeletonPlaceholder.Item
                  width={dimensions.REELS_AVATAR}
                  height={dimensions.REELS_AVATAR}
                  borderRadius={dimensions.REELS_AVATAR / 2}
                  marginRight={dimensions.GAP}
                />

                {/* Username */}
                <SkeletonPlaceholder.Item
                  width={dimensions.REELS_USERNAME_WIDTH}
                  height={dimensions.REELS_USERNAME_HEIGHT}
                  borderRadius={Colors.radius.xs}
                  marginRight={dimensions.GAP}
                />

                {/* Follow button */}
                <SkeletonPlaceholder.Item
                  width={dimensions.REELS_FOLLOW_BUTTON_WIDTH}
                  height={dimensions.REELS_FOLLOW_BUTTON_HEIGHT}
                  borderRadius={Colors.radius.s}
                />
              </View>

              {/* Caption lines - 3 rows total */}
              <View style={styles.reelsCaptionSection}>
                {/* First caption line */}
                <SkeletonPlaceholder.Item
                  width={dimensions.REELS_CAPTION_LINE1_WIDTH}
                  height={dimensions.REELS_CAPTION_LINE_HEIGHT}
                  borderRadius={Colors.radius.xs}
                  marginBottom={dimensions.REELS_CAPTION_LINE_SPACING}
                />
                {/* Second caption line */}
                <SkeletonPlaceholder.Item
                  width={dimensions.REELS_CAPTION_LINE2_WIDTH}
                  height={dimensions.REELS_CAPTION_LINE_HEIGHT}
                  borderRadius={Colors.radius.xs}
                  marginBottom={dimensions.REELS_CAPTION_LINE_SPACING}
                />
                {/* Third caption line */}
                <SkeletonPlaceholder.Item
                  width={dimensions.REELS_CAPTION_LINE3_WIDTH}
                  height={dimensions.REELS_CAPTION_LINE_HEIGHT}
                  borderRadius={Colors.radius.xs}
                />
              </View>
            </View>
          </>
        </SkeletonPlaceholder>
      </>
    </View>
  );
};

interface ReelsSkeletonListProps {
  containerHeight: number;
  itemCount?: number;
}

export const ReelsSkeletonList: React.FC<ReelsSkeletonListProps> = ({
  containerHeight,
  itemCount = 3,
}) => {
  const placeholders = Array.from({length: itemCount});

  return (
    <View style={{flex: 1}}>
      {placeholders.map((_, index) => (
        <ReelsSkeleton key={index} containerHeight={containerHeight} />
      ))}
    </View>
  );
};
