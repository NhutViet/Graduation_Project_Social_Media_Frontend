import React from 'react';
import {StyleSheet, Text, View, Linking} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';

export const ContactScreen = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {flex: 1},
    content: {padding: 16, marginTop: 30},
    text: {fontSize: 14},
    link: {fontSize: 14, marginTop: 8, textDecorationLine: 'underline'},
  });

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={{width: '100%', height: 60}}>
        <Header
          pressableTitle="Liên hệ"
          iconBack={true}
          func={() => navigation.goBack()}
          navigation={navigation}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.text, {color: color.text}]}>
          Nếu bạn có bất kỳ câu hỏi nào, vui lòng gửi email cho chúng tôi:
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('mailto:support@example.com')}>
          <Text style={[styles.link, {color: color.primary}]}>
            support@example.com
          </Text>
        </TouchableOpacity>
        <Text style={[styles.text, {color: color.text, marginTop: 20}]}>
          Hoặc gọi đến hotline:
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:+84123456789')}>
          <Text style={[styles.link, {color: color.primary}]}>
            +84 123 456 789
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
