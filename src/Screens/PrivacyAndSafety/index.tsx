import React, {useState} from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Info, Ban, Bug } from 'lucide-react-native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import Header from '../../../components/Header';
import { ChevronRight, Flag, UserLock } from 'lucide-react-native';

export const PrivacyAndSafety = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const [readReceipts, setReadReceipts] = useState(false)
  const [typingIndicator, setTypingIndicator] = useState(false)
  const toggleReadReceipts = () => setReadReceipts(!readReceipts);
  const toggleTypingIndicator = () => setTypingIndicator(!typingIndicator);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: color.background}]}>
      <View style={{width: '100%', height: 60}}>
        <Header
            title="Privacy & safety"
            iconBack={require('../../../assets/icon/left.png')}
            func={() => navigation.goBack()}
            navigation={navigation}
        />
      </View>

      <ScrollView contentContainerStyle={[styles.content, {backgroundColor: color.background}]}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: color.text}]}>username...</Text>
          <TouchableOpacity style={styles.row}>
            <Info style={styles.rowIcon} size={24} color={color.text} />
            <Text style={[styles.rowText, {color: color.text}]}>Về tài khoản này</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
                <ChevronRight color={color.textSecondary}/>
            </View>
          </TouchableOpacity>
        </View>


        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: color.text}]}>Giữ cho tin nhắn được bảo mật</Text>
          <TouchableOpacity style={styles.row}>
            <Text style={[styles.rowText, {color: color.text}]}>Sử dụng mã hóa đầu cuối</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: color.text}]}>Những người thể nhìn thấy hoạt động của bạn</Text>
          <View style={styles.switchRow}>
            <Text style={[styles.rowText, {color: color.text}]}>Hiển thị đã đọc</Text>
            <Switch  value={readReceipts} onValueChange={toggleReadReceipts} thumbColor={color.text} trackColor={{ false: color.textSecondary, true: color.text }} />
          </View>
          <Text style={[styles.note, {color: color.textSecondary}]}>
            Người khác có thể nhìn thấy khi bạn đã đọc tin nhắn của họ. {"\n \n"}
            Tin nhắn biến mất luôn gửi thông báo đã đọc.
          </Text>
          <View style={styles.switchRow}>
            <Text style={[styles.rowText, {color: color.text}]}>Hiển thị gõ</Text>
            <Switch value={typingIndicator} onValueChange={toggleTypingIndicator} thumbColor={color.text} trackColor={{ false: color.textSecondary, true: color.text }}/>
          </View>
          <Text style={[styles.note, {color: color.textSecondary}]}>
            Người khác có thể nhìn thấy khi bạn đang gõ.
          </Text>
        </View>


        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: color.text}]}>Những người có thể liên hệ tới bạn</Text>
          <TouchableOpacity style={styles.row}>
            <UserLock size={24} style={{marginRight: 12}} color={color.text}/>
            <Text style={[styles.rowText, {color: color.text}]}>Hạn chế</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
                <ChevronRight color={color.textSecondary}/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Ban style={styles.rowIcon} size={24} color="red" />
            <Text style={[[styles.rowText, {color: color.text}], { color: 'red' }]}>Chặn</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
                <ChevronRight color={color.textSecondary}/>
            </View>
          </TouchableOpacity>
        </View>

        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: color.text}]}>Hỗ trợ</Text>
          <TouchableOpacity style={styles.row}>
            <Flag style={{marginRight: 12}}/>
            <Text style={[[styles.rowText, {color: color.text}], { color: 'red' }]}>Báo cáo</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
                <ChevronRight color={color.textSecondary}/>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    rowIcon: {
        marginRight: 12
    },
    rowText: {
        fontSize: 14,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    note: {
        width: 250,
        fontSize: 12,
        color: '#888',
        marginTop: -16,
        marginBottom: 8,
    },
})