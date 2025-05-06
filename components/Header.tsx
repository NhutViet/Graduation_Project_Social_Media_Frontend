import React from 'react';
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
    iconLeft,
    func,
    funcLeft,
    navigation,
  } = props;
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {icon && <Image source={icon} style={styles.logo} />}
        {iconBack && (
          <TouchableOpacity style={styles.iconBox} onPress={func}>
            <Image
              source={iconBack}
              style={[styles.icon, {tintColor: color.text}]}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        {title && (
          <Text style={[styles.title, {color: color.text}]}>{title}</Text>
        )}
      </View>

      <View style={styles.rightSection}>
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
        {iconLeft && (
          <TouchableOpacity style={styles.iconBox} onPress={funcLeft}>
            <Image
              source={iconLeft}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DBDBDB',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 80,
  },
  logo: {
    width: 100,
    height: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  iconBox: {
    width: 24,
    height: 24,
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Header;
