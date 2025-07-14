import React, {useCallback, useMemo} from 'react';
import {View, Text} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import Story from './Story';
import LoadingModal from '../../../../components/Global/LoadingModal';

interface StoryDataItem {
  id: string;
  item?: any;
  name?: string;
  image?: string;
  status?: number;
  hasStory?: boolean;
  isSeen?: boolean;
  isCurrentUser?: boolean;
  isLoadingStoryDetails?: boolean;
  isLoading?: boolean;
  isLoadMore?: boolean;
  remainingCount?: number;
}

interface StoryListHeaderProps {
  visibleStories: any[];
  processedStories: any[];
  visibleStoryCount: number;
  isLoadingMoreStories: boolean;
  color: any;
  user: any;
  storyDetails: any[];
  seenMap: Record<string, boolean>;
  onStoryPress: (item: any) => void;
  onStoryScroll: (event: any) => void;
  onStoryHover?: (item: any) => void; // ✅ Add hover handler prop
  isStoryDetailsRequested?: (userId: string) => boolean; // ✅ Add prop for checking if story details are requested
}

const StoryListHeader = React.memo<StoryListHeaderProps>(
  ({
    visibleStories,
    processedStories,
    visibleStoryCount,
    isLoadingMoreStories,
    color,
    user,
    storyDetails,
    seenMap,
    onStoryPress,
    onStoryScroll,
    onStoryHover,
    isStoryDetailsRequested,
  }) => {
    const storyData = useMemo((): StoryDataItem[] => {
      const stories: StoryDataItem[] = visibleStories.map(item => {
        const isCurrentUser =
          item._id === user?._id || item.handleName === user?.handleName;
        
        // ✅ Check if story details have been requested for this user
        const storyDetailsRequested = isStoryDetailsRequested?.(item._id) || false;
        
        const story = storyDetails.find(s => s._id === item.stories?.[0]);
        const isSeen = story
          ? story.isSeen === true || seenMap[story._id] === true
          : false;
        const hasStory = item.stories?.length > 0;

        // ✅ Show loading state if story details not yet requested
        const isLoadingStoryDetails = hasStory && !storyDetailsRequested;

        return {
          id: item._id,
          item,
          name: isCurrentUser ? 'Tin của tôi' : item.handleName,
          image: item?.profilePic,
          status: hasStory ? 1 : 0,
          hasStory,
          isSeen,
          isCurrentUser,
          isLoadingStoryDetails, // ✅ Add loading state for story details
        };
      });

      // Thêm loading indicator nếu đang load more
      if (isLoadingMoreStories && visibleStoryCount < processedStories.length) {
        stories.push({
          id: 'loading',
          isLoading: true,
        });
      }

      // Thêm load more indicator nếu còn stories
      if (
        !isLoadingMoreStories &&
        visibleStoryCount < processedStories.length &&
        visibleStories.length > 0
      ) {
        stories.push({
          id: 'load-more',
          isLoadMore: true,
          remainingCount: processedStories.length - visibleStoryCount,
        });
      }

      return stories;
    }, [
      visibleStories,
      processedStories.length,
      visibleStoryCount,
      isLoadingMoreStories,
      user?._id,
      user?.handleName,
      storyDetails,
      seenMap,
      isStoryDetailsRequested,
    ]);

    const renderStoryItem = useCallback(
      ({item}: {item: any}) => {
        if (item.isLoading) {
          return (
            <View
              style={{
                width: 70,
                height: 70,
                marginHorizontal: 8,
                borderRadius: 35,
                backgroundColor: color.background,
                borderWidth: 2,
                borderColor: color.border,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <LoadingModal />
            </View>
          );
        }

        // Render load more indicator
        if (item.isLoadMore) {
          return (
            <View
              style={{
                width: 70,
                height: 70,
                marginHorizontal: 8,
                borderRadius: 35,
                backgroundColor: color.backgroundSecondary,
                borderWidth: 2,
                borderColor: color.border,
                borderStyle: 'dashed',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  color: color.textSecondary,
                  fontSize: 10,
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                +{item.remainingCount}
              </Text>
            </View>
          );
        }

        // ✅ Render story item with loading state for story details
        return (
          <Story
            key={item.id}
            name={item.name}
            image={item.image}
            hasStory={item.hasStory}
            isSeen={item.isSeen}
            isCurrentUser={item.isCurrentUser}
            isLoadingStoryDetails={item.isLoadingStoryDetails}
            onHover={() => onStoryHover?.(item.item)}
            func={() => onStoryPress(item.item)}
          />
        );
      },
      [color, onStoryPress],
    );

    // Memoize key extractor
    const keyExtractor = useCallback(
      (item: any, index: number) => item.id + index,
      [],
    );

    // Memoize estimated item size
    const getItemType = useCallback((item: any) => {
      if (item.isLoading) {
        return 'loading';
      }
      if (item.isLoadMore) {
        return 'load-more';
      }
      return 'story';
    }, []);

    return (
      <View
        style={{
          height: 160,
          paddingTop: 48,
          backgroundColor: color.background,
        }}>
        <FlashList
          data={storyData}
          renderItem={renderStoryItem}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={100}
          contentContainerStyle={{paddingHorizontal: 10}}
          onScroll={onStoryScroll}
          scrollEventThrottle={16}
          removeClippedSubviews={true}
          disableHorizontalListHeightMeasurement={true}
          keyboardDismissMode="on-drag"
          estimatedListSize={{height: 112, width: 350}}
          drawDistance={200}
          overrideItemLayout={(layout, item) => {
            layout.size = 100;
          }}
        />
      </View>
    );
  },
);

StoryListHeader.displayName = 'StoryListHeader';

export default StoryListHeader;
