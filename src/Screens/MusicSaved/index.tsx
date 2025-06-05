import React, {useState, useRef} from 'react';

// Enable playback in silence mode (iOS)
Sound.setCategory('Playback');
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {ChevronLeft, Share2, Play, Pause, Music} from 'lucide-react-native';
import Sound from 'react-native-sound';

const musicData = [
  {
    id: '1',
    title: "That's So True",
    artist: 'Gracie Abrams',
    reels: '800K reels',
    duration: '2:46',
    thumbnail: 'https://picsum.photos/300/300?random=10',
    audioUrl: '/Users/toibietemkhongbiet./Downloads/SampleAudio.mp3',
  },
  {
    id: '2',
    title: 'Sorauta',
    artist: 'Kentaro feat. Yuna',
    reels: '13.2K reels',
    duration: '4:00',
    thumbnail: 'https://picsum.photos/300/300?random=20',
    audioUrl: 'https://cdn.freesound.org/previews/473/473917_8315715-lq.mp3',
  },
  {
    id: '3',
    title: 'The Name Of Life (From "Spirited Away")',
    artist: 'Anime Zing',
    reels: '34.2K reels',
    duration: '5:42',
    thumbnail: 'https://picsum.photos/300/300?random=30',
    audioUrl: 'https://cdn.freesound.org/previews/808/808066_5674468-lq.mp3',
  },
  {
    id: '4',
    title: 'Original audio',
    artist: 'yuna_3047',
    reels: '4,202 reels',
    duration: '0:10',
    thumbnail: 'https://picsum.photos/300/300?random=40',
    audioUrl: 'https://cdn.freesound.org/previews/510/510802_6627602-lq.mp3',
  },
  {
    id: '5',
    title: 'Fantasy',
    artist: 'Meiko Nakahara',
    reels: '17.8K reels',
    duration: '4:15',
    thumbnail: 'https://picsum.photos/300/300?random=50',
    audioUrl: 'https://cdn.freesound.org/previews/541/541689_3492460-lq.mp3',
  },
];

export const MusicSavedScreen = () => {
  const {theme} = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation();
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const soundRef = useRef<Sound | null>(null);

  const playAudio = (id: string, audioUrl: string) => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current?.release();
        soundRef.current = null;
      });
    }

    const newSound = new Sound(audioUrl, '', error => {
      if (error) {
        console.log('Lỗi khi tải audio:', error);
        setIsPlayingAudio(false);
        setCurrentPlayingId(null);
        setPlayingTrackId(null);
        return;
      }

      soundRef.current = newSound;
      newSound.setNumberOfLoops(0);
      newSound.play(success => {
        if (!success) {
          console.log('Phát thất bại');
        }
        // reset lại state khi kết thúc
        setIsPlayingAudio(false);
        setCurrentPlayingId(null);
        setPlayingTrackId(null);
        soundRef.current?.release();
        soundRef.current = null;
      });

      setCurrentPlayingId(id);
      setPlayingTrackId(id);
      setIsPlayingAudio(true);
    });
  };

  const handlePlayPress = (id: string, audioUrl: string) => {
    const isSameTrack = currentPlayingId === id;

    if (!isPlayingAudio) {
      // Case 1: chưa phát gì
      playAudio(id, audioUrl);
      return;
    }

    if (isPlayingAudio && isSameTrack) {
      if (soundRef.current) {
        if (soundRef.current.isPlaying()) {
          soundRef.current.pause();
          return;
        } else {
          soundRef.current.play();
          return;
        }
      }
    }

    // Case 3: đang phát và bấm sang bài khác
    playAudio(id, audioUrl);
  };

  const renderItem = ({item}: {item: (typeof musicData)[0]}) => {
    const isThisPlaying = playingTrackId === item.id && isPlayingAudio;

    return (
      <View style={styles.audioItem}>
        <View style={styles.leftContent}>
          <Image source={{uri: item.thumbnail}} style={styles.thumbnail} />
          <View style={styles.textContainer}>
            <Text
              style={[styles.title, {color: colors.text}]}
              numberOfLines={1}>
              {item.title}
            </Text>
            <Text
              style={[styles.subtitle, {color: colors.textSecondary}]}
              numberOfLines={1}>
              {item.artist} · {item.reels} · {item.duration}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.playButton,
            {
              backgroundColor: isThisPlaying
                ? colors.primary
                : colors.textSecondary,
            },
          ]}
          onPress={() => {
            handlePlayPress(item.id, item.audioUrl);
          }}>
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
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: colors.text}]}>Âm thanh</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('LikedScreen' as never)}>
          <Share2 size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlashList
        data={musicData}
        renderItem={renderItem}
        estimatedItemSize={50}
        keyExtractor={item => item.id}
        extraData={{
          playingTrackId,
          isPlayingAudio,
          currentPlayingId,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
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
