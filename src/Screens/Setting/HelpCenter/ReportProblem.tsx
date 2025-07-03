import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import { useTheme } from '../../../util/ThemeContext';
import { Colors } from '../../../../assets/color/Colors';
import { useNavigation } from '@react-navigation/native';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';

export const ReportProblemScreen = () => {
  const { theme } = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation();
  const [description, setDescription] = useState('');

  const sendReport = () => {
    GlobalAlertManager.show('Đã gửi báo lỗi', 'Cảm ơn bạn đã giúp chúng tôi cải thiện ứng dụng.');
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, marginBottom: 30 },
    textInput: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 12,
        minHeight: 120,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    buttonText: { fontSize: 16, fontWeight: '600' },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color.background }] }>
      <View style={{width: '100%', height: 60}}>
          <Header
              pressableTitle="Báo lỗi"
              iconBack={require('../../../../assets/icon/left.png')}
              func={() => navigation.goBack()}
              navigation={navigation}
          />
      </View>
      <View style={styles.content}>
        <TextInput
          style={[styles.textInput, { borderColor: color.border, color: color.text }]}
          placeholder="Mô tả vấn đề của bạn"
          placeholderTextColor={color.textSecondary}
          multiline
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: color.primary }]} onPress={sendReport}>
          <Text style={[styles.buttonText, { color: Colors.white }]}>Gửi báo lỗi</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};