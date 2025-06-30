import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform, TextInput} from 'react-native';
import {AutoGrowingInput} from '../../../../components/AutoGrowTexts';
import {useProfileEditingStyles} from './ProfileEditingStyles';
import {Picker} from '@react-native-picker/picker';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';

type Row = {
  label: string;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  onDateChange?: (date: string) => void;
  type?: 'text' | 'date' | 'dropdown';
  options?: {label: string; value: string}[];
};

type UserInfoProps = {
  title?: string;
  subtitle?: string;
  rows: Row[];
};

export const UserInfo: React.FC<UserInfoProps> = ({title, subtitle, rows}) => {
  const styles = useProfileEditingStyles();
  const [editingDateIndex, setEditingDateIndex] = useState<number | null>(null);
  const [tempDateInput, setTempDateInput] = useState<string>('');

  const formatDateDisplay = (dateStr?: string): string => {
    if (!dateStr) return 'dd - MM - yyyy';
    
    // If it's already in dd/MM/yyyy format, convert to dd - MM - yyyy for display
    if (dateStr.includes('/')) {
      return dateStr.replace(/\//g, ' - ');
    }
    
    return dateStr;
  };

  const formatDateInput = (input: string): string => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');
    
    // Limit to 8 digits
    const limitedDigits = digits.slice(0, 8);
    
    // Format as dd-MM-yyyy
    let formatted = '';
    for (let i = 0; i < limitedDigits.length; i++) {
      if (i === 2 || i === 4) {
        formatted += '-';
      }
      formatted += limitedDigits[i];
    }
    
    return formatted;
  };

  const validateDate = (dateStr: string): {isValid: boolean; error?: string} => {
    // Remove dashes and check if we have 8 digits
    const digits = dateStr.replace(/-/g, '');
    
    if (digits.length !== 8) {
      return {isValid: false, error: 'Vui lòng nhập đầy đủ ngày sinh (8 số)'};
    }

    const day = parseInt(digits.slice(0, 2));
    const month = parseInt(digits.slice(2, 4));
    const year = parseInt(digits.slice(4, 8));

    // Basic validation
    if (day < 1 || day > 31) {
      return {isValid: false, error: 'Ngày không hợp lệ (01-31)'};
    }

    if (month < 1 || month > 12) {
      return {isValid: false, error: 'Tháng không hợp lệ (01-12)'};
    }

    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
      return {isValid: false, error: `Năm không hợp lệ (1900-${currentYear})`};
    }

    // Check if date exists
    const testDate = new Date(year, month - 1, day);
    if (testDate.getDate() !== day || testDate.getMonth() !== month - 1 || testDate.getFullYear() !== year) {
      return {isValid: false, error: 'Ngày không tồn tại'};
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (testDate > today) {
      return {isValid: false, error: 'Ngày sinh không thể là tương lai'};
    }

    return {isValid: true};
  };

  const handleDateInputStart = (rowIndex: number, currentValue?: string) => {
    setEditingDateIndex(rowIndex);
    if (currentValue && currentValue !== 'dd - MM - yyyy') {
      const cleanValue = currentValue.replace(/[\s-/]/g, '');
      setTempDateInput(formatDateInput(cleanValue));
    } else {
      setTempDateInput('');
    }
  };

  const handleDateInputChange = (text: string) => {
    const formatted = formatDateInput(text);
    setTempDateInput(formatted);
  };

  const handleDateInputFinish = (row: Row, rowIndex: number) => {
    if (tempDateInput.trim() === '') {
      // If empty, just close the input
      setEditingDateIndex(null);
      setTempDateInput('');
      return;
    }

    const validation = validateDate(tempDateInput);
    
    if (!validation.isValid) {
      GlobalAlertManager.show('Lỗi ngày sinh', validation.error || 'Ngày sinh không hợp lệ');
      return; 
    }

    // Convert to dd/MM/yyyy format for storage
    const digits = tempDateInput.replace(/-/g, '');
    const formattedForStorage = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    
    row.onDateChange?.(formattedForStorage);
    setEditingDateIndex(null);
    setTempDateInput('');
  };

  const handleDateInputCancel = () => {
    setEditingDateIndex(null);
    setTempDateInput('');
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {rows.map((row, idx) => (
        <View key={idx} style={styles.row}>
          {(() => {
            const baseText = row.label.replace(/\*/g, '');
            const hasStar = row.label.includes('*');

            return (
              <Text style={styles.label}>
                {baseText}
                {hasStar && <Text style={styles.asterisk}>*</Text>}
              </Text>
            );
          })()}

          {row.type === 'dropdown' ? (
            <View style={[styles.input, styles.dropdownContainer]}>
              <Picker
                selectedValue={row.value}
                enabled={!!row.editable}
                onValueChange={val => row.onChangeText?.(val)}
                style={[
                  styles.textSex,
                  {
                    height: Platform.OS === 'ios' ? 40 : 40, 
                  },
                ]}>
                <Picker.Item
                  label={row.placeholder || 'Không xác định'}
                  value=""
                />
                {row.options?.map(opt => (
                  <Picker.Item
                    key={opt.value}
                    label={opt.label}
                    value={opt.value}
                  />
                ))}
              </Picker>
            </View>
          ) : row.type === 'date' ? (
            <>
              {editingDateIndex === idx ? (
                <View style={[styles.input, styles.dateContainer, {flexDirection: 'row', alignItems: 'center'}]}>
                  <TextInput
                    style={[styles.txtDate, {flex: 1}]}
                    value={tempDateInput}
                    onChangeText={handleDateInputChange}
                    placeholder="dd-MM-yyyy"
                    keyboardType="numeric"
                    maxLength={10} 
                    autoFocus
                  />
                  <TouchableOpacity
                    onPress={() => handleDateInputFinish(row, idx)}
                    style={{marginLeft: 8, paddingHorizontal: 8, paddingVertical: 4}}>
                    <Text style={{color: '#3897F0', fontWeight: '500'}}>OK</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDateInputCancel}
                    style={{marginLeft: 4, paddingHorizontal: 8, paddingVertical: 4}}>
                    <Text style={{color: '#999', fontWeight: '500'}}>Hủy</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.input, styles.dateContainer]}
                  onPress={() => row.editable && handleDateInputStart(idx, row.value)}>
                  <Text style={row.value ? styles.txtDate : styles.txtDatePlaceholder}>
                    {formatDateDisplay(row.value) || row.placeholder || 'dd - MM - yyyy'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            !row.editable ? (
              <Text 
                style={[
                  styles.input, 
                  styles.textContainer, 
                  {
                    borderBottomWidth: 0.5,
                    paddingVertical: 8,
                    fontSize: 16,
                    fontWeight: '400',
                  }
                ]}
                numberOfLines={1}
                ellipsizeMode="tail" 
              >
                {row.value || row.placeholder}
              </Text>
            ) : (
              <AutoGrowingInput
                style={[styles.input, styles.textContainer]}
                value={row.value}
                onChangeText={row.onChangeText}
                placeholder={row.placeholder ?? row.label}
                placeholderTextColor="#979797"
                editable={row.editable}
              />
            )
          )}
        </View>
      ))}
    </View>
  );
};

export default UserInfo;