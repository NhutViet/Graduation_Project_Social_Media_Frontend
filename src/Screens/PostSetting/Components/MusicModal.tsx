import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import Sound from 'react-native-sound';
import {Colors} from '../../../../assets/color/Colors';

const AudioTrimModal = (props: any) => {
  const {visible, onClose, audioUrl, songInfo} = props;
  const [sound, setSound] = useState<Sound | null>(null);
  const [duration, setDuration] = useState(0);
  const [selectedRange, setSelectedRange] = useState({start: 0, end: 30});
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const [scrollX, setScrollX] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [progressInRangeIndex, setProgressInRangeIndex] = useState(0);

  // Config
  const waveformWidth = 1000;
  const screenWidth = Dimensions.get('window').width * 0.95 - 40;
  const selectionWidth = screenWidth * 0.6;
  const waveformPadding = (screenWidth - selectionWidth) / 2;

  // Fake waveform data
  const waveformData = useRef(
    Array.from({length: 200}, () => Math.floor(Math.random() * 30 + 10)),
  ).current;

  useEffect(() => {
    if (visible && audioUrl) {
      const newSound = new Sound(audioUrl, undefined, error => {
        if (error) {
          console.error('Failed to load the sound', error);
        } else {
          setDuration(newSound.getDuration());
          setSound(newSound);
        }
      });

      return () => {
        newSound.release();
        setPlaying(false);
        setSelectedRange({start: 0, end: 30});
        setCurrentTime(0);
        progressAnim.stopAnimation();
        progressAnim.setValue(0);
      };
    }
  }, [audioUrl, visible]);

  useEffect(() => {
    if (duration > 0) {
      const visibleWidth = waveformWidth - 2 * waveformPadding;
      const calculatedStart = (scrollX / visibleWidth) * duration;
      const clampedStart = Math.max(
        0,
        Math.min(duration - 30, calculatedStart),
      );
      setSelectedRange({start: clampedStart, end: clampedStart + 30});
    }
  }, [scrollX, duration]);

  useEffect(() => {
    const id = progressAnim.addListener(({value}) => {
      const newTime =
        selectedRange.start + value * (selectedRange.end - selectedRange.start);
      setCurrentTime(newTime);
    });

    return () => {
      progressAnim.removeListener(id);
    };
  }, [selectedRange]);

  const handlePlay = () => {
    if (!sound) return;

    sound.setCurrentTime(selectedRange.start);
    sound.play(success => {
      if (!success) {
        console.error('Playback failed');
      }
    });

    setPlaying(true);
    progressAnim.setValue(0);

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: (selectedRange.end - selectedRange.start) * 1000,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        handleStop();
      }
    });
  };

  const handleStop = () => {
    if (sound) {
      sound.stop();
    }
    setPlaying(false);
    progressAnim.stopAnimation();
    progressAnim.setValue(0);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modal}>
          {/* Avatar */}
          <Image source={{uri: songInfo.image}} style={styles.avatar} />

          {/* Title + Artist */}
          <Text style={styles.title}>{songInfo.title}</Text>
          <Text style={styles.artist}>{songInfo.artist}</Text>

          {/* 30s + progress + play */}
          <View style={styles.sliderContainer}>
            <Text style={styles.durationText}>30s</Text>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <TouchableOpacity onPress={playing ? handleStop : handlePlay}>
              <Image
                style={styles.playIcon}
                source={
                  playing
                    ? require('../../../../assets/icon/pause.png')
                    : require('../../../../assets/icon/play.png')
                }
              />
            </TouchableOpacity>
          </View>

          {/* Waveform + Selection */}
          <View style={{width: '100%', height: 60, marginVertical: 20}}>
            <ScrollView
              horizontal
              ref={scrollRef}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={e => setScrollX(e.nativeEvent.contentOffset.x)}
              contentContainerStyle={{paddingLeft: waveformPadding}}>
              <View style={styles.waveformScrollContainer}>
                {waveformData.map((height, index) => (
                  <View
                    key={index}
                    style={[
                      styles.waveformBar,
                      {
                        height,
                        backgroundColor: '#666',
                      },
                    ]}
                  />
                ))}
                <View style={{width: waveformPadding}} />
              </View>
            </ScrollView>

            <View
              pointerEvents="none"
              style={[
                styles.selectionOverlay,
                {
                  width: '60%',
                  left: '20%',
                },
              ]}
            />
          </View>

          <Text style={{color: '#aaa', fontSize: 13, marginBottom: 10}}>
            {`Từ ${selectedRange.start.toFixed(
              1,
            )}s → ${selectedRange.end.toFixed(1)}s`}
          </Text>

          {/* Bottom Buttons */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.bottomText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.bottomText}>Âm thanh</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.bottomText}>Xong</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AudioTrimModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modal: {
    width: '95%',
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  title: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  artist: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 15,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  durationText: {
    color: 'white',
    width: 35,
    textAlign: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#444',
    borderRadius: 3,
    marginHorizontal: 10,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 3,
  },
  playIcon: {
    width: 14,
    height: 14,
    tintColor: Colors.white,
    resizeMode: 'contain',
    paddingLeft: 10,
  },
  waveformScrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  waveformBar: {
    width: 4,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  selectionOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderColor: Colors.white,
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  bottomButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  bottomText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
});
