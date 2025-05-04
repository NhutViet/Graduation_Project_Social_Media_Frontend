import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../assets/color/Colors';
import {useTheme} from '../src/util/ThemeContext';

const Header = (props: any) => {
  const {
    title,
    icon,
    iconBack,
    iconQR,
    iconNotify,
    iconMessage,
    func,
    navigation,
  } = props;
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.logo} />
      {iconBack && (
        <TouchableOpacity style={styles.iconBox} onPress={func}>
          <Image
            source={iconBack}
            style={[styles.icon, {tintColor: color.text}]}
          />
        </TouchableOpacity>
      )}
      {title && (
        <Text style={[styles.title, {color: color.text}]}>{title}</Text>
      )}
      <View style={styles.iconBlock}>
        {iconQR && (
          <TouchableOpacity
            style={styles.iconBox}
            onPress={() => navigation.navigate('QRcode')}>
            <Image
              source={iconQR}
              style={[styles.icon, {tintColor: color.text}]}
            />
          </TouchableOpacity>
        )}
        {iconNotify && (
          <TouchableOpacity style={styles.iconBox}>
            <Image
              source={iconNotify}
              style={[styles.icon, {tintColor: color.text}]}
            />
          </TouchableOpacity>
        )}
        {iconMessage && (
          <TouchableOpacity style={styles.iconBox}>
            <Image
              source={iconMessage}
              style={[styles.icon, {tintColor: color.text}]}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  logo: {
    width: 100,
    height: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 20,
    height: 20,
    marginLeft: 20,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Header;
