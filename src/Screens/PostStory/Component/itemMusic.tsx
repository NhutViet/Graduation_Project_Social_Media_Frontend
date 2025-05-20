import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

const ItemMusic = (props: any) => {
  const {image, nameMusic, author, countVideoUsed, time} = props;
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.imageContainer}>
          <Image style={styles.img} source={{uri: image}} />
        </View>
        <View>
          <Text style={[styles.text, {color: color.text, fontWeight: 'bold'}]}>
            {nameMusic}
          </Text>
          <View style={styles.leftContainer}>
            <Text style={[styles.text, {color: color.text}]}>{author} </Text>
            <Text style={[styles.text, {color: color.text}]}>
              · {countVideoUsed} reels ·
            </Text>
            <Text style={[styles.text, {color: color.text}]}> {time}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={[styles.playBlock, {borderColor: color.text}]}>
        <Image
          style={[styles.play, {tintColor: color.text}]}
          source={require('../../../../assets/icon/play.png')}
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
