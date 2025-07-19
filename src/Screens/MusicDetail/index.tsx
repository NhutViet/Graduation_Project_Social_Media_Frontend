import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {ChevronLeft, Bookmark, Ellipsis, Send, Eye, Music} from 'lucide-react-native';
import {FlashList} from '@shopify/flash-list';

export const musicData = {
  id: '1',
  title: 'Take My Hand',
  artist: 'Matt Berry',
  duration: '0:25',
  usageCount: '12040',
  thumbnail: 'https://picsum.photos/300/300?random=10',
  reels: [
    {
      id: '1',
      thumbnail: 'https://picsum.photos/300/300?random=11',
      views: '112412',
    },
    {
      id: '2',
      thumbnail: 'https://picsum.photos/300/300?random=12',
      views: '221421',
    },
    {
      id: '3',
      thumbnail: 'https://picsum.photos/300/300?random=13',
      views: '98241',
    },
    {
      id: '4',
      thumbnail: 'https://picsum.photos/300/300?random=14',
      views: '11241244',
    },
    {
      id: '5',
      thumbnail: 'https://picsum.photos/300/300?random=15',
      views: '2124',
    },
    {
      id: '6',
      thumbnail: 'https://picsum.photos/300/300?random=16',
      views: '11244',
    },
    {
      id: '7',
      thumbnail: 'https://picsum.photos/300/300?random=17',
      views: '312444',
    },
    {
      id: '8',
      thumbnail: 'https://picsum.photos/300/300?random=18',
      views: '11242',
    },
    {
      id: '9',
      thumbnail: 'https://picsum.photos/300/300?random=19',
      views: '824124',
    },
    {
      id: '10',
      thumbnail: 'https://picsum.photos/300/300?random=20',
      views: '452187',
    },
    {
      id: '11',
      thumbnail: 'https://picsum.photos/300/300?random=21',
      views: '678923',
    },
    {
      id: '12',
      thumbnail: 'https://picsum.photos/300/300?random=22',
      views: '345689',
    },
    {
      id: '13',
      thumbnail: 'https://picsum.photos/300/300?random=23',
      views: '987654',
    },
    {
      id: '14',
      thumbnail: 'https://picsum.photos/300/300?random=24',
      views: '234567',
    },
    {
      id: '15',
      thumbnail: 'https://picsum.photos/300/300?random=25',
      views: '765431',
    },
  ],
};
const ITEM_SIZE = Dimensions.get('window').width / 3 - 2;

export const SaveMusic = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const colors = Colors[theme];
  const formatReelViews = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 100000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderReelItem = ({item}: {item: {
    id: string;
    thumbnail: string;
    views: string;
}}) => (
    <TouchableOpacity style={styles.reelItem}>
      <Image source={{uri: item.thumbnail}} style={styles.reelThumbnail} />
      <View style={styles.viewCount}>
        <Eye size={14} color={colors.background} />
        <Text style={[styles.viewCountText, {color: Colors.lightGray}]}>
          {formatReelViews(parseInt(item.views))}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={32} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ellipsis size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Music Info */}
      <View style={styles.musicInfo}>
        <Image
          source={{uri: musicData.thumbnail}}
          style={styles.musicThumbnail}
        />
        <View style={styles.musicDetails}>
          <Text style={[styles.title, {color: colors.text}]}>
            {musicData.title}
          </Text>
          <Text style={[styles.artist, {color: colors.text}]}>
            {musicData.artist}
          </Text>
        </View>
      </View>
      <View style={styles.underMusicDetails}>
        <View style={styles.stats}>
          <View
            style={[styles.statFrame, {backgroundColor: colors.background}]}>
            <Text style={[styles.statText, {color: colors.textSecondary}]}>
              {musicData.duration}
            </Text>
            <Text style={styles.statText}>·</Text>
            <Text style={[styles.statText, {color: colors.textSecondary}]}>
              {formatReelViews(Number(musicData.usageCount))} reels
            </Text>
            <Text style={styles.statText}>·</Text>
            <View style={styles.statFrame}>
              <Music size={22} color={colors.text} />
              <Text style={[styles.statText, {color: colors.text}]}>Thêm</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              console.log('Saved Success');
            }}
            style={styles.iconButton}>
            <Bookmark size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ShowActivity' as never)}
            style={styles.iconButton}>
            <Send size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Use Audio Button */}
      <TouchableOpacity
        style={[styles.useAudioButton, {backgroundColor: colors.blue}]}>
        <Text style={styles.useAudioText}>Sử dụng âm thanh</Text>
      </TouchableOpacity>

      {/* Reels Grid */}
      <FlashList
        data={musicData.reels}
        renderItem={renderReelItem}
        numColumns={3}
        estimatedItemSize={ITEM_SIZE}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  musicInfo: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    alignItems: 'center',
    margin: 1,
    // backgroundColor: '#f2f2f2',
  },
  musicThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  musicDetails: {
    marginTop: 12,
    marginLeft: 16,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  artist: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  stats: {
    // width: '35%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 8,
  },
  statFrame: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  statText: {
    fontSize: 16,
  },
  useAudioButton: {
    marginBottom: 8,
    marginHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  useAudioText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  reelItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.5,
    margin: 1,
  },
  reelThumbnail: {
    width: ITEM_SIZE,
    height: '100%',
  },
  viewCount: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewCountText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  underMusicDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    margin: 1,
  },
});
