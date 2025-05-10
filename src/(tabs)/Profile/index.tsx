import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';

const Profile = () => {
  const navigation: any = useNavigation();

  const {theme} = useTheme();
  const color = Colors[theme];
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.titleHeader, {color: color.text}]}>
            Nhut Viet
          </Text>
          <View style={styles.headerIcon}>
            <TouchableOpacity>
              <Image
                source={require('../../../assets/icon/icon_tinder.png')}
                style={[styles.icon, {tintColor: color.text}]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("QRCode")}>
              <Image
                source={require('../../../assets/icon/Plus.png')}
                style={[styles.icon, {tintColor: color.text}]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
              <Image
                source={require('../../../assets/icon/Menu.png')}
                style={[styles.icon, {tintColor: color.text}]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginLeft: 15,
    marginRight: 15,
  },
  titleHeader: {},
  icon: {
    width: 20,
    height: 20,
    marginLeft: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerIcon: {
    flexDirection: 'row',
  },
});

export default Profile;
