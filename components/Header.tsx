import React, {useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../assets/color/Colors';
import {useTheme} from '../src/util/ThemeContext';
import {Menu, Divider, Provider} from 'react-native-paper';

const Header = (props: any) => {
  const {
    title,
    icon,
    iconBack,
    iconQR,
    iconNotify,
    iconMessage,
    iconLeft,
    iconNewChat,
    func,
    funcLeft,
    navigation,
  } = props;

  const {theme} = useTheme();
  const color = Colors[theme];

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {icon && (
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              style={{
                marginTop: 40,
                marginLeft: 40,
              }}
              anchor={
                <TouchableOpacity onPress={openMenu}>
                  <Image source={icon} style={styles.logo} />
                </TouchableOpacity>
              }>
              <Menu.Item
                onPress={() => Alert.alert('Option 1')}
                title="Đang theo dõi"
              />
              <Menu.Item
                onPress={() => Alert.alert('Option 2')}
                title="Yêu thích"
              />
              <Divider />
            </Menu>
          )}
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
          <TouchableOpacity style={styles.iconBox} onPress={() => {}}>
            <Image
              source={iconNotify}
              style={[styles.icon, {tintColor: color.text}]}
            />
          </TouchableOpacity>
        )}
        {iconMessage && (
          <TouchableOpacity
            style={styles.iconBox}
            onPress={() => {
              navigation.navigate('Message');
            }}>
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
        {iconNewChat && (
          <TouchableOpacity style={styles.iconBox} onPress={func}>
            <Image
              source={iconNewChat}
              style={[styles.icon, {tintColor: color.text}]}
            />
          </TouchableOpacity>
        )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    height: 60,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSection: {
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconBox: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Header;
