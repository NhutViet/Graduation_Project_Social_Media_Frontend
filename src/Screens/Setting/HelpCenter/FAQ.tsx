import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const QUESTIONS = [
  {
    id: '1',
    q: 'Làm sao để thay đổi mật khẩu?',
    a: 'Vào trang cá nhân > Chỉnh sửa trang cá nhân > Ấn sửa và nhập mật khẩu mới để thay đổi mật khẩu của bạn.',
  },
  {
    id: '2',
    q: 'Làm thế nào để chuyển đổi tài khoản?',
    a: 'Vào trang cá nhân > Ấn vào tên tài khoản > Lựa chọn tài khoản đã tạo để thay đổi, nếu chưa có tài khoản khác bạn có thể ấn "Thêm tài khoản Cirla".',
  },
  {
    id: '3',
    q: 'Làm sao để chia sẻ bài viết?',
    a: 'Ấn vào biểu tượng chia sẻ của bài viết bạn muốn chia sẻ > Chọn phòng chat bạn muốn chia sẻ cho hoặc chọn "Sao chép liên kết".',
  },
  {
    id: '4',
    q: 'Làm thế nào để Follow người khác?',
    a: 'Tìm kiếm tài khoản, ấn nút Theo dõi dưới tên họ.',
  },
  {
    id: '5',
    q: 'Tại sao tài khoản bị khóa?',
    a: 'Tài khoản có thể bị khóa do vi phạm điều khoản cộng đồng. Vui lòng liên hệ hỗ trợ.',
  },
];

export const FAQScreen = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(prev => (prev === id ? null : id));
  };

  const {height} = Dimensions.get('window');

  const styles = StyleSheet.create({
    container: {flex: 1},
    list: {justifyContent: 'space-around', paddingVertical: 10},
    qaContainer: {marginHorizontal: 16},
    questionContainer: {paddingVertical: 10},
    question: {fontSize: 16, fontWeight: '600'},
    answerContainer: {
      paddingVertical: 8,
      paddingLeft: 10,
      borderLeftWidth: 2,
      borderLeftColor: color.border,
    },
    answer: {fontSize: 14, lineHeight: 20},
  });

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={{width: '100%', height: 60}}>
        <Header
          pressableTitle="FAQ"
          iconBack={true}
          func={() => navigation.goBack()}
          navigation={navigation}
        />
      </View>
      <ScrollView contentContainerStyle={[styles.list, {minHeight: 400}]}>
        {QUESTIONS.map(item => (
          <View key={item.id} style={styles.qaContainer}>
            <TouchableOpacity
              onPress={() => toggle(item.id)}
              style={styles.questionContainer}>
              <Text style={[styles.question, {color: color.primary}]}>
                {item.q}
              </Text>
            </TouchableOpacity>
            {expandedId === item.id && (
              <View style={styles.answerContainer}>
                <Text style={[styles.answer, {color: color.text}]}>
                  {item.a}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
