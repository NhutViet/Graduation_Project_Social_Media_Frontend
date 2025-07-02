import {useRef} from 'react';
import {Animated} from 'react-native';
import {View, Text, Dimensions} from 'react-native';
import {MediaSection} from '../component/MediaSection';
export const useStoryNavigation = ({
  currentIndex,
  setCurrentIndex,
  storyGroups,
  storyGroupIndex,
  navigation,
  user,
  stories,
}: any) => {
  const currentIndexRef = useRef(currentIndex);
  const isNavigatingRef = useRef(false);

  const goToNextStory = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    const maxIndex = stories.length - 1;

    if (currentIndexRef.current < maxIndex) {
      setCurrentIndex(prev => prev + 1);

      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 300);
    } else {
      let nextGroupIndex = storyGroupIndex + 1;

      while (nextGroupIndex < storyGroups.length) {
        const nextGroup = storyGroups[nextGroupIndex];
        if (nextGroup?.stories?.length > 0) {
          const isOwner =
            nextGroup.creator?._id === user?._id ||
            nextGroup.creator?.handleName === user?.handleName ||
            nextGroup.creator?.username === user?.handleName;

          navigation.replace(isOwner ? 'SeenStoryOwner' : 'SeenStory', {
            storyGroups,
            storyGroupIndex: nextGroupIndex,
            creator: nextGroup.creator,
            stories: nextGroup.stories,
            initialIndex: 0,
            timestamp: Date.now(),
          });
          return;
        }
        nextGroupIndex++;
      }

      navigation.goBack();
    }
  };

  const goToPreviousStory = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  return {
    goToNextStory,
    goToPreviousStory,
    currentIndexRef,
    isNavigatingRef,
  };
};

export const useStoryProgress = ({
  stories,
  currentIndex,
  getItemDuration,
  goToNextStory,
}: any) => {
  const progressValues = useRef<number[]>(stories.map(() => 0)).current;
  const progressAnims = useRef<Animated.Value[]>(
    stories.map(() => new Animated.Value(0)),
  ).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const startProgressAnimation = (forceRestart = false) => {
    if (animationRef.current) animationRef.current.stop();
    const anim = progressAnims[currentIndex];
    if (!anim) return;

    if (forceRestart || progressValues[currentIndex] >= 1) {
      anim.setValue(0);
      progressValues[currentIndex] = 0;
    }

    const remainingDuration =
      (1 - progressValues[currentIndex]) * getItemDuration();

    animationRef.current = Animated.timing(anim, {
      toValue: 1,
      duration: remainingDuration,
      useNativeDriver: false,
    });

    const listenerId = anim.addListener(({value}) => {
      progressValues[currentIndex] = value;
    });

    animationRef.current.start(({finished}) => {
      anim.removeListener(listenerId);
      if (finished) {
        progressValues[currentIndex] = 1;
        goToNextStory();
      }
    });
  };

  return {
    progressAnims,
    progressValues,
    animationRef,
    startProgressAnimation,
  };
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const MediaContainer = ({
  selectedItem,
  mediaSize,
  setMediaSize,
  onVideoLoad,
  onVideoEnd,
  onMusicLoad,
  onMusicEnd,
  paused,
  muted,
  isVideoLoaded,
}: any) => {
  const getCaptionPosition = ({xPercent, yPercent}: any) => {
    const width = mediaSize.width || screenWidth;
    const height = mediaSize.height || screenHeight;
    return {
      left: (xPercent / 100) * width,
      top: (yPercent / 100) * height,
    };
  };

  const renderCaption = () => {
    const content = selectedItem?.content;
    if (!content?.text) return null;
    const position = getCaptionPosition(content.x || 50, content.y || 50);
    return (
      <Text
        style={{
          position: 'absolute',
          color: '#fff',
          fontSize: 18,
          fontWeight: '600',
          ...position,
        }}>
        {content.text}
      </Text>
    );
  };

  const renderTags = () => {
    const tags = selectedItem?.tags || [];
    return tags.map(({tag, index}) => {
      const {user, position} = tag;
      if (!user) return null;

      const {x, y} = position;
      const tagPosition = getCaptionPosition(x * 100, y * 100);

      return (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: tagPosition.left,
            top: tagPosition.top,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 12,
            zIndex: 10,
          }}>
          <Text style={{color: '#fff', fontSize: 14, fontWeight: '500'}}>
            @{user.handleName}
          </Text>
        </View>
      );
    });
  };

  const renderMusicInfo = () => {
    const music = selectedItem?.music;
    if (!music?.title && !music?.artist) return null;
    return (
      <View style={{position: 'absolute', bottom: 40, left: 20}}>
        <Text style={{color: '#fff', fontSize: 16}}>{music.title}</Text>
        <Text style={{color: '#ccc', fontSize: 14}}>{music.artist}</Text>
      </View>
    );
  };

  return (
    <>
      <MediaSection
        selectedItem={selectedItem}
        onLoad={onVideoLoad}
        onEnd={onVideoEnd}
        onMediaLayout={setMediaSize}
        onMusicLoad={onMusicLoad}
        onMusicEnd={onMusicEnd}
        paused={paused}
        muted={muted}
        isVideoLoaded={isVideoLoaded}
      />
      {renderCaption()}
      {renderTags()}
      {renderMusicInfo()}
    </>
  );
};
