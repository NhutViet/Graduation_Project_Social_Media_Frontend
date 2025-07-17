import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserMinus2, Ban, AlertOctagon, Lock } from 'lucide-react-native';
import Header from '../../../components/Header';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';

export const PrivacySafetyChat = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const [endToEndEncryption, setEndToEndEncryption] = useState(false);
  const [readReceipts, setReadReceipts] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: color.background}]}>
      <View style={{width: '100%', height: 60}}>
        <Header
          title="Quyền riêng tư và bảo mật"
          iconBack={true}
          func={() => navigation.goBack()}
          navigation={navigation}
        />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[[styles.sectionTitle, {color: color.text}], {color: color.text}]}>Giữ cho tin nhắn được bảo mật</Text>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Lock size={20} style={{marginRight: 10}} />
            <Text style={[styles.rowLabel, {color: color.text}]}>Sử dụng mã hóa đầu cuối</Text>
          </View>
          <Switch
            value={endToEndEncryption}
            onValueChange={setEndToEndEncryption}
            trackColor={{ true: Colors.primary, false: Colors.gray21 }}
            thumbColor={endToEndEncryption ? '#FFF' : '#FFF'}
          />
        </View>
        <Text style={[styles.sectionTitle, {color: color.text}]}>Những người thể nhìn thấy hoạt động của bạn</Text>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, {color: color.text, paddingBottom: 10}]}>Hiển thị đã đọc</Text>
          <Switch
            value={readReceipts}
            onValueChange={setReadReceipts}
            trackColor={{ true: Colors.primary, false: Colors.gray21 }}
            thumbColor={readReceipts ? '#FFF' : '#FFF'}
          />
        </View>
        <Text style={[styles.note, {color: color.textSecondary}]}>
            Người khác có thể nhìn thấy khi bạn đã đọc tin nhắn của họ. {'\n\n'}
            Tin nhắn biến mất luôn gửi thông báo đã đọc.
        </Text>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, {color: color.text, paddingBottom: 10}]}>Hiển thị gõ</Text>
          <Switch
            value={typingIndicator}
            onValueChange={setTypingIndicator}
            trackColor={{ true: Colors.primary, false: Colors.gray21 }}
            thumbColor={typingIndicator ? '#FFF' : '#FFF'}
          />
        </View>
        <Text style={[styles.note, {color: color.textSecondary}]}>
            Người khác có thể nhìn thấy khi bạn đang gõ.
        </Text>
        <Text style={[styles.sectionTitle, {color: color.text}]}>Những người có thể liên hệ tới bạn</Text>
        <TouchableOpacity style={styles.optionRow}>
          <View style={styles.optionText}>
            <UserMinus2 size={20} />
            <Text style={[styles.optionLabel, {color: color.text}]}>Hạn chế</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionRow}>
          <View style={styles.optionText}>
            <Ban size={20} color={color.error} />
            <Text style={[styles.optionLabel, { color: color.error }]}>Chặn</Text>
          </View>
        </TouchableOpacity>
        <Text style={[styles.sectionTitle, {color: color.text}]}>Hỗ trợ</Text>
        <TouchableOpacity style={styles.optionRow}>
          <View style={styles.optionText}>
            <AlertOctagon size={20} color={color.error} />
            <Text style={[styles.optionLabel, { color: color.error }]}>Báo cáo</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 16,
  },
  note: {
    width: 250,
    fontSize: 12,
    marginTop: -16,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  optionText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
})