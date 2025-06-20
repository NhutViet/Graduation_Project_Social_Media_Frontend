import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Video from 'react-native-video';
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Music,
  User,
  SendIcon,
} from 'lucide-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {
  likePost,
  unlikePost,
} from '../../../../services/reactionRedux/reactionSlice';
import {ReelItemProps, styles} from '../../../StyleSheet/ViewReels';

const formatNumber = (num?: number | null): string => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};

const parseCaption = (
  caption: string | null | undefined,
  onHashtagPress: (tag: string) => void,
): React.ReactNode[] => {
  if (!caption || typeof caption !== 'string') {
    return [];
  }
  const regex = /#[\w]+/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(caption)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <Text key={key++} style={styles.captionText}>
          {caption.substring(lastIndex, match.index)}
        </Text>,
      );
    }
    const hashtag = match[0];
    parts.push(
      <Text
        key={key++}
        style={styles.hashtag}
        onPress={() => onHashtagPress(hashtag)}>
        {hashtag}
      </Text>,
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < caption.length) {
    parts.push(
      <Text key={key++} style={styles.captionText}>
        {caption.substring(lastIndex)}
      </Text>,
    );
  }
  return parts;
};

const ReelItem: React.FC<ReelItemProps> = ({
  item,
  index,
  activeIndex,
  isFocused,
  handleHashtagPress,
  openComment,
  showBottomSheet,
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {likePosts} = useSelector((state: RootState) => state.reactions);
  const {refreshToken} = useSelector((state: RootState) => state.user);

  const [isLiked, setIsLiked] = useState(likePosts.includes(item._id));
  const [numLike, setNumLike] = useState(item.likeCount);

  // Chỉ phát video khi index === activeIndex và màn hình đang được focus
  const isActive = index === activeIndex;

  const handleLike = async () => {
    if (isLiked) {
      setIsLiked(false);
      setNumLike(prev => prev - 1);
      dispatch(unlikePost({postId: item._id, refreshToken}))
        .unwrap()
        .catch(() => {
          setNumLike(item.likeCount);
          setIsLiked(likePosts.includes(item._id));
        });
    } else {
      setIsLiked(true);
      setNumLike(prev => prev + 1);
      dispatch(likePost({postId: item._id, refreshToken}))
        .unwrap()
        .catch(() => {
          setNumLike(item.likeCount);
          setIsLiked(likePosts.includes(item._id));
        });
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={{uri: item.media?.videoUrl}}
        style={styles.video}
        resizeMode="cover"
        repeat
        maxBitRate={1500000}
        progressUpdateInterval={500}
        muted={false}
        paused={!isActive || !isFocused}
      />
      <View style={styles.bottomContainer}>
        {/* Left: User info and caption */}
        <View style={styles.block1}>
          <View style={styles.rowContainer}>
            <TouchableOpacity style={styles.imgContainer}>
              {item.owner.profilePic ? (
                <Image
                  style={styles.img}
                  source={{uri: item.owner.profilePic}}
                />
              ) : (
                <User color="#fff" size={38} />
              )}
            </TouchableOpacity>
            <Text style={styles.name}>@{item.owner.handleName}</Text>
            <TouchableOpacity style={styles.btnFollow}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.caption}>
            {parseCaption(item.caption, hashtag => {
              handleHashtagPress(hashtag);
            })}
          </Text>
          <TouchableOpacity
            style={styles.audioRow}
            onPress={() => navigation?.navigate('SaveMusic')}>
            <Music color="#fff" size={18} style={styles.musicIcon} />
            <Text style={styles.audioText}>Original Audio</Text>
          </TouchableOpacity>
        </View>
        {/* Right-Side: Actions Button */}
        <View style={styles.block2}>
          <View style={styles.containerVertical}>
            <TouchableOpacity style={styles.iconContainer} onPress={handleLike}>
              {isLiked ? (
                <Heart color="#e9435a" fill="#e9435a" size={28} />
              ) : (
                <Heart color="#fff" size={28} />
              )}
              <Text style={styles.actionText}>{formatNumber(numLike)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => openComment && openComment(item._id)}>
              <MessageCircle color="#fff" size={28} />
              <Text style={styles.actionText}>
                {formatNumber(item.commentCount)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer}>
              <SendIcon color="#fff" size={28} />
              <Text style={styles.actionText}>
                {formatNumber(item.shareCount)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => showBottomSheet && showBottomSheet(item._id)}>
              <MoreVertical color="#fff" size={28} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconMusicContainer}
              onPress={() => navigation?.navigate('SaveMusic')}>
              <Music color="#fff" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReelItem;
