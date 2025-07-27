import React from 'react';
import {SafeAreaView, ScrollView, View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../components/Header';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';

export const PrivacySafetyChat: React.FC = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={styles.headerContainer}>
        <Header
          title="Chính sách bảo mật và an toàn"
          iconBack
          func={() => navigation.goBack()}
          navigation={navigation}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, {color: color.text}]}>
          1. Giới thiệu
        </Text>
        <Text style={[styles.paragraph, {color: color.textSecondary}]}>
          Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn.
          Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo mật thông
          tin khi bạn sử dụng ứng dụng.
        </Text>

        <Text style={[styles.sectionTitle, {color: color.text}]}>
          2. Thông tin thu thập
        </Text>
        <Text style={[styles.paragraph, {color: color.textSecondary}]}>
          - Thông tin bạn cung cấp khi đăng ký và sử dụng dịch vụ (tên, email,
          ảnh đại diện...).{`\n`}- Nội dung trò chuyện và dữ liệu tin nhắn bạn
          gửi.
        </Text>

        <Text style={[styles.sectionTitle, {color: color.text}]}>
          3. Mục đích sử dụng
        </Text>
        <Text style={[styles.paragraph, {color: color.textSecondary}]}>
          Chúng tôi sử dụng thông tin để: {`\n`}- Cung cấp và cải thiện dịch vụ
          chat. {`\n`}- Gửi thông báo liên quan đến tin nhắn và cập nhật sản
          phẩm.
        </Text>

        <Text style={[styles.sectionTitle, {color: color.text}]}>
          4. Bảo mật dữ liệu
        </Text>
        <Text style={[styles.paragraph, {color: color.textSecondary}]}>
          Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và quản lý nghiêm
          ngặt để bảo vệ dữ liệu của bạn khỏi truy cập trái phép, rò rỉ hoặc mất
          mát.
        </Text>

        <Text style={[styles.sectionTitle, {color: color.text}]}>
          5. Quyền của bạn
        </Text>
        <Text style={[styles.paragraph, {color: color.textSecondary}]}>
          Bạn có quyền xem, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân. Liên hệ
          với chúng tôi qua mục hỗ trợ nếu cần.
        </Text>

        <Text style={[styles.sectionTitle, {color: color.text}]}>
          6. Liên hệ
        </Text>
        <Text style={[styles.paragraph, {color: color.textSecondary}]}>
          Nếu có thắc mắc về chính sách này, vui lòng liên hệ qua email
          support@cirla.io.vn.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    height: 60,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  paragraph: {fontSize: 14, lineHeight: 20, marginBottom: 12},
});
