import {
  Image,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from '../util/ThemeContext';
import {Colors} from '../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';

const Setting = () => {
  const navigation = useNavigation();

  const {theme, toggleTheme} = useTheme();
  const color = Colors[theme];

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.navigate('BottomTabs')}>
          <Image
            style={[styles.icon, {tintColor: color.text}]}
            source={require('../../assets/icon/left.png')}
          />
        </TouchableOpacity>

        <View style={styles.changeColor}>
          <Text style={[styles.label, {color: color.text}]}>
            Chế độ hiện tại: {theme === 'light' ? 'Sáng' : 'Tối'}
          </Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            thumbColor={theme === 'dark' ? '#fff' : '#f4f3f4'}
            trackColor={{false: '#767577', true: '#81b0ff'}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginLeft: 15,
    marginRight: 15,
  },
  icon: {
    width: 20,
    height: 20,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
  },
  changeColor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
