import React, {useRef, useState, useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Sound from 'react-native-sound';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

let currentSound: Sound | null = null;
let stopOther: (() => void) | null = null;

const ItemMusic = (props: any) => {
  const {coverImg, song, link, author, countVideoUsed = 0} = props;
  const {theme} = useTheme();
  const color = Colors[theme];
  const soundRef = useRef<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.release();
        soundRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (currentSound && currentSound !== soundRef.current) {
      currentSound.stop(() => {
        currentSound?.release();
      });
      currentSound = null;
      stopOther?.();
    }

    if (isPlaying) {
      soundRef.current?.pause();
      setIsPlaying(false);
      setIsPaused(true);
    } else {
      if (isPaused && soundRef.current) {
        soundRef.current.play(() => {
          setIsPlaying(false);
          setIsPaused(false);
          soundRef.current?.release();
          soundRef.current = null;
          currentSound = null;
        });
        setIsPlaying(true);
      } else if (!soundRef.current) {
        soundRef.current = new Sound(link, undefined, error => {
          if (error) {
            console.log('❌ Failed to load sound', error);
            return;
          }

          soundRef.current?.play(() => {
            setIsPlaying(false);
            setIsPaused(false);
            soundRef.current?.release();
            soundRef.current = null;
            currentSound = null;
          });

          currentSound = soundRef.current;
          setIsPlaying(true);
        });
      } else {
        soundRef.current.play(() => {
          setIsPlaying(false);
          setIsPaused(false);
          soundRef.current?.release();
          soundRef.current = null;
          currentSound = null;
        });
        setIsPlaying(true);
      }

      stopOther = () => {
        if (soundRef.current?.isPlaying()) {
          soundRef.current?.stop(() => {
            soundRef.current?.release();
            soundRef.current = null;
            setIsPlaying(false);
            setIsPaused(false);
          });
        } else {
          setIsPlaying(false);
          setIsPaused(false);
        }
      };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.imageContainer}>
          <Image style={styles.img} source={{uri: coverImg}} />
        </View>
        <View style={{width: '70%'}}>
          <Text
            style={[styles.text, {color: color.text, fontWeight: 'bold'}]}
            numberOfLines={1}>
            {song}
          </Text>
          <View style={styles.leftContainer}>
            <Text style={[styles.text, {color: color.text}]}>{author} </Text>
            <Text style={[styles.text, {color: color.text}]}>
              · {countVideoUsed} posts
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={handlePlayPause}
        style={[styles.playBlock, {borderColor: color.text}]}>
        <Image
          style={[styles.play, {tintColor: color.text}]}
          source={
            isPlaying
              ? require('../../../../assets/icon/pause.png')
              : require('../../../../assets/icon/play.png')
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  text: {
    fontSize: 14,
  },
  playBlock: {
    width: 30,
    height: 30,
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
  },
  play: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default ItemMusic;
