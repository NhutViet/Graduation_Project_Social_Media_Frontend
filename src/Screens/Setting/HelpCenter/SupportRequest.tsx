import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';

const REQUESTS = [
  {id: '1', title: 'Khôi phục mật khẩu'},
  {id: '2', title: 'Vấn đề đăng bài'},
  {id: '3', title: 'Báo cáo nội dung vi phạm'},
  {id: '4', title: 'Gặp sự cố khi đăng nhập'},
  {id: '5', title: 'Cập nhật thông tin cá nhân'},
];

export const SupportRequestsScreen = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation();

  const handlePress = (title: string) => {
    GlobalAlertManager.show('Yêu cầu hỗ trợ', `Bạn chọn: ${title}`);
  };

  const styles = StyleSheet.create({
    container: {flex: 1},
    list: {padding: 16, marginTop: 30},
    item: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderRadius: 6,
      marginBottom: 12,
    },
    title: {fontSize: 16},
  });

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={{width: '100%', height: 60}}>
        <Header
          pressableTitle="Yêu cầu hỗ trợ"
          iconBack={true}
          func={() => navigation.goBack()}
          navigation={navigation}
        />
      </View>
      <View style={styles.list}>
        {REQUESTS.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[styles.item, {borderColor: color.border}]}
            onPress={() => handlePress(item.title)}>
            <Text style={[styles.title, {color: color.text}]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};
