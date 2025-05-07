import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../assets/color/Colors';
import {useTheme} from '../src/util/ThemeContext';

const User = (props: any) => {
  const {name, image, status, func, navigation, isStory = true} = props;

  const {theme} = useTheme();
  const color = Colors[theme];

  const AvatarContent = () => (
    <View
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
    </View>
  );

  return (
    <View style={[styles.container, {alignItems: isStory ? 'center' : 'flex-start'}]}>
      {status === 1 ? (
        <TouchableOpacity style={[styles.box, {marginVertical: 10}]} onPress={func}>
          <LinearGradient
            colors={['#D300C4', '#FE393C', '#FED203']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[styles.block, {width: isStory ? 80 : 50,
              height: isStory ? 80 : 50,
            }]}>
            <AvatarContent />
          </LinearGradient>
          {!isStory && (
            <View style={styles.boxText}>
              <Text style={[styles.nameText, {color: color.text}]}>{name}</Text>
              <Text style={[styles.namehandleText, {color: color.lightDark}]}>
                {name}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.box, {marginVertical: 10}]} onPress={func}>
          <View style={[styles.block1, {width: isStory ? 80 : 50,
              height: isStory ? 80 : 50,
            }]}>
            <AvatarContent />
          </View>
          {!isStory && (
            <View style={styles.boxText}>
              <Text style={[styles.nameText, {color: color.text}]}>{name}</Text>
              <Text style={[styles.namehandleText, {color: color.lightDark}]}>
                {name}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
      {isStory && <Text style={[styles.text, {color: color.text}]}>{name}</Text>}
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
  box: {
    flexDirection: 'row',
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
});

export default User;
