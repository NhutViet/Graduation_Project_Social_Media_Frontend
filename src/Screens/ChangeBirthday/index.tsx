import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ChangeBirthdayStyles } from '../../StyleSheet/ChangeBirthdayStyles';
import { useTheme } from '../../util/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export const ChangeBirthday = () => {
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1); // 1 = January
  const [year, setYear] = useState(2005);
  const {theme} = useTheme();
  const styles = ChangeBirthdayStyles(theme);
  const navigation = useNavigation();

  const isValidDate = (d: any, m: any, y: any) => {
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  };

  const handleSave = () => {
    if (!isValidDate(day, month, year)) {
      Alert.alert('Lỗi', 'Ngày không hợp lệ!');
      return;
    }

    Alert.alert('Đã lưu', `Ngày sinh: ${day}/${month}/${year}`);
  };

  const renderDayOptions = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(<Picker.Item key={i} label={`${i}`} value={i} />);
    }
    return days;
  };

  const renderMonthOptions = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return months.map((m, i) => (
      <Picker.Item key={i + 1} label={m} value={i + 1} />
    ));
  };

  const renderYearOptions = () => {
    const years = [];
    for (let y = 1900; y <= new Date().getFullYear(); y++) {
      years.push(<Picker.Item key={y} label={`${y}`} value={y} />);
    }
    return years.reverse(); // Hiển thị năm mới nhất trước
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../../assets/icon/left.png')} style={styles.iconBack}/>
        </TouchableOpacity>
      <Text style={styles.title}>Edit your birthday</Text>

      <View style={styles.pickerRow}>
        <Picker selectedValue={day} style={styles.picker} onValueChange={setDay}>
          {renderDayOptions()}
        </Picker>

        <Picker selectedValue={month} style={styles.picker} onValueChange={setMonth}>
          {renderMonthOptions()}
        </Picker>

        <Picker selectedValue={year} style={styles.picker} onValueChange={setYear}>
          {renderYearOptions()}
        </Picker>
      </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
    }
