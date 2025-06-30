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
    const [d, m, y] = (input || '').split('/');
    const parsed = new Date(Number(y), Number(m) - 1, Number(d));
    return isNaN(parsed.getTime()) ? new Date() : parsed;
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
              <TouchableOpacity
                style={[styles.input, styles.dateContainer]}
                onPress={() => row.editable && setShowPickerIndex(idx)}>
                <Text style={row.value ? styles.txtDate : styles.txtDatePlaceholder}>
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

                    const dismissed = event.type === 'dismissed' || !selectedDate;
                    if (dismissed) {
                      // clear out the value
                      row.onDateChange?.('');
                      return;
                    }

                    const day = selectedDate.getDate();
                    const month = selectedDate.getMonth() + 1;
                    const year = selectedDate.getFullYear();
                    const dd = String(day).padStart(2, '0');
                    const mm = String(month).padStart(2, '0');
                    const formatted = `${dd}/${mm}/${year}`;
                    row.onDateChange?.(formatted);
                  }}
                />
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
