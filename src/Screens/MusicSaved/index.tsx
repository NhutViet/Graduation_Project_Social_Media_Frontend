import React, {useState, useRef, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import Sound from 'react-native-sound';
import {ChevronLeft, Share2, Play, Pause} from 'lucide-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {getItemsOfPlaylist} from '../../../services/bookmarkRedux/bookmarkSlice';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';

// Enable playback in silence mode (iOS)
Sound.setCategory('Playback');

interface MusicItem {
  id: string;
  title: string;
  artist: string;
  reels: string;
  duration: string;
  thumbnail: string;
  audioUrl: string;
}

interface RouteParams {
  title: string;
  playlistId: string;
}

export const MusicSavedScreen = () => {
  const {theme} = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const {title, playlistId} = route.params as RouteParams;
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const soundRef = useRef<Sound | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const {itemsByPlaylist} = useSelector((state: RootState) => state.bookmark);
  const {refreshToken} = useSelector((state: RootState) => state.user);

  const [playlistItems, setPlaylistItems] = useState(
    itemsByPlaylist[playlistId] ?? [],
  );

  useEffect(() => {
    dispatch(getItemsOfPlaylist({playlistId, refreshToken}));
  }, [dispatch, playlistId]);

  useEffect(() => {
    setPlaylistItems(itemsByPlaylist[playlistId] ?? []);
  }, [itemsByPlaylist]);

  // Auto stop audio when screen unfocus
  useEffect(() => {
    if (!isFocused && soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current?.release();
        soundRef.current = null;
        setIsPlayingAudio(false);
        setCurrentPlayingId(null);
        setPlayingTrackId(null);
      });
    }
  }, [isFocused]);

  const mappedMusicData: MusicItem[] = useMemo(() => {
    return playlistItems
      .filter(i => i.itemType === 'music' && i._id && i.link)
      .map(i => ({
        id: i._id!,
        title: i.song ?? 'No title',
        artist: i.author ?? 'Unknown artist',
        reels: `${i.viewCount ?? 0} reels`,
        duration: '0:00',
        thumbnail: i.coverImg ?? 'https://via.placeholder.com/300',
        audioUrl: i.link!,
      }));
  }, [playlistItems]);

  const createAndPlay = (id: string, url: string) => {
    const sound = new Sound(url, '', error => {
      if (error) {
        console.log('Lỗi khi tải audio:', error);
        setIsPlayingAudio(false);
        return;
      }
      soundRef.current = sound;
      sound.setNumberOfLoops(0);
      sound.play(success => {
        if (!success) {
          console.log('Phát thất bại');
        }
        sound.release();
        soundRef.current = null;
        setIsPlayingAudio(false);
        setPlayingTrackId(null);
        setCurrentPlayingId(null);
      });
      setPlayingTrackId(id);
      setCurrentPlayingId(id);
      setIsPlayingAudio(true);
    });
  };

  const playAudio = (id: string, url: string) => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current?.release();
        soundRef.current = null;
        createAndPlay(id, url);
      });
    } else {
      createAndPlay(id, url);
    }
  };

  const handlePlayPress = (id: string, audioUrl: string) => {
    const isSameTrack = currentPlayingId === id;

    if (!isPlayingAudio) {
      playAudio(id, audioUrl);
      return;
    }

    if (isPlayingAudio && isSameTrack) {
      if (soundRef.current?.isPlaying()) {
        soundRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        soundRef.current?.play();
        setIsPlayingAudio(true);
      }
      return;
    }

    // Đang phát bài khác
    playAudio(id, audioUrl);
  };

  const renderItem = ({item}: {item: MusicItem}) => {
    const isThisPlaying = playingTrackId === item.id && isPlayingAudio;

    return (
      <View style={styles.audioItem}>
        <View style={styles.leftContent}>
          <Image source={{uri: item.thumbnail}} style={styles.thumbnail} />
          <View style={styles.textContainer}>
            <Text style={[styles.title, {color: colors.text}]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.subtitle, {color: colors.textSecondary}]} numberOfLines={1}>
              {item.artist}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.playButton,
            {
              backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255, 255, 255, 0.2)',
            },
          ]}
          onPress={() => handlePlayPress(item.id, item.audioUrl)}>
          {isThisPlaying ? (
            <Pause size={20} color={colors.text} />
          ) : (
            <Play size={20} color={colors.text} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, {color: colors.text, position: 'absolute', textAlign: 'center', width: '110%'}]}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      { mappedMusicData.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', backgroundColor: colors.background}}>
          <Text style={{
            fontSize: 16,
            fontWeight: '400',
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 60,
          }}>Bạn hiện không lưu âm thanh nào.</Text>
        </View>
      ) : (
        <FlashList<MusicItem>
        data={mappedMusicData}
        renderItem={renderItem}
        estimatedItemSize={50}
        keyExtractor={item => item.id}
        extraData={{playingTrackId, isPlayingAudio, currentPlayingId}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
});
