import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../assets/color/Colors';
import {useTheme} from '../src/util/ThemeContext';

const User = (props: any) => {
  const {name, image, status, func, navigation} = props;

  console.log('User props:', {name, image, status, func}); // Debug prop

  const {theme} = useTheme();
  const color = Colors[theme];

  const AvatarContent = () => (
    <TouchableOpacity
      style={
        status === 1
          ? [styles.bgWhite, {backgroundColor: color.background}]
          : null
      }
      onPress={() => {
        console.log('User avatar pressed:', name);
        if (typeof func === 'function') {
          func();
        } else {
          console.warn('func is not a function:', func);
        }
      }}>
      <View style={styles.imgContainer}>
        <Image style={styles.img} source={{uri: image}} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {status === 1 ? (
        <LinearGradient
          colors={['#D300C4', '#FE393C', '#FED203']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.block}>
          <AvatarContent />
        </LinearGradient>
      ) : (
        <View style={styles.block1}>
          <AvatarContent />
        </View>
      )}
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
    marginTop: 4,
  },
});

export default User;
