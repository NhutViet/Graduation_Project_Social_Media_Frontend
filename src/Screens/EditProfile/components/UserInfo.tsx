import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {AutoGrowingInput} from '../../../../components/AutoGrowTexts';
import {useProfileEditingStyles} from './ProfileEditingStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
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
  const [showPickerIndex, setShowPickerIndex] = useState<number | null>(null);

  const safeDate = (input?: string): Date => {
    const parsed = new Date(input || '');
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {rows.map((row, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>

          {row.type === 'dropdown' ? (
            <View style={styles.input}>
              <Picker
                selectedValue={row.value}
                enabled={!!row.editable}
                onValueChange={val => row.onChangeText?.(val)}
                style={[
                  styles.textSex,
                  {
                    height: Platform.OS === 'ios' ? 150 : undefined,
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
              <TouchableOpacity
                style={styles.input}
                onPress={() => row.editable && setShowPickerIndex(idx)}>
                <Text style={styles.txtDate}>
                  {row.value || row.placeholder || 'Chọn ngày'}
                </Text>
              </TouchableOpacity>

              {showPickerIndex === idx && (
                <DateTimePicker
                  value={safeDate(row.value)}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowPickerIndex(null);
                    if (selectedDate && row.onDateChange) {
                      const iso = selectedDate.toISOString().split('')[0];
                      row.onDateChange(iso);
                    }
                  }}
                />
              )}
            </>
          ) : (
            <AutoGrowingInput
              style={[styles.input, {minHeight: 40}]}
              value={row.value}
              onChangeText={row.onChangeText}
              placeholder={row.placeholder ?? row.label}
              placeholderTextColor="#979797"
              editable={row.editable}
            />
          )}
        </View>
      ))}
    </View>
  );
};

export default UserInfo;
