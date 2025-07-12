import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {Plus, Hash} from 'lucide-react-native';
import React from 'react';

type StoryProps = {
  name: string;
  image?: string;
  func: () => void;
  isStory?: boolean;
  isHashTag?: boolean;
  isCurrentUser?: boolean;
  hasStory?: boolean;
  isSeen?: boolean;
};

const Story = (props: StoryProps) => {
  const {
    name,
    image,
    func,
    isStory = true,
    isHashTag = false,
    isCurrentUser = false,
    hasStory = true,
    isSeen = false,
  } = props;

  const {theme} = useTheme();
  const color = Colors[theme];

  const AvatarContent = () => (
    <View style={[styles.bgWhite, {backgroundColor: color.background}]}>
      <View style={[styles.imgContainer, {backgroundColor: color.background}]}>
        {isHashTag ? (
          <Hash size={22} color={color.text} />
        ) : (
          <Image
            style={styles.img}
            source={
              image
                ? {uri: image}
                : {
                    uri: 'https://i.pinimg.com/736x/09/80/62/098062ede8791dc791c3110250d2a413.jpg',
                  }
            }
          />
        )}
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {alignItems: isStory ? 'center' : 'flex-start'},
      ]}>
      <TouchableOpacity
        style={[styles.box, {marginTop: 10}]}
        onPress={() => {
          func();
        }}>
        {hasStory ? (
          <LinearGradient
            colors={
              !isSeen
                ? ['#8A3FFC', '#00C6FF']
                : ['#CCCCCC', '#E0E0E0', '#F0F0F0']
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[
              styles.block,
              {width: isStory ? 75 : 50, height: isStory ? 75 : 50},
            ]}>
            <AvatarContent />
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.block1,
              {width: isStory ? 75 : 50, height: isStory ? 75 : 50},
            ]}>
            <AvatarContent />
            {isCurrentUser && (
              <View style={styles.plusIconWrapper}>
                <Plus size={18} color={'#fff'} />
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>

      <Text style={[styles.text, {color: color.text}]}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginLeft: 10,
  },
  block: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    padding: 3,
  },
  block1: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  bgWhite: {
    borderRadius: 40,
    padding: 3,
  },
  imgContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  text: {
    fontSize: 16,
  },
  box: {
    flexDirection: 'row',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    justifyContent: 'center',
    marginLeft: 15,
  },
  nameText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  namehandleText: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  imgHash: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
  plusIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0095F6',
    borderRadius: 50,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default React.memo(Story);
