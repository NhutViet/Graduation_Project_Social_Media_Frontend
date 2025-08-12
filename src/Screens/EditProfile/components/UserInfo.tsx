import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {AutoGrowingInput} from '../../../../components/AutoGrowTexts';
import {useProfileEditingStyles} from './ProfileEditingStyles';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useTheme} from '../../../../src/util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

type Row = {
  label: string;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  onDateChange?: (date: string) => void;
  type?: 'text' | 'date' | 'dropdown' | 'ban';
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
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {rows.map((row, idx) => (
        <View key={idx} style={styles.row}>
          {(() => {
            const baseText = row.label.replace(/\*/g, '');
            return (
              <Text style={[styles.label, {color: row.type === 'ban' ? color.textSecondary : color.text}]}>
                {baseText}
              </Text>
            );
          })()}

          {row.type === 'dropdown' ? (
            <View style={[styles.input, styles.dropdownContainer]}>
              <Picker
                selectedValue={row.value}
                enabled={!!row.editable}
                dropdownIconColor={color.text}
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
                style={[styles.input, {paddingLeft: 16}]}
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
                      // format as dd/MM/yyyy
                      const day = String(selectedDate.getDate()).padStart(
                        2,
                        '0',
                      );
                      const month = String(
                        selectedDate.getMonth() + 1,
                      ).padStart(2, '0');
                      const year = selectedDate.getFullYear();
                      const formatted = `${day}/${month}/${year}`;
                      row.onDateChange(formatted);
                    }
                  }}
                />
              )}
            </>
          ) : !row.editable ? (
            <Text
              style={[
                styles.input,
                styles.textContainer,
                {
                  borderBottomWidth: 0.5,
                  paddingVertical: 8,
                  fontSize: 16,
                  fontWeight: '400',
                  color: row.type === 'ban' ? color.textSecondary : color.text,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {row.value || row.placeholder}
            </Text>
          ) : (
            <AutoGrowingInput
              style={[styles.input, styles.textContainer]}
              value={row.value}
              onChangeText={row.onChangeText}
              placeholder={row.placeholder ?? row.label}
              placeholderTextColor={color.textSecondary}
              editable={row.editable}
              maxLength={row.label === 'Số điện thoại' ? 10 : 255}
            />
          )}
        </View>
      ))}
    </View>
  );
};

export default UserInfo;
